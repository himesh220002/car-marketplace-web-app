# SendBird Helper Server

Small Express helper that issues per-user SendBird tokens server-side so the Admin API token isn't exposed to the client.

Usage

1. Install dependencies (from `server/`):

```bash
cd server
npm install
```

2. Ensure environment variables are available (the project root `.env` already contains `VITE_SENDBIRD_APP_ID` and `VITE_SENDBIRD_API_TOKEN`). You can also create a `server/.env` with the same keys.

3. Start the server:

```bash
npm run start
# or for dev with auto-reload:
npm run dev
```

4. Call the token endpoint from the client:

POST /api/sendbird/token
Body JSON: { userId, nickname?, profileUrl? }

Response: { token } on success, or { error, details } on failure.

Notes
- This helper is intended for development and staging. For production, secure this endpoint with your app auth and run it behind HTTPS.
- It tries the session-token endpoint first (POST /v3/users/{id}/token). If session tokens are not enabled, it falls back to creating a user with `issue_access_token:true` to obtain a legacy access_token on create.
