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

  // Reset position on resize to mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640 && elRef.current) {
        // Reset to default position on mobile
        posRef.current = { right: 24, bottom: 24 }
        elRef.current.style.right = ''
        elRef.current.style.bottom = ''
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!isSignedIn || !userId || !sbAppId) return null

  return (
    <div
      ref={elRef}
      style={{ bottom: posRef.current.bottom }}
      className="fixed z-50 right-2 sm:right-6 touch-none sm:touch-auto"
    >
      {/* Floating button */}
      <div
        onPointerDown={(e) => {
          // Disable drag on mobile (sm breakpoint is usually 640px)
          if (window.innerWidth < 640) return
          setDragging(true)
          startRef.current = { x: e.clientX, y: e.clientY }
        }}
        onClick={() => {
          if (dragging) return
          setOpen((s) => !s)
        }}
        className={`relative group ${open ? 'bg-gradient-to-r from-blue-600 to-purple-600 rotate-90' : 'bg-gradient-to-r from-blue-600 to-purple-600'} hover:scale-110 transition-all duration-300 text-white rounded-full p-4 shadow-2xl cursor-grab active:cursor-grabbing z-50`}
      >
        {!open && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>}
        <FiMessageSquare className={`w-7 h-7 transition-transform duration-300 ${open ? '-rotate-90' : ''}`} />

        {/* Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with Support
        </div>
      </div>

      {/* Chat window */}
      <div
        className={`absolute bottom-20 right-0 origin-bottom-right transition-all duration-300 ease-out transform ${open ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'
          }`}
      >
        <div
          className={`bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 flex flex-col ${maximized
            ? 'w-[95vw] sm:w-[640px] h-[80vh]'
            : 'w-[90vw] sm:w-[400px] h-[600px]'
            } max-w-[640px]`}
        >
          <SendBirdProvider
            appId={sbAppId}
            userId={userId}
            nickname={user?.fullName ?? 'Unknown User'}
            profileUrl={user?.imageUrl ?? ''}
            colorSet={{
              '--sendbird-light-primary-100': '#eff6ff',
              '--sendbird-light-primary-300': '#60a5fa',
              '--sendbird-light-primary-400': '#3b82f6',
              '--sendbird-light-primary-500': '#2563eb',
            }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                    <FiMessageSquare className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg tracking-wide">
                    {channelUrl ? 'Conversation' : 'Messages'}
                  </span>
                </div>
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
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      title="Back"
                    >
                      <FiArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setMaximized((m) => !m)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    title={maximized ? "Minimize" : "Maximize"}
                  >
                    {maximized ? <FiMinimize2 className="w-5 h-5" /> : <FiMaximize2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-hidden bg-slate-50 relative">
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
                      className="custom-scrollbar"
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
      </div>
    </div>
  )
}

export default ChatFloating
