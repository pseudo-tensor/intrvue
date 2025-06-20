import * as Y from 'yjs'

import * as syncProtocol from '@y/protocols/sync'
import * as awarenessProtocol from '@y/protocols/awareness'

import * as encoding from 'lib0/encoding'
import * as decoding from 'lib0/decoding'
import * as map from 'lib0/map'

import * as eventloop from 'lib0/eventloop'

import { callbackHandler, isCallbackSet } from './callback'

const CALLBACK_DEBOUNCE_WAIT: number = parseInt(process.env.CALLBACK_DEBOUNCE_WAIT || '2000')
const CALLBACK_DEBOUNCE_MAXWAIT: number = parseInt(process.env.CALLBACK_DEBOUNCE_MAXWAIT || '10000')

const debouncer = eventloop.createDebouncer(CALLBACK_DEBOUNCE_WAIT, CALLBACK_DEBOUNCE_MAXWAIT)

const wsReadyStateConnecting: number = 0
const wsReadyStateOpen: number = 1
const wsReadyStateClosing: number = 2
const wsReadyStateClosed: number = 3

const gcEnabled: boolean = process.env.GC !== 'false' && process.env.GC !== '0'

let persistence: { bindState: (name: string, doc: WSSharedDoc) => void; writeState: (name: string, doc: WSSharedDoc) => Promise<any>; provider?: any } | null = null

export const setPersistence = (persistence_: { bindState: (name: string, doc: WSSharedDoc) => void; writeState: (name: string, doc: WSSharedDoc) => Promise<any>; provider?: any } | null): void => {
  persistence = persistence_
}

export const getPersistence = (): { bindState: (name: string, doc: WSSharedDoc) => void; writeState: (name: string, doc: WSSharedDoc) => Promise<any> } | null => persistence

export const docs: Map<string, WSSharedDoc> = new Map()

const messageSync: number = 0
const messageAwareness: number = 1

const updateHandler = (update: Uint8Array, _origin: any, doc: Y.Doc, _tr?: any): void => {
  const wsDoc = doc as WSSharedDoc
  const encoder = encoding.createEncoder()
  encoding.writeVarUint(encoder, messageSync)
  syncProtocol.writeUpdate(encoder, update)
  const message = encoding.toUint8Array(encoder)
  wsDoc.conns.forEach((_, conn) => send(wsDoc, conn, message))
}

let contentInitializor: (ydoc: Y.Doc) => Promise<void> = _ydoc => Promise.resolve()

export const setContentInitializor = (f: (ydoc: Y.Doc) => Promise<void>): void => {
  contentInitializor = f
}

export class WSSharedDoc extends Y.Doc {
  name: string;
  conns: Map<Object, Set<number>>;
  awareness: awarenessProtocol.Awareness;
  whenInitialized: Promise<void>;

  constructor(name: string) {
    super({ gc: gcEnabled })
    this.name = name
    this.conns = new Map()
    this.awareness = new awarenessProtocol.Awareness(this)
    this.awareness.setLocalState(null)

    const awarenessChangeHandler = ({ added, updated, removed }: { added: Array<number>; updated: Array<number>; removed: Array<number> }, conn: Object | null): void => {
      const changedClients: Array<number> = added.concat(updated, removed)
      if (conn !== null) {
        const connControlledIDs: Set<number> | undefined = this.conns.get(conn);
        if (connControlledIDs !== undefined) {
          added.forEach(clientID => { connControlledIDs.add(clientID) })
          removed.forEach(clientID => { connControlledIDs.delete(clientID) })
        }
      }
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, messageAwareness)
      encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients))
      const buff = encoding.toUint8Array(encoder)
      this.conns.forEach((_, c) => {
        send(this, c, buff)
      })
    }

    this.awareness.on('update', awarenessChangeHandler)
    this.on('update', updateHandler)

    if (isCallbackSet) {
      this.on('update', (_update, _origin, doc) => {
        debouncer(() => callbackHandler(doc as WSSharedDoc))
      })
    }

    this.whenInitialized = contentInitializor(this)
  }
}

export const getYDoc = (docname: string, gc: boolean = true): WSSharedDoc => map.setIfUndefined(docs, docname, () => {
  const doc = new WSSharedDoc(docname)
  doc.gc = gc
  if (persistence !== null) {
    persistence.bindState(docname, doc)
  }
  docs.set(docname, doc)
  return doc
})

const messageListener = (conn: any, doc: any, message: any): void => {
  try {
    // Ensure message is a Uint8Array
    const messageArray = message instanceof Uint8Array ? message : new Uint8Array(message)
    
    // Check if message is not empty
    if (messageArray.length === 0) {
      console.warn('Received empty message, ignoring')
      return
    }
    
    const encoder = encoding.createEncoder()
    const decoder = decoding.createDecoder(messageArray)
    const messageType: number = decoding.readVarUint(decoder)

    switch (messageType) {
      case messageSync:
        encoding.writeVarUint(encoder, messageSync)
        syncProtocol.readSyncMessage(decoder, encoder, doc, conn)

        if (encoding.length(encoder) > 1) {
          send(doc, conn, encoding.toUint8Array(encoder))
        }
        break;

      case messageAwareness: {
        awarenessProtocol.applyAwarenessUpdate(doc.awareness, decoding.readVarUint8Array(decoder), conn)
        break;
      }
      
      default:
        console.warn('Unknown message type:', messageType)
        break;
    }
  } catch (err) {
    console.error('Error processing message:', err)
    // @ts-ignore
    doc.emit('error', [err])
  }
}

const closeConn = (doc: any, conn: any): void => {
  if (doc.conns.has(conn)) {
    // @ts-ignore
    const controlledIds: Set<number> = doc.conns.get(conn);
    doc.conns.delete(conn);

    awarenessProtocol.removeAwarenessStates(doc.awareness,
      Array.from(controlledIds), null);

    if (doc.conns.size === 0 && persistence !== null) {
      persistence.writeState(doc.name, doc).then(() => {
        doc.destroy()
      });
      docs.delete(doc.name);
    }
  }

  conn.close();
}

const send = (doc: any, conn: any, m: ArrayBuffer): void => {
  if (conn.readyState !== wsReadyStateConnecting && conn.readyState !== wsReadyStateOpen) {
    closeConn(doc, conn);
  }

  try {
    conn.send(m, {}, (err: any) => { err != null && closeConn(doc, conn) });
  } catch (e) {
    closeConn(doc, conn);
  }
}

const pingTimeout: number = 30000;

export const setupWSConnection = (conn: any,
  req: any,
  opts: { docName?: string; gc?: boolean } = {}) => {

  conn.binaryType = 'arraybuffer';

  // get doc and initialize it if it does not exist yet.
  let doc = getYDoc(opts.docName || (req.url || '').slice(1).split('?')[0], opts.gc);

  // add connection to the document's connections.
  doc.conns.set(conn, new Set());

  // listen and reply to events.
  conn.on('message', (message: ArrayBuffer) => {
    if (message.byteLength === 0) {
      console.warn('Received empty message buffer, ignoring')
      return
    }
    messageListener(conn, doc, new Uint8Array(message))
  });

  let pongReceived: boolean = true;

  // Check if connection is still alive.
  let pingInterval = setInterval(() => {

    if (!pongReceived) {
      if (doc.conns.has(conn)) {
        closeConn(doc, conn);
      }

      clearInterval(pingInterval);

    } else if (doc.conns.has(conn)) {
      pongReceived = false;

      try {
        conn.ping();
      } catch (e) {
        closeConn(doc, conn);
        clearInterval(pingInterval);
      }
    }
  }, pingTimeout);

  conn.on('close', () => {
    closeConn(doc, conn);
    clearInterval(pingInterval);
  });

  conn.on('pong', () => {
    pongReceived = true;
  });

  // Send sync step 1
  {
    let encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    syncProtocol.writeSyncStep1(encoder, doc);

    send(doc, conn, encoding.toUint8Array(encoder));
    
    let awarenessStates = doc.awareness.getStates();

    if (awarenessStates.size > 0) {
      let encoder2 = encoding.createEncoder();
      encoding.writeVarUint(encoder2, messageAwareness);
      encoding.writeVarUint8Array(encoder2, awarenessProtocol.encodeAwarenessUpdate(doc.awareness, Array.from(awarenessStates.keys())));

      send(doc, conn, encoding.toUint8Array(encoder2));
    }
  }
}
