
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

// const SendBirdApplicationId = import.meta.env.VITE_SENDBIRD_APP_ID; // Moved into functions
// const SendBirdApiToken = import.meta.env.VITE_SENDBIRD_API_TOKEN; // Moved into functions

type CarListing = {
    id: number;
    features?: any;
    [key: string]: any;
};

type ResponseItem = {
    // carListing may sometimes be missing fields in tests; allow partial listing
    carListing?: Partial<CarListing> | undefined;
    carImages?: any | null;
};



const FormatResult = (resp: ResponseItem[]): CarListing[] => {
    const result: Record<number, { car: CarListing; images: any[] }> = {};
    const finalResult: CarListing[] = [];

    resp.forEach((item) => {
        const listingId = item.carListing?.id;
        if (!listingId || !item.carListing) return;

        if (!result[listingId]) {
            result[listingId] = {
                car: item?.carListing as CarListing,
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

const CreateSendBirdUser = async (userId: string, nickName: any, profileUrl: string) => {
    const SendBirdApplicationId = import.meta.env.VITE_SENDBIRD_APP_ID;
    const SendBirdApiToken = import.meta.env.VITE_SENDBIRD_API_TOKEN;

    // Helper to issue a user access token for an existing user
    const issueTokenForUser = async () => {
        const res = await axios.post(
            `https://api-${SendBirdApplicationId}.sendbird.com/v3/users/${userId}/issue_access_token`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Token': SendBirdApiToken,
                },
            }
        );
        return res.data;
    };

    // First, try to issue a token directly (fast path).
    try {
        const tokenRes = await issueTokenForUser();
        return { access_token: tokenRes.access_token };
    } catch (err: any) {
        // If issuing token is not available (404) we fall back to check/create flow.
        if (!(err?.response && err.response.status === 404)) {
            // For other errors, continue to fallback flow but log for visibility
            console.warn('Issue token attempt failed, falling back to user-create flow:', err?.message ?? err);
        }
    }

    // Fallback flow: check if user exists; if not create with issue_access_token=true.
    try {
        const checkUser = await axios.get(`https://api-${SendBirdApplicationId}.sendbird.com/v3/users/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Api-Token': SendBirdApiToken,
            },
        });

        if (checkUser.status === 200) {
            console.log(`✅ User ${userId} already exists in SendBird.`);
            // Try issuing token again (some apps allow it after a create/ensure step)
            try {
                const tokenAgain = await issueTokenForUser();
                return { user: checkUser.data, access_token: tokenAgain.access_token };
            } catch (e) {
                // token issuance not available or failed; return user info and indicate no token
                console.warn('Token issuance not available after user exists:', (e as any)?.message ?? e);
                return { user: checkUser.data };
            }
        }
    } catch (error: any) {
        // If user doesn't exist (404) create with issue_access_token true to get token on creation.
        if (error?.response && error.response.status === 404) {
            try {
                const createRes = await axios.post(
                    `https://api-${SendBirdApplicationId}.sendbird.com/v3/users`,
                    {
                        user_id: userId,
                        nickname: nickName || 'Unknown User',
                        profile_url: profileUrl || 'https://res.cloudinary.com/dbcx5bxea/image/upload/v1747459046/alt_user_qoqovf.avif',
                        issue_access_token: true,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Api-Token': SendBirdApiToken,
                        },
                    }
                );
                return { user: createRes.data, access_token: createRes.data.access_token };
            } catch (createErr: any) {
                // If create fails because user already exists (4002), try issuing token again.
                const errData = createErr?.response?.data;
                if (errData && (errData.code === 4002 || String(errData.message).toLowerCase().includes('unique') || String(errData.message).toLowerCase().includes('exists'))) {
                    try {
                        const tokenRes = await issueTokenForUser();
                        return { access_token: tokenRes.access_token };
                    } catch (tokenErr: any) {
                        console.error('Create user failed with unique constraint and issuing token also failed:', tokenErr?.message ?? tokenErr);
                        return { error: 'token_unavailable', details: tokenErr?.message ?? tokenErr };
                    }
                }

                console.error('❌ Error creating SendBird user:', createErr?.message ?? createErr);
                return { error: 'create_failed', details: createErr?.message ?? createErr };
            }
        }

        // unexpected error while checking user
        console.error('❌ Error checking SendBird user existence:', error?.message ?? error);
        return { error: 'check_failed', details: error?.message ?? error };
    }
};

const CreateSendBirdChannel=(users:any,title:any)=>{
    const SendBirdApplicationId = import.meta.env.VITE_SENDBIRD_APP_ID;
    const SendBirdApiToken = import.meta.env.VITE_SENDBIRD_API_TOKEN;
    return axios.post(`https://api-${SendBirdApplicationId}.sendbird.com/v3/group_channels`,{ // Template literal for consistency
        user_ids: users,
        is_distinct: true,
        name: title,

    },{
        headers:{
            'Content-Type': 'application/json',
            'Api-Token': SendBirdApiToken
        }
    })
};

export default { 
    FormatResult,
    CreateSendBirdUser,
    CreateSendBirdChannel
 };
