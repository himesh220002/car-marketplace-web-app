import { Button } from '@/components/ui/button'
import Service from '@/Shared/Service'
import { useUser } from '@clerk/clerk-react'

import { useNavigate } from 'react-router-dom';


function OwnersDetail({carDetail}: any) {

  const {user} = useUser();

  const navigation = useNavigate();

  const OnMessageOwnerButtonClick=async() =>{

    const email = user?.primaryEmailAddress?.emailAddress;

    if(!email){
      console.error("User email not found");
      return;
    }

    const userId= email.split('@')[0];
    const OwnerUserId= carDetail?.createdBy.split('@')[0];


    //Create Current User ID
      try{
        await Service.CreateSendBirdUser(
          userId,
          user?.fullName ?? user?.publicMetadata.fullName ?? "Unknown User",
          user?.imageUrl ?? 'https://res.cloudinary.com/dbcx5bxea/image/upload/v1747459046/alt_user_qoqovf.avif')
        .then(resp=>{
          console.log(resp);
        })
      }catch(e){}
    
    //Owner User ID
    try{
      await Service.CreateSendBirdUser(
        OwnerUserId,
        carDetail?.userName ?? "Unknown Owner",
        carDetail?.userImageUrl ?? 'https://res.cloudinary.com/dbcx5bxea/image/upload/v1747459046/alt_user_qoqovf.avif')
        .then(resp=>{
          console.log(resp);
        })
      
    }catch(e){}
    
    //Create Channel
    try{
      await Service.CreateSendBirdChannel([userId,OwnerUserId],carDetail?.listingTitle)
      .then(resp=>{
        console.log(resp);
        console.log("Channel Created");
        navigation('/profile');
      })
    }catch(e){}

  }

    console.log('usrimgurl: ',carDetail?.userImageUrl)
  return (
    <div className='p-10 border rounded-xl shadow-md mt-7'>
        <h2 className='font-medium text-2xl mb-3'>Owner/ Deals</h2>
        <hr/>
        <img src={carDetail?.userImageUrl} className='w-[70px] h-[70px] rounded-full object-cover mt-3'/>
        <h2 className='mt-2 font-bold text-xl'>{carDetail?.userName}</h2>
        <h2 className='mt-2 text-gray-500'>{carDetail?.createdBy}</h2>

        <Button className='w-full mt-6' 
        onClick={OnMessageOwnerButtonClick}
        >Message Owner</Button>
    </div>
  )
}

export default OwnersDetail