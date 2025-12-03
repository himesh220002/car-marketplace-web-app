import { useEffect, useState, useRef } from 'react'
import { SendBirdProvider } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';
import { useUser } from '@clerk/clerk-react';
import { GroupChannelList } from '@sendbird/uikit-react/GroupChannelList';
import { GroupChannel } from '@sendbird/uikit-react/GroupChannel';
import { FiArrowLeft } from 'react-icons/fi';
import Service from '@/Shared/Service';

function Inbox() {
  const { user } = useUser();
  const [userId, setUserId] = useState<string>();
  const [channelUrl, setChannelUrl] = useState<string>();
  const [accessToken, setAccessToken] = useState<string | undefined>();

  // Track if we're intentionally selecting a channel (vs auto-select from GroupChannelList)
  const allowSelectionRef = useRef(true);

  useEffect(() => {
    if (user) {
      const raw = (user.primaryEmailAddress?.emailAddress) ?? '';
      // derive a safe sendbird-friendly id (remove spaces and @domain part)
      const id = raw.split('@')[0].replace(/\s+/g, '_');
      setUserId(id);

      console.debug('[Inbox] derived userId for SendBird:', id);

      // Try to create / fetch the user and obtain a user access token from the server helper.
      (async () => {
        try {
          // Prefer calling the helper server that holds the Admin API token.
          // Use an env var for the helper URL so devs can override (or proxy /api to it).
          const helperUrl = import.meta.env.VITE_SB_HELPER_URL ?? 'http://localhost:8080';
          const serverResp = await fetch(`${helperUrl}/api/sendbird/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: id, nickname: user?.fullName ?? 'Unknown User', profileUrl: user?.imageUrl ?? '' }),
          });

          if (serverResp.ok) {
            // If the helper returned JSON, parse it. Use a safe parse to avoid exceptions on empty bodies.
            let serverData = null;
            try {
              serverData = await serverResp.json();
            } catch {
              console.warn('[Inbox] helper returned no JSON body');
            }
            const tokenFromServer = serverData?.token ?? serverData?.access_token;
            if (tokenFromServer) {
              setAccessToken(tokenFromServer);
              console.debug('[Inbox] obtained SendBird user access token from server (masked):', String(tokenFromServer).slice(0, 8) + '...');
              return;
            }
            console.warn('[Inbox] helper responded OK but did not return token:', serverData);
          } else {
            // Non-OK (404/500) — log and fall back to client helper
            console.warn(`[Inbox] helper server request failed: ${serverResp.status} ${serverResp.statusText}`);
          }

          // If server did not return a token (e.g., server not running), fall back to the in-browser Service helper.
          console.warn('[Inbox] falling back to client-side CreateSendBirdUser');
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

  // If we don't have a per-user token, we log a warning but still try to initialize.
  if (!accessToken) {
    console.warn('[Inbox] No SendBird token available — chat will initialize without token. Write access might be restricted.');
  }

  return (
    <div className='bg-gradient-to-br from-gray-100 to-gray-200 p-0 lg:px-4 lg:py-2 rounded-lg'>
      <div className='h-[70vh] lg:h-[80vh] w-full shadow-lg'>
        <SendBirdProvider
          appId={sbAppId}
          userId={userId}
          nickname={user?.fullName ?? "Unknown User"}
          profileUrl={user?.imageUrl ?? "https://res.cloudinary.com/dbcx5bxea/image/upload/v1747459046/alt_user_qoqovf.avif"}
          allowProfileEdit={true}
          accessToken={accessToken}
          imageCompression={{
            compressionRate: 0.5,
            resizingWidth: 200,
            resizingHeight: 200,
          }}
        >
          <div className='grid grid-cols-1 lg:flex gap-1 md:gap-2 h-full'>
            {/* Channel List - Hidden on mobile when chat is open */}
            <div className={`border shadow-lg ${channelUrl ? 'hidden lg:block' : 'block'}`}>
              <GroupChannelList
                onChannelSelect={(channel) => {
                  if (channel?.url && allowSelectionRef.current) {
                    setChannelUrl(channel.url);
                  }
                }}
                onChannelCreated={(channel) => {
                  if (channel?.url) {
                    setChannelUrl(channel.url);
                  }
                }}
                channelListQueryParams={{
                  includeEmpty: true
                }}
                className='mx-auto'
              />
            </div>
            {/* Channel Message Area - Hidden on mobile when no chat selected */}
            <div className={`w-full items-center justify-center shadow-lg ${channelUrl ? 'block' : 'hidden lg:block'}`}>
              {/* Back button for mobile */}
              {channelUrl && (
                <div className="lg:hidden flex items-center gap-2 p-3 border-b bg-gray-50">
                  <button
                    type="button"
                    onClick={() => {
                      allowSelectionRef.current = false;
                      setChannelUrl(undefined);
                      setTimeout(() => {
                        allowSelectionRef.current = true;
                      }, 100);
                    }}
                    className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label="Back to channel list"
                  >
                    <FiArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-semibold">Back to Channels</span>
                </div>
              )}
              {channelUrl && <GroupChannel channelUrl={channelUrl} />}
            </div>
          </div>
        </SendBirdProvider>
      </div>
    </div>
  )
}

export default Inbox