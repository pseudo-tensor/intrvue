'use client'
import { useParams } from 'next/navigation';
import CodeEditor from './Components/CodeEditor';
import TextEditor from './Components/TextEditor';
import { CodeStoreProvider } from '@repo/store/providers/codeStoreProvider';
import { logCodeData, logTextData } from '../../../lib/collab';
import { TextStoreProvider } from '@repo/store/providers/textStoreProvider';
import { updateCodeExternally, updateTextExternally } from '../../../lib/storeTest';

export default function Interview() {
  const interviewId = useParams<{id: string}>()?.id;
    return (
    <div>
     <h1>Interview ID: {interviewId}</h1>
      <button onClick={() => { logTextData() }}> show current text state </button>
      <button onClick={() => { logCodeData() }}> show current code state </button>
      <button onClick={() => { updateTextExternally() }}> change text from outside </button>
      <button onClick={() => { updateCodeExternally() }}> change code from outside </button>
      <div style={{display: 'flex', width: '100%'}}>
        <div style={{flex: 1}}>
          <TextStoreProvider>
            <TextEditor />
          </TextStoreProvider>
        </div>
        <div style={{flex: 1}}>
          <CodeStoreProvider>
            <CodeEditor />
          </CodeStoreProvider>
        </div>
      </div>
    </div>
  );
}
