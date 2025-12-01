import React, { useEffect, useRef, useState } from 'react'
import { FiMessageSquare } from 'react-icons/fi'
import { useUser } from '@clerk/clerk-react'
import { GroupChannelList } from '@sendbird/uikit-react/GroupChannelList'
// GroupChannel import reserved if you want to render messages inline later
// import { GroupChannel } from '@sendbird/uikit-react/GroupChannel'
import { SendBirdProvider } from '@sendbird/uikit-react'

/**
 * Floating chat widget.
 * - Shown only when user is signed in
 * - Draggable like WhatsApp floating button
 * - Shows unread badge/blinker (placeholder polling implementation). Replace polling with real SendBird unread count if desired.
 */
const ChatFloating: React.FC = () => {
  const { user, isSignedIn } = useUser()
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState<number>(0)
  const [dragging, setDragging] = useState(false)
  const posRef = useRef({ right: 24, bottom: 24 })
  const elRef = useRef<HTMLDivElement | null>(null)
  const startRef = useRef<{x:number,y:number}|null>(null)

  // derive sendbird user id from clerk user (same as Inbox)
  const userId = user ? (user.primaryEmailAddress?.emailAddress ?? '').split('@')[0] : undefined

  useEffect(() => {
    if (!isSignedIn) return

    // Placeholder unread poll. Replace this with a call to Sendbird SDK to fetch unread count.
    const id = setInterval(() => {
      const _v = localStorage.getItem('sb-unread')
      const val = _v ? parseInt(_v, 10) : 0
      setUnread(Number.isFinite(val) ? val : 0)
    }, 3000)

    return () => clearInterval(id)
  }, [isSignedIn])

  // pointer handlers for dragging
  useEffect(() => {
    const onPointerMove = (ev: PointerEvent) => {
      if (!dragging || !startRef.current || !elRef.current) return
      ev.preventDefault()
      const dx = ev.clientX - startRef.current.x
      const dy = ev.clientY - startRef.current.y
      // update right/bottom based on movement
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

  if (!isSignedIn || !userId) return null

  return (
    <div
      ref={elRef}
      style={{ right: posRef.current.right, bottom: posRef.current.bottom }}
      className="fixed z-50"
    >
      <div
        onPointerDown={(e) => {
          setDragging(true)
          startRef.current = { x: e.clientX, y: e.clientY }
        }}
        onClick={() => {
          // clicking toggles open only when not dragging
          if (dragging) return
          setOpen((s) => !s)
        }}
        className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg cursor-grab select-none"
      >
        <FiMessageSquare className="w-6 h-6" />
        {unread > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </div>

      {open && (
        <div className="mt-2 w-[360px] h-[560px] bg-white rounded-xl shadow-xl overflow-hidden">
          <SendBirdProvider
            appId={import.meta.env.VITE_SENDBIRD_APP_ID}
            userId={userId}
            nickname={user?.fullName ?? 'Unknown User'}
            profileUrl={user?.imageUrl ?? ''}
          >
            <div className="h-full flex">
              <div className="w-80 border-r">
                <GroupChannelList
                  onChannelSelect={() => { /* auto-open handled below */ }}
                  onChannelCreated={() => {}}
                  channelListQueryParams={{ includeEmpty: true }}
                />
              </div>
              <div className="flex-1">
                {/* show first channel or a placeholder. For full behavior you may manage channelUrl state here similar to Inbox */}
                <div className="p-4 text-sm text-muted-foreground">Open a channel from the left to start chatting.</div>
              </div>
            </div>
          </SendBirdProvider>
        </div>
      )}
    </div>
  )
}

export default ChatFloating
