import { JaaSMeeting } from '@jitsi/react-sdk';
import { useEffect, useState } from 'react';
import { createJitsiToken } from '../../../api/jitsi/route';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

export default function JitsiEmbed () {
  const interviewId = useParams<{id: string}>()?.id;
  const [token, setToken] = useState('');
  // TODO: move this shit outta here
  const APPID = 'vpaas-magic-cookie-b5c13518a9d74254a44612fcd66f0ffd';
  // TODO: clean this up maybe
  const session = useSession();
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
      const data = await res.json();
      setToken(data.token);
    };

    fetchToken();
  }, []);

  return (
    <div>
      <JaaSMeeting
      appId= { APPID }
      roomName = { interviewId }
      jwt = { token }
      configOverwrite = {{
        startWithAudioMuted: true,
        disableModeratorIndicator: true,
        startScreenSharing: true,
        enableEmailInStats: false,
        prejoinPageEnabled: false,
        hideConferenceSubject: true,
        toolbarButtons: ['camera', 'microphone', 'settings', 'select-background']
      }}
      interfaceConfigOverwrite = {{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
      }}
      userInfo = {{
          displayName: name? name : 'default',
          email: email? email : 'default@email.com'
      }}
      onApiReady = { (externalApi) => {
          // here you can attach custom event listeners to the Jitsi Meet External API
          // you can also store it locally to execute commands
      } }
      getIFrameRef = { (iframeRef) => { iframeRef.style.height = '600px'; } } />
    </div>
  )
}
