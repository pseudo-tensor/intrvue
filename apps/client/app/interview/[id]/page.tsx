'use client'
import { useParams } from 'next/navigation';
import CodeEditor from './Components/CodeEditor';
import TextEditor from './Components/TextEditor';
import { CodeStoreProvider } from '@repo/store/providers/codeStoreProvider';
import { logCodeData } from '../../../lib/collab';

export default function Interview() {
  const interviewId = useParams<{id: string}>()?.id;
    return (
    <div>
     <h1>Interview ID: {interviewId}</h1>
      <button onClick={() => { logCodeData() }}> show current code state </button>
      <div style={{display: 'flex', width: '100%'}}>
        <div style={{flex: 1}}>
          <TextEditor />
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
