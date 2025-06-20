import http from 'http'
import * as number from 'lib0/number'

const CALLBACK_URL: URL | null = process.env.CALLBACK_URL ? new URL(process.env.CALLBACK_URL) : null
const CALLBACK_TIMEOUT: number = number.parseInt(process.env.CALLBACK_TIMEOUT || '5000')
const CALLBACK_OBJECTS: Record<string, string> = process.env.CALLBACK_OBJECTS ? JSON.parse(process.env.CALLBACK_OBJECTS) : {}

export const isCallbackSet: boolean = !!CALLBACK_URL

export const callbackHandler = (doc: import('./utils.js').WSSharedDoc): void => {
  const room: string = doc.name
  const dataToSend: { room: string; data: Record<string, { type: string; content: any }> } = {
    room,
    data: {}
  }
  const sharedObjectList: string[] = Object.keys(CALLBACK_OBJECTS)
  sharedObjectList.forEach(sharedObjectName => {
    const sharedObjectType: string = CALLBACK_OBJECTS[sharedObjectName]? CALLBACK_OBJECTS[sharedObjectName] : '';
    dataToSend.data[sharedObjectName] = {
      type: sharedObjectType,
      content: getContent(sharedObjectName, sharedObjectType, doc).toJSON()
    }
  })
  CALLBACK_URL && callbackRequest(CALLBACK_URL, CALLBACK_TIMEOUT, dataToSend)
}

/**
 * @param {URL} url
 * @param {number} timeout
 * @param {Object} data
 */
const callbackRequest = (url: URL, timeout: number, data: object): void => {
  const stringData = JSON.stringify(data);
  const options: http.RequestOptions = {
    hostname: url.hostname,
    port: Number(url.port),
    path: url.pathname,
    timeout,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(stringData)
    }
  }
  const req = http.request(options)
  req.on('timeout', () => {
    console.warn('Callback request timed out.')
    req.abort()
  })
  req.on('error', (e) => {
    console.error('Callback request error.', e)
    req.abort()
  })
  req.write(data)
  req.end()
}

/**
 * @param {string} objName
 * @param {string} objType
 * @param {import('./utils.js').WSSharedDoc} doc
 */
const getContent = (objName: string, objType: string, doc: import('./utils.js').WSSharedDoc): any => {
  switch (objType) {
    case 'Array': return doc.getArray(objName)
    case 'Map': return doc.getMap(objName)
    case 'Text': return doc.getText(objName)
    case 'XmlFragment': return doc.getXmlFragment(objName)
    case 'XmlElement': return doc.getXmlElement(objName)
    default : return {}
  }
}
