import React, { useEffect, useRef, useState } from 'react'
import { FiMessageSquare, FiMaximize2, FiMinimize2, FiArrowLeft } from 'react-icons/fi'
import { useUser } from '@clerk/clerk-react'

// ✅ Modular imports (supported)
import GroupChannelList from '@sendbird/uikit-react/GroupChannelList'
import GroupChannel from '@sendbird/uikit-react/GroupChannel'
import { SendBirdProvider } from '@sendbird/uikit-react'
import CreateChannel from '@sendbird/uikit-react/CreateChannel'


// ✅ Type import for channel
import type { GroupChannel as SBGroupChannel } from '@sendbird/chat/groupChannel'

const ChatFloating: React.FC = () => {
  const { user, isSignedIn } = useUser()
  const [open, setOpen] = useState(false)
  const [channelUrl, setChannelUrl] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const [maximized, setMaximized] = useState(false)
  const [dragging, setDragging] = useState(false)
  const posRef = useRef({ right: 24, bottom: 24 })
  const elRef = useRef<HTMLDivElement | null>(null)
  const startRef = useRef<{ x: number; y: number } | null>(null)

  // Track if we're intentionally selecting a channel (vs auto-select from GroupChannelList)
  const allowSelectionRef = useRef(true)

  const rawEmail = user?.primaryEmailAddress?.emailAddress ?? ''
  const userId = rawEmail ? rawEmail.split('@')[0].replace(/\s+/g, '_') : undefined
  const sbAppId = import.meta.env.VITE_SENDBIRD_APP_ID

  // Dragging logic
  useEffect(() => {
    const onPointerMove = (ev: PointerEvent) => {
      if (!dragging || !startRef.current || !elRef.current) return
      ev.preventDefault()
      const dx = ev.clientX - startRef.current.x
      const dy = ev.clientY - startRef.current.y
      posRef.current.right = Math.max(8, posRef.current.right - dx)
      posRef.current.bottom = Math.max(8, posRef.current.bottom - dy)
      startRef.current = { x: ev.clientX, y: ev.clientY }
      elRef.current.style.right = posRef.current.right + 'px'
      elRef.current.style.bottom = posRef.current.bottom + 'px'
    }
    const onPointerUp = () => setDragging(false)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [dragging])

  if (!isSignedIn || !userId || !sbAppId) return null

  return (
    <div
      ref={elRef}
      style={{ right: posRef.current.right, bottom: posRef.current.bottom }}
      className="fixed z-50"
    >
      {/* Floating button */}
      <div
        onPointerDown={(e) => {
          setDragging(true)
          startRef.current = { x: e.clientX, y: e.clientY }
        }}
        onClick={() => {
          if (dragging) return
          setOpen((s) => !s)
        }}
        className={`elative ${open ? 'bg-blue-600/50' : 'bg-blue-500'} hover:bg-blue-700/70 text-white rounded-full p-3 shadow-lg cursor-grab`}
      >
        <FiMessageSquare className="w-6 h-6" />
      </div>

      {/* Chat window */}
      {open && (
        <div
          className={`mt-2 bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 ${maximized ? 'w-[640px] h-[720px]' : 'w-[360px] h-[560px]'
            }`}
        >
          <SendBirdProvider
            appId={sbAppId}
            userId={userId}
            nickname={user?.fullName ?? 'Unknown User'}
            profileUrl={user?.imageUrl ?? ''}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center p-2 border-b bg-gray-100">
                <span className="text-sm font-semibold">
                  {channelUrl ? 'Conversation' : 'Channels'}
                </span>
                <div className="flex gap-2">
                  {channelUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        allowSelectionRef.current = false
                        setChannelUrl(null)
                        setTimeout(() => {
                          allowSelectionRef.current = true
                        }, 100)
                      }}
                      className="text-lg text-blue-600 hover:underline"
                    >
                      <FiArrowLeft />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setMaximized((m) => !m)}
                    className="text-lg text-blue-600 hover:underline"
                  >
                    {maximized ? <FiMinimize2 /> : <FiMaximize2 />}
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-hidden">
                {channelUrl ? (
                  <GroupChannel key={channelUrl} channelUrl={channelUrl} />
                ) : (
                  <div key="channel-list" className="flex flex-col h-full">


                    {/* Channel list */}
                    <GroupChannelList
                      onChannelSelect={(channel: SBGroupChannel) => {
                        if (channel?.url && allowSelectionRef.current) {
                          setChannelUrl(channel.url)
                        }
                      }}
                      onChannelCreated={(channel: SBGroupChannel) => {
                        if (channel?.url) setChannelUrl(channel.url)
                      }}
                      channelListQueryParams={{ includeEmpty: true }}
                    />

                    {/* Optional: CreateChannel modal */}
                    {showCreate && (
                      <CreateChannel
                        onCreateChannel={(channel: SBGroupChannel) => {
                          setChannelUrl(channel.url)
                          setShowCreate(false)
                        }}
                        onChannelCreated={(channel: SBGroupChannel) => {
                          setChannelUrl(channel.url)
                          setShowCreate(false)
                        }}
                      />
                    )}
                  </div>
                )}

              </div>
            </div>
          </SendBirdProvider>
        </div>
      )}
    </div>
  )
}

export default ChatFloating
