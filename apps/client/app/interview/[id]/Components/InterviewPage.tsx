'use client'
import { useParams } from 'next/navigation';
import CodeEditor from './CodeEditor';
import TextEditor from './TextEditor';
import { CodeStoreProvider } from '@repo/store/providers/codeStoreProvider';
import { TextStoreProvider } from '@repo/store/providers/textStoreProvider';
import { SessionProvider, useSession } from 'next-auth/react';
import JitsiEmbed from './JitsiEmbed';
import Redirecting from './Redirecting';
import Loading from '../../../_globalComponents/Loading';
import { codeStore } from '@repo/store/stores/codeStore'
import { useState, useEffect } from 'react';
import { interviewStore } from '@repo/store/stores/interviewStore';
import { textStore } from '@repo/store/stores/textStore';
// import { getInterviewDetails } from '../../../api/interview/route';
// import { useInterviewStore } from '@repo/store/providers/interviewStoreProvider';
import { useRouter } from 'next/navigation';
import Redirecting from './Redirecting';

export default function InterviewPage() {
  const session = useSession();
  if (session.status == 'unauthenticated') return (<Redirecting />);
  if (session.status != 'authenticated') return (<Loading />);

  return (
    <div>
      <InterviewPageContent />
    </div>
  );
}

function InterviewPageContent() {
  // const interview = useInterviewStore((s) => s)
  // const setInterview = useInterviewStore((s) => s.setInterview)
  const [showID, setShowID] = useState(false);
  const interviewId = useParams<{id: string}>()?.id;
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    let prevCode = codeStore.getState().code;

    const unsub = codeStore.subscribe((state) => {
      const nextCode = state.code;
      if (nextCode !== prevCode) {
        prevCode = nextCode;
        interviewStore.setState((prev) => ({
          ...prev,
          code_data: nextCode,
        }));
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    let prevText = textStore.getState().docJSON;

    const unsub = textStore.subscribe((state) => {
      const nextText = state.docJSON;
      if (nextText !== prevText) {
        prevText = nextText;
        interviewStore.setState((prev) => ({
          ...prev,
          text_data: nextText,
        }));
      }
    });
   return () => unsub();
  }, []);

  if (session.status == 'loading') {
    return (
      <div>
        <Loading />
      </div>
    )
  }
  if (session.status == 'unauthenticated') {
    return (
      <div>
        <Redirecting />
      </div>
    )
  }

  return (
    <div>
      <div className='flex w-full'>
        <div className='flex-1'>
          <SessionProvider>
            <JitsiEmbed />
          </SessionProvider>
          <TextStoreProvider>
            <TextEditor />
          </TextStoreProvider>
        </div>
        <div className='flex-1'>
          <CodeStoreProvider>
            <CodeEditor />
          </CodeStoreProvider>
        </div>
      </div>
    </div>
  );
}
