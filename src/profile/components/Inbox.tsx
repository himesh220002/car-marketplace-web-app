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
    <div className='bg-slate-900/5 backdrop-blur-3xl p-0 lg:p-6 rounded-3xl border border-white/20 shadow-2xl overflow-hidden relative'>
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className='h-[75vh] lg:h-[85vh] w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-inner overflow-hidden border border-white/50 dark:border-slate-700/50'>
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
          colorSet={{
            '--sendbird-light-primary-100': '#eff6ff',
            '--sendbird-light-primary-300': '#60a5fa',
            '--sendbird-light-primary-400': '#3b82f6',
            '--sendbird-light-primary-500': '#2563eb',
          }}
        >
          <div className='grid grid-cols-1 lg:flex gap-0 h-full'>
            {/* Channel List - Hidden on mobile when chat is open */}
            <div className={`border-r border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 ${channelUrl ? 'hidden lg:block' : 'block'} lg:w-[350px] flex-shrink-0`}>
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
                className='h-full custom-scrollbar'
              />
            </div>
            {/* Channel Message Area - Hidden on mobile when no chat selected */}
            <div className={`flex-1 flex flex-col h-full bg-white/30 dark:bg-slate-900/30 ${channelUrl ? 'block' : 'hidden lg:flex'}`}>
              {/* Back button for mobile */}
              {channelUrl && (
                <div className="lg:hidden flex items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                  <button
                    type="button"
                    onClick={() => {
                      allowSelectionRef.current = false;
                      setChannelUrl(undefined);
                      setTimeout(() => {
                        allowSelectionRef.current = true;
                      }, 100);
                    }}
                    className="text-slate-600 dark:text-slate-300 hover:text-blue-600 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    aria-label="Back to channel list"
                  >
                    <FiArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Back to Messages</span>
                </div>
              )}

              {channelUrl ? (
                <GroupChannel channelUrl={channelUrl} />
              ) : (
                <div className="hidden lg:flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  </div>
                  <p className="text-lg font-medium">Select a conversation to start chatting</p>
                </div>
              )}
            </div>
          </div>
        </SendBirdProvider>
      </div>
    </div>
  )
}

export default Inbox