'use client'
import { useParams } from 'next/navigation';
import CodeEditor from './Components/CodeEditor';
import TextEditor from './Components/TextEditor';
import { CounterStoreProvider } from '../../../providers/counterStoreProvider';
import CounterComponent from './Components/Counter';

export default function Interview() {
  const interviewId = useParams<{id: string}>()?.id;
    return (
    <div>
      <CounterStoreProvider>
        <CounterComponent />
      </CounterStoreProvider>
      <h1>Interview ID: {interviewId}</h1>
      <div style={{display: 'flex', width: '100%'}}>
        <div style={{flex: 1}}>
          <TextEditor />
        </div>
        <div style={{flex: 1}}>
          <CodeEditor />
        </div>
      </div>
    </div>
  );
}
