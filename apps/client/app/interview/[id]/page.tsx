'use client'
import { useParams } from 'next/navigation';
import CodeEditor from './Components/CodeEditor';
import TextEditor from './Components/TextEditor';
import { CodeStoreProvider } from '@repo/store/providers/codeStoreProvider';
import { TextStoreProvider } from '@repo/store/providers/textStoreProvider';
import { SessionProvider } from 'next-auth/react';
import JitsiEmbed from './Components/JitsiEmbed';

export default function Interview() {
  const interviewId = useParams<{id: string}>()?.id;

  return (
    <div>
    <h1>Interview ID: {interviewId}</h1>
      <SessionProvider>
        <JitsiEmbed />
      </SessionProvider>
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
