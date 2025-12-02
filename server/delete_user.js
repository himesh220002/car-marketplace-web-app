import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

const SB_APP_ID = process.env.VITE_SENDBIRD_APP_ID;
const SB_API_TOKEN = process.env.VITE_SENDBIRD_API_TOKEN;
const USER_ID = 'versionname4'; // The user having issues

if (!SB_APP_ID || !SB_API_TOKEN) {
    console.error('Missing env vars');
    process.exit(1);
}

async function deleteUser() {
    try {
        const url = `https://api-${SB_APP_ID}.sendbird.com/v3/users/${USER_ID}`;
        console.log(`Deleting user ${USER_ID}...`);
        await axios.delete(url, {
            headers: { 'Api-Token': SB_API_TOKEN }
        });
        console.log(`Successfully deleted user ${USER_ID}. Please reload the app to recreate them with a fresh token.`);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log(`User ${USER_ID} not found (already deleted?).`);
        } else {
            console.error('Failed to delete user:', error.message);
        }
    }
}

deleteUser();
