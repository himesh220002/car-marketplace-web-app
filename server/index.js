import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

const SB_APP_ID = process.env.VITE_SENDBIRD_APP_ID;
const SB_API_TOKEN = process.env.VITE_SENDBIRD_API_TOKEN;

if (!SB_APP_ID || !SB_API_TOKEN) {
  console.warn('Warning: VITE_SENDBIRD_APP_ID or VITE_SENDBIRD_API_TOKEN not set in environment. Server will start but requests will fail until set.');
}

// POST /api/sendbird/token
// body: { userId, nickname?, profileUrl? }
// returns: { token } or { error, details }
app.post('/api/sendbird/token', async (req, res) => {
  const { userId, nickname, profileUrl } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'missing_userId' });

  const appHost = `api-${SB_APP_ID}.sendbird.com`;
  const headers = {
    'Content-Type': 'application/json',
    'Api-Token': SB_API_TOKEN,
  };

  // helper to call /token endpoint
  const issueTokenForUser = async () => {
    const url = `https://${appHost}/v3/users/${encodeURIComponent(userId)}/token`;
    const r = await axios.post(url, { expires_at: 0 }, { headers });
    return r.data; // { token, expires_at } or legacy { access_token }
  };

  try {
    // Fast path: try issuing session token
    try {
      const tokenRes = await issueTokenForUser();
      const token = tokenRes?.token ?? tokenRes?.access_token;
      if (token) return res.json({ token });
    } catch (e) {
      // If 400, session tokens not enabled; continue to fallback below
      if (!(e?.response && e.response.status === 400)) {
        // log for visibility but continue to fallback
        console.warn('issueTokenForUser failure (continuing to fallback):', e?.message ?? e);
      } else {
        console.info('Session tokens not enabled for app — falling back to legacy create flow.');
      }
    }

    // Fallback: try creating user with issue_access_token:true to get legacy token on create
    const createUrl = `https://${appHost}/v3/users`;
    try {
      const createRes = await axios.post(createUrl, {
        user_id: userId,
        nickname: nickname ?? 'Unknown User',
        profile_url: profileUrl ?? '',
        issue_access_token: true,
      }, { headers });

      const returnedToken = createRes.data?.token ?? createRes.data?.access_token;
      if (returnedToken) return res.json({ token: returnedToken });
      // user created but no token returned
      return res.status(200).json({ user: createRes.data, message: 'user_created_no_token' });
    } catch (createErr) {
      const errData = createErr?.response?.data;
      // If user already exists or unique violation, try to GET and attempt token issue once more
      if (errData && (errData.code === 400202 || String(errData.message).toLowerCase().includes('unique') || String(errData.message).toLowerCase().includes('exists'))) {
        try {
          // Try issuing token again (some apps might allow this after ensure)
          const tokenRes2 = await issueTokenForUser();
          const token2 = tokenRes2?.token ?? tokenRes2?.access_token;
          if (token2) return res.json({ token: token2 });
          return res.status(200).json({ user: null, message: 'user_exists_no_token_available' });
        } catch (e2) {
          // If we can't get a token, just return success so the client can try to connect without one
          console.warn('Could not issue token for existing user (session tokens likely disabled):', e2?.message);
          return res.status(200).json({ token: null, message: 'user_exists_token_issuance_failed' });
        }
      }

      return res.status(500).json({ error: 'create_failed', details: errData ?? createErr?.message ?? String(createErr) });
    }

  } catch (outerErr) {
    console.error('Unexpected error in /api/sendbird/token:', outerErr?.message ?? outerErr);
    return res.status(500).json({ error: 'unexpected', details: outerErr?.message ?? outerErr });
  }
});

app.listen(PORT, () => {
  console.log(`SendBird helper server listening on http://localhost:${PORT}`);
});
