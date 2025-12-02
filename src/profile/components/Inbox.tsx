//src/profile/components/Inbox.tsx
import { useEffect, useState } from 'react'
import { SendBirdProvider } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';
import { useUser } from '@clerk/clerk-react';
import { GroupChannelList } from '@sendbird/uikit-react/GroupChannelList';
import { GroupChannel } from '@sendbird/uikit-react/GroupChannel';
import Service from '@/Shared/Service';



function Inbox() {
  const { user } = useUser();
  const [userId, setUserId] = useState<string>();
  const [channelUrl, setChannelUrl] = useState<string>();
  const [accessToken, setAccessToken] = useState<string | undefined>();

  useEffect(() => {
    if (user) {
      const raw = (user.primaryEmailAddress?.emailAddress) ?? '';
      // derive a safe sendbird-friendly id (remove spaces and @domain part)
      const id = raw.split('@')[0].replace(/\s+/g, '_');
      setUserId(id);

      // Log for debugging SendBird init issues (will appear in browser console)
      // Avoid printing secrets here — only surface non-sensitive values.

      // setUserId(user.id);

      console.debug('[Inbox] derived userId for SendBird:', id);
      // Try to create / fetch the user and obtain a user access token from SendBird.
      (async () => {
        try {
          // Service returns an object that may contain access_token in several shapes.
          const resp = await Service.CreateSendBirdUser(id, user?.fullName ?? 'Unknown User', user?.imageUrl ?? '');
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const token = (resp as any)?.token ?? (resp as any)?.access_token ?? (resp as any)?.data?.access_token ?? (resp as any)?.accessToken;
          if (token) {
            setAccessToken(token);
            console.debug('[Inbox] obtained SendBird user access token (masked):', String(token).slice(0, 8) + '...');
          } else {
            // Helpful debug for missing token cases (do not print secrets)
            console.warn('[Inbox] CreateSendBirdUser did not return a token. Response shape:', Object.keys(resp || {}));
          }
        } catch (e) {
          console.error('[Inbox] could not obtain SendBird user token:', e);
        }
      })();

    }
  }, [user])

  if (!userId) {
    // Provide a small visible hint in the UI so developers/users can see why chat isn't rendering.
    if (!user) {
      return <div className="p-4 text-sm text-gray-700">Please sign in to access messages.</div>;
    }
    return <div className="p-4 text-sm text-gray-700">Preparing chat — no SendBird user id yet.</div>;
  }

  const sbAppId = import.meta.env.VITE_SENDBIRD_APP_ID;
  if (!sbAppId) {

    console.error('[Inbox] Missing VITE_SENDBIRD_APP_ID — SendBird UI will not initialize.');
    return <div className="p-4 text-sm text-red-600">Chat is not configured.</div>;
  }

  // If we don't have a per-user token (session token or legacy access token), don't initialize SendBirdProvider.
  if (!accessToken) {
    console.warn('[Inbox] No SendBird token available — chat will not initialize. Ensure session tokens are enabled or create users with issue_access_token:true via Admin API.');
    return (
      <div className="p-4 text-sm text-gray-700">
        Chat unavailable — token issuance not enabled for this SendBird app. For local testing you can create a user via the Admin API with <code>issue_access_token: true</code>, or contact SendBird support to enable session tokens for your app.
      </div>
    );
  }

  return (
    <div className='bg-orange-100 p-0  md:px-4 md:py-2'>
      <div style={{ width: '100%', height: '100vh' }}>
        <SendBirdProvider
          appId={sbAppId}
          userId={userId}
          nickname={user?.fullName ?? "Unknown User"}
          profileUrl={user?.imageUrl ?? "https://res.cloudinary.com/dbcx5bxea/image/upload/v1747459046/alt_user_qoqovf.avif"}
          allowProfileEdit={true}
          accessToken={accessToken}

          imageCompression={{
            compressionRate: 0.5,
            // The default value changed from 1.0 to 0.7 starting in v3.3.3.
            resizingWidth: 200,
            resizingHeight: 200,
          }}

        >
          <div className='grid grid-cols-1 lg:flex gap-1 md:gap-2 h-full '>
            {/* Channel List */}
            <div className=' border shadow-lg  '>
              <GroupChannelList
                onChannelSelect={(channel) => {
                  if (channel?.url) {
                    setChannelUrl(channel.url); // safely assign if url exists
                  }
                }}
                onChannelCreated={(channel) => {
                  if (channel?.url) {
                    setChannelUrl(channel.url); // auto-open the newly created channel
                  }
                }}
                channelListQueryParams={
                  {
                    includeEmpty: true
                  }
                }
                className='mx-auto'


              />

            </div>
            {/* Channel Message Area */}
            <div className='w-full items-center justify-center  shadow-lg'>
              {channelUrl && <GroupChannel channelUrl={channelUrl} />}

            </div>
          </div>




        </SendBirdProvider >
        {/* 
      This super smart component serves as a drop-in chat solution
      
      For advanced 🚀 customizations, use SendbirdProvider:
      https://sendbird.com/docs/chat/uikit/v3/react/essentials/sendbirdprovider
    */}
        {/* <SendbirdApp
      appId={import.meta.env.VITE_SENDBIRD_APP_ID}
      userId={userId}
      accessToken={import.meta.env.VITE_SENDBIRD_ACCESS_TOKEN} // Optional, but recommended
    /> */}
      </div>
    </div>
  )
}

export default Inbox