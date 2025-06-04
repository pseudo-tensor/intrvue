'use client'
import { keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state'
import { defaultKeymap } from '@codemirror/commands';
import { basicSetup, EditorView } from 'codemirror';
import { useRef, useEffect, useState } from 'react';
import { useCodeStore } from '@repo/store/providers/codeStoreProvider';

export default function CodeEditor() {
  const { code, setCode } = useCodeStore(
    (state) => state,
  )

// const [code, setCode] = useState(''); // switch this out for an actual state
  const editor = useRef<any>(null);
  const valueRef = useRef<string>(code);
  useEffect(() => {
    valueRef.current = code;
  }, [code]);

  useEffect(() => {
    // CodeMirror Extension: update code in store
    const onUpdate = EditorView.updateListener.of((view) => {
      if (view.docChanged) {
        setCode(view.state.doc.toString());
      }
    });
    const codeMirrorOptions = {
      doc: valueRef.current,
      lineNumbers: true,
      lineWrapping: true, // use a state for this
      autoCloseBrackets: true,
      cursorScrollMargin: 48,
      indentUnit: 2,
      tabSize: 2,
      styleActiveLine: true,
      viewportMargin: 99,
      extensions: [
        basicSetup,
        keymap.of(defaultKeymap),
        onUpdate,
      ],
    };

    const startState = EditorState.create(codeMirrorOptions);
    const view = new EditorView({
      state: startState,
      parent: editor.current,
    });

    return () => {
      view.destroy();
    };
  }, []);

  return (
    <div style={{width: 'auto'}} ref={editor} />
  );
}
