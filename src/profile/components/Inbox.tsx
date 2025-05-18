import React, { useEffect, useState } from 'react'
import { App as SendbirdApp, SendBirdProvider } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';
import { useUser } from '@clerk/clerk-react';
import { GroupChannelList } from '@sendbird/uikit-react/GroupChannelList';
import { GroupChannel } from '@sendbird/uikit-react/GroupChannel';


function Inbox() {
    const {user} = useUser();
    const [userId,setUserId] = useState();
    const [channelUrl,setChannelUrl]= useState();

    useEffect(()=>{
        if(user){
          const id= (user.primaryEmailAddress?.emailAddress)?.split('@')[0];
          setUserId(id);
            
        }
    },[user]) 

    
  return (
    <div className='bg-orange-100 px-4 py-2'>
    <div style={{ width:'100%', height:'600px'}}>
        <SendBirdProvider 
        appId={import.meta.env.VITE_SENDBIRD_APP_ID}
        userId={userId}
        nickname={user?.fullName}
        profileUrl={user?.imageUrl}
        allowProfileEdit={true}
        // accessToken={import.meta.env.VITE_SENDBIRD_ACCESS_TOKEN}
        >
          <div className='grid grid-cols-1 md:flex  gap-2  h-full '>
            {/* Channel List */}
            <div className=' border shadow-lg  '>
              <GroupChannelList 
              onChannelSelect={(channel)=>{
                setChannelUrl(channel?.url)
              }}
              channelListQueryParams={
                {
                  includeEmpty:true
                }
              }
              className='mx-auto'
              
              
              />
              
            </div>
            {/* Channel Message Area */}
            <div className='w-full items-center justify-center  shadow-lg'>
              <GroupChannel channelUrl={channelUrl}/>
              
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