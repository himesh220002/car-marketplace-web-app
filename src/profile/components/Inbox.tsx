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
      const id = (user.primaryEmailAddress?.emailAddress)?.split('@')[0];
      setUserId(id);

    }
  }, [user])

  if (!userId) return null;

  return (
    <div className='bg-orange-100 p-0  md:px-4 md:py-2'>
      <div style={{ width: '100%', height: '100vh' }}>
        <SendBirdProvider
          appId={import.meta.env.VITE_SENDBIRD_APP_ID}
          userId={userId}
          nickname={user?.fullName ?? "Unknown User"}
          profileUrl={user?.imageUrl ?? "https://res.cloudinary.com/dbcx5bxea/image/upload/v1747459046/alt_user_qoqovf.avif"}
          allowProfileEdit={true}
        // accessToken={import.meta.env.VITE_SENDBIRD_ACCESS_TOKEN}

        imageCompression={{
                compressionRate: 0.5,
                // The default value changed from 1.0 to 0.7 starting in v3.3.3.
                resizingWidth: 200,
                resizingHeight: '200px',
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