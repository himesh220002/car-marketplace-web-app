import { useEffect, useState } from 'react'
import { SendBirdProvider } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';
import { useUser } from '@clerk/clerk-react';
import { GroupChannelList } from '@sendbird/uikit-react/GroupChannelList';
import { GroupChannel } from '@sendbird/uikit-react/GroupChannel';



function Inbox() {
  const { user } = useUser();
  const [userId, setUserId] = useState<string>();
  const [channelUrl, setChannelUrl] = useState<string>();

  useEffect(() => {
    if (user) {
      const raw = (user.primaryEmailAddress?.emailAddress) ?? '';
      // derive a safe sendbird-friendly id (remove spaces and @domain part)
      const id = raw.split('@')[0].replace(/\s+/g, '_');
      setUserId(id || undefined);

      // Log for debugging SendBird init issues (will appear in browser console)
      // Avoid printing secrets here — only surface non-sensitive values.
       
      console.debug('[Inbox] derived userId for SendBird:', id);

    }
  }, [user])

  if (!userId) return null;

  const sbAppId = import.meta.env.VITE_SENDBIRD_APP_ID;
  if (!sbAppId) {
     
    console.error('[Inbox] Missing VITE_SENDBIRD_APP_ID — SendBird UI will not initialize.');
    return <div className="p-4 text-sm text-red-600">Chat is not configured.</div>;
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
          accessToken={import.meta.env.VITE_SENDBIRD_ACCESS_TOKEN}

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