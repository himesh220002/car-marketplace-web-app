
import axios from "axios";

const SendBirdApplicationId = import.meta.env.VITE_SENDBIRD_APP_ID;
const SendBirdApiToken = import.meta.env.VITE_SENDBIRD_API_TOKEN;

type CarListing = {
    id: number;
    [key: string]: any;
};

type ResponseItem = {
    carListing?: CarListing;
    carImages?: any[];
};

const FormatResult = (resp: ResponseItem[]): CarListing[] => {
    let result: Record<number, { car: CarListing; images: any[] }> = {};
    let finalResult: CarListing[] = [];

    resp.forEach((item) => {
        const listingId = item.carListing?.id;
        if (!listingId) return;

        if (!result[listingId]) {
            result[listingId] = {
                car: item.carListing,
                images: []
            };
        }

        if (item.carImages) {
            result[listingId].images.push(item.carImages);
        }
    });

    Object.values(result).forEach(({ car, images }) => {
        finalResult.push({
            ...car,
            images
        });
    });

    return finalResult;
};

const CreateSendBirdUser=async(userId,nickName,profileUrl)=>{
    try {
        // First, check if the user already exists in SendBird
        const checkUser = await axios.get(`https://api-${SendBirdApplicationId}.sendbird.com/v3/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Api-Token': SendBirdApiToken,
          },
        });
    
        if (checkUser.status === 200) {
          console.log(`✅ User ${userId} already exists in SendBird, skipping creation.`);
          return checkUser.data; // Return existing user data
        }
      } catch (error) {
        // If the user doesn't exist, the API will return an error, so proceed with creation
        if (error.response?.status !== 404) {
          console.error("❌ Error checking user existence:", error);
          return;
        }
      }

    return axios.post('https://api-'+SendBirdApplicationId+'.sendbird.com/v3/users',{
        user_id: userId,
        nickname: nickName || 'Unknown User',
        profile_url: profileUrl || 'https://res.cloudinary.com/dbcx5bxea/image/upload/v1747459046/alt_user_qoqovf.avif',
        issue_access_token: false
    },{
        headers:{
            'Content-Type': 'application/json',
            'Api-Token':SendBirdApiToken
        }
    })
}

const CreateSendBirdChannel=(users,title)=>{
    return axios.post('https://api-'+SendBirdApplicationId+'.sendbird.com/v3/group_channels',{
        user_ids: users,
        is_distinct: true,
        name: title,

    },{
        headers:{
            'Content-Type': 'application/json',
            'Api-Token':SendBirdApiToken
        }
    })
};

export default { 
    FormatResult,
    CreateSendBirdUser,
    CreateSendBirdChannel
 };
