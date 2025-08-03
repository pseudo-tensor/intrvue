import { JaaSMeeting } from '@jitsi/react-sdk';
import { useEffect, useState } from 'react';
import { createJitsiToken } from '../../../../lib/jitsiToken';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { APPID } from '../../../_globalComponents/config';
import Loading from '../../../_globalComponents/Loading';
import Redirecting from './Redirecting';

export default function JitsiEmbed({ session } : {session : any}) {
  if (session.status === 'loading') return <Loading />;
  if (session.status === 'unauthenticated') return <Redirecting />;
  
  return (
    <div>
      <JitsiEmbedContent session={session} />
    </div>
  );
}

function JitsiEmbedContent({ session } : {session : any}) {

  const interviewId = useParams<{id: string}>()?.id;
  const [token, setToken] = useState('');
  
  const id = session.data?.user.id;
  const name = session.data?.user.name;
  const email = session.data?.user.email;

  useEffect(() => {
    const fetchToken = async () => {
      if (!id || !name || !email) return;
      const res = await createJitsiToken({
        id: id,
        name: name,
        email: email
      });
      if (!res.success) return;
      setToken(res.token!);
    };
    fetchToken();
  }, [id, name, email]);

  return (
    <div>
      <JaaSMeeting
        appId={APPID}
        roomName={interviewId}
        jwt={token}
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
          startScreenSharing: true,
          enableEmailInStats: false,
          prejoinPageEnabled: false,
          hideConferenceSubject: true,
          toolbarButtons: ['camera', 'microphone', 'settings', 'select-background']
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
        }}
        userInfo={{
          displayName: name || 'default',
          email: email || 'default@email.com'
        }}
        onApiReady={(externalApi) => {
          // here you can attach custom event listeners to the Jitsi Meet External API
          // you can also store it locally to execute commands
        }}
        getIFrameRef={(iframeRef) => { 
          iframeRef.style.height = '50vh';
        }}
      />
    </div>
  );
}
