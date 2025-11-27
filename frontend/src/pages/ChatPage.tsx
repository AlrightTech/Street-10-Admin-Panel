import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useMemo, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Plus, Phone, Video, Info, Send, Paperclip, Smile, Truck, Eye, AlertTriangle, Mic, MicOff, Volume2, VolumeX, X, VideoOff, Maximize2, Minimize2, Share2, Download, Ban, Trash2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ChatPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showInfoPanel, setShowInfoPanel] = useState(false)
  const [showInfoDropdown, setShowInfoDropdown] = useState(false)
  const [showCallModal, setShowCallModal] = useState(false)
  const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'active' | 'ended'>('connecting')
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)
  const callTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  const [showVideoCallModal, setShowVideoCallModal] = useState(false)
  const [videoCallStatus, setVideoCallStatus] = useState<'connecting' | 'ringing' | 'active' | 'ended'>('connecting')
  const [videoCallDuration, setVideoCallDuration] = useState(0)
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const [isVideoCameraOn, setIsVideoCameraOn] = useState(true)
  const [isVideoSpeakerOn, setIsVideoSpeakerOn] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const videoCallTimerRef = useRef<NodeJS.Timeout | null>(null)

  type Message = { id: string; author: 'me' | 'them'; text: string; time: string }
  type Conversation = {
    id: string
    name: string
    type: 'customer' | 'support'
    country?: string
    badge?: string
    lastTime: string
    orderId?: string
    product?: { title: string; qty: number; variant?: string }
    messages: Message[]
  }

  const initialConversations: Conversation[] = [
    {
      id: '1',
      name: 'Ali Raza',
      type: 'customer',
      country: 'Canada',
      badge: 'Order #1023',
      orderId: '#1023',
      lastTime: '2m ago',
      product: { title: 'Wireless Bluetooth Headphones', qty: 1, variant: 'Blue' },
      messages: [
        { id: 'm1', author: 'them', text: 'Hi! I placed order #1023 yesterday. Can you please check if it has been shipped?', time: '2:45 PM' },
        { id: 'm2', author: 'me', text: 'Hello Ali! Let me check the status of your order #1023 for you.', time: '2:46 PM' },
        { id: 'm3', author: 'me', text: 'Great news! Your order has been shipped and is on its way. You should receive it by tomorrow evening. Tracking ID: TRK023456789', time: '2:47 PM' },
        { id: 'm4', author: 'them', text: 'Perfect. Thank you so much for the quick response. Really appreciate it 😊', time: '2:48 PM' }
      ]
    },
    {
      id: '2',
      name: 'Admin Support',
      type: 'support',
      badge: 'Support',
      lastTime: '1h ago',
      messages: [
        { id: 's1', author: 'them', text: 'Your request is under review', time: '1:24 PM' }
      ]
    },
    {
      id: '3',
      name: 'Sarah khan',
      type: 'customer',
      lastTime: '3h ago',
      messages: [
        { id: 'sk1', author: 'them', text: 'Thanks for the quick delivery!', time: '12:01 PM' }
      ]
    },
    {
      id: '4',
      name: 'Ahmed Ali',
      type: 'customer',
      lastTime: '1d ago',
      messages: [
        { id: 'aa1', author: 'them', text: 'Can you confirm order #9837?', time: '4:10 PM' }
      ]
    }
  ]

  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [activeId, setActiveId] = useState('1')
  const [filter, setFilter] = useState<'all' | 'customer' | 'support'>('all')
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const active = useMemo(() => conversations.find(c => c.id === activeId)!, [conversations, activeId])
  const filtered = useMemo(() => {
    return conversations.filter(c => {
      const matchesType = filter === 'all' || (filter === 'customer' ? c.type === 'customer' : c.type === 'support')
      const q = search.trim().toLowerCase()
      const matchesSearch = !q || c.name.toLowerCase().includes(q) || (c.orderId || '').toLowerCase().includes(q)
      return matchesType && matchesSearch
    })
  }, [conversations, filter, search])

  const sendMessage = () => {
    const text = draft.trim()
    if (!text) return
    setConversations(prev => prev.map(c => c.id === activeId ? {
      ...c,
      lastTime: 'now',
      messages: [...c.messages, { id: Math.random().toString(36).slice(2), author: 'me', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
    } : c))
    setDraft('')
    inputRef.current?.focus()
  }

  const insertQuick = (text: string) => {
    setDraft(text)
    inputRef.current?.focus()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      // In a real app, you would upload the file and send the link
      // For now, we'll just add a message indicating a file was attached
      const fileName = file.name
      const fileSize = (file.size / 1024 / 1024).toFixed(2) // MB
      setDraft(`📎 ${fileName} (${fileSize} MB)`)
      inputRef.current?.focus()
      // Reset file input
      e.target.value = ''
    }
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }

  const commonEmojis = ['😊', '😄', '😃', '😁', '😆', '😅', '😂', '🤣', '😊', '😍', '🤩', '😘', '🥰', '😗', '😙', '😚', '☺️', '🙂', '🤗', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '😡', '😠', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🤠', '🤡', '🥳', '🥴', '🥺', '🤥', '🤫', '🤭', '🧐', '🤓', '😎', '🤩', '🥸', '🤨', '🙋', '🧏', '🙇', '🤦', '🤷', '🧑', '👨', '👩', '👴', '👵', '👶', '👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', '👌', '🤌', '🤏', '👈', '👉', '👆', '👇', '☝️', '👋', '🤚', '🖐', '✋', '🖖', '👏', '🙌', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁', '👅', '👄', '💋', '🩸', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟']

  const insertEmoji = (emoji: string) => {
    const start = inputRef.current?.selectionStart || 0
    const end = inputRef.current?.selectionEnd || 0
    const textBefore = draft.substring(0, start)
    const textAfter = draft.substring(end)
    setDraft(textBefore + emoji + textAfter)
    setShowEmojiPicker(false)
    setTimeout(() => {
      const newPosition = start + emoji.length
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  const [mobileTab, setMobileTab] = useState<'messages'|'chat'|'details'>('chat')

  // Handler functions for buttons
  const handleNewChat = () => {
    // Create a new conversation or open new chat modal
    const newId = Math.random().toString(36).slice(2)
    const newConversation: Conversation = {
      id: newId,
      name: 'New Customer',
      type: 'customer',
      lastTime: 'now',
      messages: []
    }
    setConversations(prev => [newConversation, ...prev])
    setActiveId(newId)
  }

  const handlePhoneCall = () => {
    setShowCallModal(true)
    setCallStatus('connecting')
    setCallDuration(0)
    setIsMuted(false)
    setIsSpeakerOn(false)
    
    // Simulate call progression
    setTimeout(() => {
      setCallStatus('ringing')
    }, 1500)
    
    setTimeout(() => {
      setCallStatus('active')
      // Start call timer
      const startTime = Date.now()
      callTimerRef.current = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }, 3000)
  }

  const handleEndCall = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current)
      callTimerRef.current = null
    }
    setCallStatus('ended')
    setTimeout(() => {
      setShowCallModal(false)
      setCallDuration(0)
    }, 1000)
  }

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
      if (videoCallTimerRef.current) {
        clearInterval(videoCallTimerRef.current)
      }
    }
  }, [])

  const handleVideoCall = () => {
    setShowVideoCallModal(true)
    setVideoCallStatus('connecting')
    setVideoCallDuration(0)
    setIsVideoMuted(false)
    setIsVideoCameraOn(true)
    setIsVideoSpeakerOn(false)
    setIsMinimized(false)
    
    // Simulate call progression
    setTimeout(() => {
      setVideoCallStatus('ringing')
    }, 1500)
    
    setTimeout(() => {
      setVideoCallStatus('active')
      // Start call timer
      const startTime = Date.now()
      videoCallTimerRef.current = setInterval(() => {
        setVideoCallDuration(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }, 3000)
  }

  const handleEndVideoCall = () => {
    if (videoCallTimerRef.current) {
      clearInterval(videoCallTimerRef.current)
      videoCallTimerRef.current = null
    }
    setVideoCallStatus('ended')
    setTimeout(() => {
      setShowVideoCallModal(false)
      setVideoCallDuration(0)
    }, 1000)
  }

  const handleInfoClick = () => {
    setShowInfoDropdown(!showInfoDropdown)
  }

  const handleShareConversation = () => {
    setShowInfoDropdown(false)
    // In a real app, this would share the conversation
    if (navigator.share) {
      navigator.share({
        title: `Conversation with ${active.name}`,
        text: `Chat conversation with ${active.name}`,
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`Conversation with ${active.name}`)
        alert('Conversation link copied to clipboard')
      })
    } else {
      navigator.clipboard.writeText(`Conversation with ${active.name}`)
      alert('Conversation link copied to clipboard')
    }
  }

  const handleExportChat = () => {
    setShowInfoDropdown(false)
    // Export chat as text file
    const chatText = active.messages.map(m => 
      `${m.time} - ${m.author === 'me' ? 'You' : active.name}: ${m.text}`
    ).join('\n')
    
    const blob = new Blob([chatText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${active.name}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleBlockUser = () => {
    setShowInfoDropdown(false)
    if (window.confirm(`Are you sure you want to block ${active.name}?`)) {
      // In a real app, this would block the user
      alert(`${active.name} has been blocked`)
    }
  }

  const handleDeleteConversation = () => {
    setShowInfoDropdown(false)
    if (window.confirm(`Are you sure you want to delete this conversation with ${active.name}?`)) {
      setConversations(prev => {
        const updated = prev.filter(c => c.id !== activeId)
        // Set the next active conversation
        if (updated.length > 0) {
          const nextId = updated[0].id
          setActiveId(nextId)
        } else {
          setActiveId('')
        }
        return updated
      })
    }
  }

  const handleViewFullOrder = () => {
    if (active.orderId) {
      const orderNumber = active.orderId.replace('#', '')
      navigate(`/orders/${orderNumber}`)
    } else {
      navigate('/orders')
    }
  }

  const handleTrackShipment = () => {
    if (active.orderId) {
      const orderNumber = active.orderId.replace('#', '')
      navigate(`/orders/${orderNumber}/tracking`)
    } else {
      navigate('/orders')
    }
  }

  const handleReportIssue = () => {
    // Navigate to report issue page or show modal
    navigate('/support/report')
    // Or show a modal:
    // alert('Report Issue functionality - This would open a form to report an issue')
  }

  // Close emoji picker and info dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showEmojiPicker && !target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false)
      }
      if (showInfoDropdown && !target.closest('.info-dropdown-container')) {
        setShowInfoDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker, showInfoDropdown])

  // Lock body scroll when call modal is open
  useEffect(() => {
    if (showCallModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showCallModal])

  // Handle Escape key to close call modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCallModal) {
        handleEndCall()
      }
      if (e.key === 'Escape' && showVideoCallModal) {
        handleEndVideoCall()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showCallModal, showVideoCallModal])

  // Lock body scroll when video call modal is open
  useEffect(() => {
    if (showVideoCallModal) {
      document.body.style.overflow = 'hidden'
    } else if (!showCallModal) {
      document.body.style.overflow = 'unset'
    }
    return () => {
      if (!showCallModal) {
        document.body.style.overflow = 'unset'
      }
    }
  }, [showVideoCallModal, showCallModal])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="chat" />
          </div>
        )}

        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="fixed left-0 top-4 z-30 bg-primary-500 text-white p-2 rounded-r-lg"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        )}

        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
          <div className="flex-shrink-0 sticky top-0 z-10 bg-white border-b border-gray-200">
            <Header />
          </div>

          {/* Main Chat Area */}
          <main className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6">
            {/* Page Header */}
            <div className="mb-4 sm:mb-6 flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('chat')}</h1>
              <p className="text-sm text-gray-500 mt-1">{t('dashboard')} • {t('chat')}</p>
            </div>
            <div className="flex-1 grid grid-cols-12 gap-2 sm:gap-4 min-h-0 overflow-hidden">
              {/* Conversations list */}
              <aside className="col-span-12 md:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">{t('messages')}</h2>
                  <button 
                    onClick={handleNewChat}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" 
                    aria-label={t('newMessage')}
                    type="button"
                  >
                    <Plus size={18} className="sm:w-5 sm:h-5 text-gray-700" />
                  </button>
                </div>
                <div className="p-3 sm:p-4 border-b border-gray-200">
                  <div className="relative">
                    <Search size={16} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-8 sm:pl-9 pr-2 sm:pr-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder={t('searchByNameOrderId')} />
                  </div>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <button onClick={()=>setFilter('all')} className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                      filter==='all'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}>
                      {t('all')}
                    </button>
                    <button onClick={()=>setFilter('customer')} className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                      filter==='customer'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}>
                      {t('customers')}
                    </button>
                    <button onClick={()=>setFilter('support')} className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                      filter==='support'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}>
                      {t('support')}
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto flex-1">
                  {filtered.map((c: Conversation) => {
                    const last = c.messages[c.messages.length-1]?.text || ''
                    const isActive = c.id === activeId
                    return (
                      <button 
                        key={c.id} 
                        onClick={()=>setActiveId(c.id)} 
                        className={`w-full text-left p-3 sm:p-4 flex items-start gap-2 sm:gap-3 transition-colors relative ${
                          isActive 
                            ? 'bg-primary-50 border-l-4 border-primary-500' 
                            : 'hover:bg-gray-50 border-l-4 border-transparent'
                        }`}
                      >
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.name)}`} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0" alt={c.name} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                            <span className="text-[10px] sm:text-xs text-gray-500 flex-shrink-0 ml-2">{c.lastTime}</span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-gray-600 truncate mb-1">{last}</p>
                          {c.orderId && (
                            <span className="text-[10px] px-1.5 sm:px-2 py-0.5 rounded bg-gray-100 text-gray-700">{t('order')} {c.orderId}</span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </aside>

              {/* Chat thread */}
              <section className="col-span-12 md:col-span-6 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col min-h-0 h-full">
                {/* Chat header - Fixed */}
                <div className="flex-shrink-0 p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(active.name)}`} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0" alt={active.name} />
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900">{active.name}</h3>
                      {active.orderId && (
                        <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">{t('order')} {active.orderId}</p>
                      )}
                      <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></span>
                        <span className="text-[10px] sm:text-xs text-green-600 font-medium">{t('online')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button 
                      onClick={handlePhoneCall}
                      className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors" 
                      aria-label="Call"
                      type="button"
                      title="Call"
                    >
                      <Phone size={16} className="sm:w-[18px] sm:h-[18px] text-gray-700" />
                    </button>
                    <button 
                      onClick={handleVideoCall}
                      className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors" 
                      aria-label="Video"
                      type="button"
                      title="Video Call"
                    >
                      <Video size={16} className="sm:w-[18px] sm:h-[18px] text-gray-700" />
                    </button>
                    <div className="relative info-dropdown-container">
                      <button 
                        onClick={handleInfoClick}
                        className={`p-1.5 sm:p-2 rounded-lg transition-colors ${showInfoDropdown ? 'bg-primary-100' : 'hover:bg-gray-100'}`}
                        aria-label="Info"
                        type="button"
                        title="Info"
                      >
                        <Info size={16} className="sm:w-[18px] sm:h-[18px] text-gray-700" />
                      </button>
                      
                      {/* Info Dropdown Menu */}
                      {showInfoDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-slideUp">
                          <button
                            onClick={handleShareConversation}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            type="button"
                          >
                            <Share2 size={16} />
                            Share Conversation
                          </button>
                          <button
                            onClick={handleExportChat}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            type="button"
                          >
                            <Download size={16} />
                            Export Chat
                          </button>
                          <div className="border-t border-gray-200 my-1"></div>
                          <button
                            onClick={handleBlockUser}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            type="button"
                          >
                            <Ban size={16} />
                            Block User
                          </button>
                          <button
                            onClick={handleDeleteConversation}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            type="button"
                          >
                            <Trash2 size={16} />
                            Delete Conversation
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages - Scrollable */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0">
                  {active.messages.map((m: Message, idx: number) => {
                    const isSystemMessage = m.text.includes('Tracking ID') || m.text.includes('shipped')
                    return (
                      <div key={m.id} className={`flex items-start gap-2 sm:gap-3 ${m.author==='me'?'flex-row-reverse':''}`}>
                        {m.author === 'them' && (
                          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(active.name)}`} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0" alt={active.name} />
                        )}
                        <div className={`flex flex-col ${m.author==='me'?'items-end': 'items-start'} max-w-[85%] sm:max-w-[75%]`}>
                          <div className={`text-xs text-gray-500 mb-1 ${m.author==='me'?'text-right': 'text-left'}`}>{m.time}</div>
                          <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                            m.author === 'me' 
                              ? 'bg-primary-500 text-white rounded-br-sm' 
                              : isSystemMessage
                              ? 'bg-primary-500 text-white rounded-bl-sm flex items-center gap-2'
                              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                          }`}>
                            {isSystemMessage && (
                              <Truck size={16} className="flex-shrink-0" />
                            )}
                            <span>{m.text}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {/* Typing indicator */}
                  {active.id === '1' && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]"></span>
                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]"></span>
                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]"></span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Replies - Fixed */}
                <div className="flex-shrink-0 px-3 sm:px-4 pt-2 pb-2 flex gap-2 overflow-x-auto bg-white border-t border-gray-200">
                    <button 
                    onClick={()=>insertQuick(t('quickReply1'))} 
                    className="text-xs px-2.5 sm:px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    {t('quickReply1')}
                  </button>
                  <button 
                    onClick={()=>insertQuick(t('quickReply2'))} 
                    className="text-xs px-2.5 sm:px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    {t('quickReply2')}
                  </button>
                </div>

                {/* Composer - Fixed */}
                <div className="flex-shrink-0 border-t border-gray-200 p-2 sm:p-4 relative bg-white">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    multiple={false}
                    aria-label="Attach file"
                    title="Attach file"
                  />
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <input 
                      ref={inputRef} 
                      value={draft} 
                      onChange={e=>setDraft(e.target.value)} 
                      onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); sendMessage(); } }} 
                      className="flex-1 min-w-0 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                      placeholder={t('typeMessage')} 
                    />
                    <button 
                      onClick={handleAttachClick}
                      className="p-2 sm:p-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex-shrink-0" 
                      aria-label="Attach file"
                      type="button"
                    >
                      <Paperclip size={16} className="sm:w-[18px] sm:h-[18px] text-gray-600" />
                    </button>
                    <div className="relative emoji-picker-container flex-shrink-0">
                      <button 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 sm:p-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors" 
                        aria-label="Insert emoji"
                        type="button"
                      >
                        <Smile size={16} className="sm:w-[18px] sm:h-[18px] text-gray-600" />
                      </button>
                      {showEmojiPicker && (
                        <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 sm:p-3 w-[calc(100vw-2rem)] sm:w-64 max-w-64 max-h-64 overflow-y-auto z-10 emoji-picker-container">
                          <div className="grid grid-cols-8 gap-1">
                            {commonEmojis.map((emoji: string, idx: number) => (
                              <button
                                key={idx}
                                onClick={() => insertEmoji(emoji)}
                                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded text-base sm:text-lg transition-colors"
                                type="button"
                                aria-label={`Insert ${emoji}`}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={sendMessage} 
                      className="p-2 sm:p-2.5 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors flex items-center justify-center flex-shrink-0" 
                      aria-label="Send"
                      type="button"
                    >
                      <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Right panel */}
              <aside className="hidden md:block col-span-12 md:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 space-y-4 sm:space-y-5 overflow-y-auto">
                {/* Order Details */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">{t('orderDetails')}</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{t('orderId')}</span>
                      <span className="text-sm font-semibold text-primary-500">{active.orderId || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{t('status')}</span>
                      <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded">{t('shipped')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{t('amount')}</span>
                      <span className="text-sm font-semibold text-gray-900">$89.99</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{t('date')}</span>
                      <span className="text-xs text-gray-900">Dec 28, 2024</span>
                    </div>
                  </div>
                </div>

                {/* Product */}
                    <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">{t('product')}</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3">
                    <img src="/images/sidebar-topicon.png" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" alt="product" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-1">{active.product?.title || 'Wireless Bluetooth Headphones'}</p>
                      <p className="text-xs text-gray-600">{t('quantity')}: {active.product?.qty || 1}</p>
                      {active.product?.variant && (
                        <p className="text-xs text-gray-600">{t('variant')}: {active.product.variant}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">{t('customerInfo')}</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(active.name)}`} className="w-10 h-10 rounded-full flex-shrink-0" alt={active.name} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{active.name}</p>
                        <p className="text-xs text-gray-600">{t('premiumCustomer')}</p>
                      </div>
                    </div>
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-600">aliraza@email.com</p>
                      <p className="text-xs text-gray-600">+92 300 1234567</p>
                      <p className="text-xs text-gray-600">Lahore, Pakistan</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">{t('actions')}</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={handleViewFullOrder}
                      className="w-full text-sm px-4 py-2.5 rounded-lg border border-gray-300 text-primary-500 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 font-medium"
                      type="button"
                    >
                      <Eye size={16} />
                      {t('viewFullOrder')}
                    </button>
                    <button 
                      onClick={handleTrackShipment}
                      className="w-full text-sm px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium"
                      type="button"
                    >
                      <Truck size={16} />
                      {t('trackShipment')}
                    </button>
                    <button 
                      onClick={handleReportIssue}
                      className="w-full text-sm px-4 py-2.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 font-medium"
                      type="button"
                    >
                      <AlertTriangle size={16} />
                      {t('reportIssue')}
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-primary-500">
              <Sidebar onClose={() => setSidebarOpen(false)} currentPage="chat" />
            </div>
          </div>
        )}

        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <Header onToggleSidebar={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} />
        </div>

        <main className="p-3 space-y-3 pt-20 lg:pt-4">
          {/* Page Header */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900">{t('chat')}</h1>
            <p className="text-xs text-gray-500 mt-1">{t('dashboard')} • {t('chat')}</p>
          </div>

          {/* Tabs - Below Headings */}
          <div className="bg-white rounded-lg border border-gray-200 px-2 py-2 mb-4">
            <div className="flex gap-2 overflow-x-auto text-sm">
              <button onClick={()=>setMobileTab('messages')} className={`px-3 py-2 rounded-md font-medium transition-colors ${mobileTab==='messages'?'bg-orange-500 text-white':'text-gray-600 hover:text-gray-900'}`}>{t('messages')}</button>
              <button onClick={()=>setMobileTab('chat')} className={`px-3 py-2 rounded-md font-medium transition-colors ${mobileTab==='chat'?'bg-orange-500 text-white':'text-gray-600 hover:text-gray-900'}`}>{t('chat')}</button>
              <button onClick={()=>setMobileTab('details')} className={`px-3 py-2 rounded-md font-medium transition-colors ${mobileTab==='details'?'bg-orange-500 text-white':'text-gray-600 hover:text-gray-900'}`}>{t('details')}</button>
            </div>
          </div>

          {/* Messages list */}
          {mobileTab==='messages' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-3 border-b">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg" placeholder={t('searchByNameOrderId')} />
                </div>
              </div>
              <div className="divide-y">
                {filtered.map((c: Conversation) => {
                  const last = c.messages[c.messages.length-1]?.text || ''
                  const active = c.id === activeId
                  return (
                    <button key={c.id} onClick={()=>{setActiveId(c.id); setMobileTab('chat')}} className={`w-full text-left p-3 flex items-start gap-3 hover:bg-gray-50 ${active ? 'bg-purple-50' : ''}`}>
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.name)}`} className="w-8 h-8 rounded-full" alt={c.name} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                          <span className="text-[11px] text-gray-500">{c.lastTime}</span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{last}</p>
                        {c.badge && <span className="mt-1 inline-block text-[10px] px-1.5 py-0.5 rounded bg-gray-100">{c.badge}</span>}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Chat thread */}
          {mobileTab==='chat' && (
            <div className="bg-white rounded-lg border border-gray-200 flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
              {/* Chat header - Fixed */}
              <div className="flex-shrink-0 p-3 border-b border-gray-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(active.name)}`} className="w-8 h-8 rounded-full" alt={active.name} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{active.name}</h3>
                      {active.orderId && <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">Order {active.orderId}</span>}
                    </div>
                    <p className="text-xs text-gray-500">{active.country || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={handlePhoneCall}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" 
                    aria-label="Call"
                    type="button"
                    title="Call"
                  >
                    <Phone size={16} className="text-gray-700" />
                  </button>
                  <button 
                    onClick={handleVideoCall}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" 
                    aria-label="Video"
                    type="button"
                    title="Video Call"
                  >
                    <Video size={16} className="text-gray-700" />
                  </button>
                  <div className="relative info-dropdown-container">
                    <button 
                      onClick={handleInfoClick}
                      className={`p-1.5 rounded-lg transition-colors ${showInfoDropdown ? 'bg-primary-100' : 'hover:bg-gray-100'}`}
                      aria-label="Info"
                      type="button"
                      title="Info"
                    >
                      <Info size={16} className="text-gray-700" />
                    </button>
                    
                    {/* Info Dropdown Menu - Mobile */}
                    {showInfoDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-slideUp">
                        <button
                          onClick={handleShareConversation}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          type="button"
                        >
                          <Share2 size={16} />
                          Share Conversation
                        </button>
                        <button
                          onClick={handleExportChat}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          type="button"
                        >
                          <Download size={16} />
                          Export Chat
                        </button>
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={handleBlockUser}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          type="button"
                        >
                          <Ban size={16} />
                          Block User
                        </button>
                        <button
                          onClick={handleDeleteConversation}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          type="button"
                        >
                          <Trash2 size={16} />
                          Delete Conversation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Messages - Scrollable */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
                {active.messages.map((m: Message, idx: number) => {
                  const isSystemMessage = m.text.includes('Tracking ID') || m.text.includes('shipped')
                  return (
                    <div key={m.id} className={`flex items-start gap-3 ${m.author==='me'?'flex-row-reverse':''}`}>
                      {m.author === 'them' && (
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(active.name)}`} className="w-8 h-8 rounded-full flex-shrink-0" alt={active.name} />
                      )}
                      <div className={`flex flex-col ${m.author==='me'?'items-end': 'items-start'} max-w-[85%]`}>
                        <div className={`text-xs text-gray-500 mb-1 ${m.author==='me'?'text-right': 'text-left'}`}>{m.time}</div>
                        <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                          m.author === 'me' 
                            ? 'bg-primary-500 text-white rounded-br-sm' 
                            : isSystemMessage
                            ? 'bg-primary-500 text-white rounded-bl-sm flex items-center gap-2'
                            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                        }`}>
                          {isSystemMessage && (
                            <Truck size={16} className="flex-shrink-0" />
                          )}
                          <span>{m.text}</span>
                        </div>
                      </div>
                  </div>
                  )
                })}
              </div>
              {/* Composer - Fixed */}
              <div className="flex-shrink-0 border-t border-gray-200 p-2 sm:p-3 relative bg-white">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  multiple={false}
                  aria-label="Attach file"
                  title="Attach file"
                />
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <input ref={inputRef} value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); sendMessage(); } }} className="flex-1 min-w-0 px-2 sm:px-3 py-2 text-xs sm:text-sm border rounded-lg" placeholder="Type your message here..." />
                  <button onClick={handleAttachClick} className="p-2 rounded-lg border hover:bg-gray-50 transition-colors flex-shrink-0" aria-label="Attach file" type="button">
                    <Paperclip size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <div className="relative emoji-picker-container flex-shrink-0">
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 rounded-lg border hover:bg-gray-50 transition-colors" aria-label="Insert emoji" type="button">
                      <Smile size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 sm:p-3 w-[calc(100vw-2rem)] sm:w-64 max-w-64 max-h-64 overflow-y-auto z-10 emoji-picker-container">
                        <div className="grid grid-cols-8 gap-1">
                          {commonEmojis.map((emoji, idx) => (
                            <button
                              key={idx}
                              onClick={() => insertEmoji(emoji)}
                              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded text-base sm:text-lg transition-colors"
                              type="button"
                              aria-label={`Insert ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button onClick={sendMessage} className="px-2.5 sm:px-3 py-2 rounded-lg bg-primary-500 text-white flex items-center gap-1 transition-colors hover:bg-primary-600 flex-shrink-0 text-xs sm:text-sm" aria-label="Send" type="button">
                    <Send size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Details */}
          {mobileTab==='details' && (
            <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Order Details</h3>
                <div className="text-xs grid grid-cols-2 gap-y-2">
                  <span className="text-gray-500">Order ID</span><span className="text-gray-800">{active.orderId || '—'}</span>
                  <span className="text-gray-500">Status</span><span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Shipped</span>
                  <span className="text-gray-500">Total</span><span className="text-gray-800">$99.99</span>
                  <span className="text-gray-500">Date</span><span className="text-gray-800">Dec 26, 2024</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Customer Info</h3>
                <div className="text-xs space-y-1">
                  <p className="font-medium text-gray-900">{active.name}</p>
                  <p className="text-gray-600">Premium Customer</p>
                  <p className="text-gray-600">ali@email.com</p>
                  <p className="text-gray-600">+92 300 1234567</p>
                  <p className="text-gray-600">Lahore, Pakistan</p>
                </div>
              </div>
              {/* Actions */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{t('actions')}</h3>
                <div className="space-y-2">
                  <button 
                    onClick={handleViewFullOrder}
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-gray-300 text-primary-500 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 font-medium"
                    type="button"
                  >
                    <Eye size={16} />
                    {t('viewFullOrder')}
                  </button>
                  <button 
                    onClick={handleTrackShipment}
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium"
                    type="button"
                  >
                    <Truck size={16} />
                    {t('trackShipment')}
                  </button>
                  <button 
                    onClick={handleReportIssue}
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 font-medium"
                    type="button"
                  >
                    <AlertTriangle size={16} />
                    {t('reportIssue')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Phone Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all animate-slideUp">
            {/* Close button */}
            <button
              onClick={handleEndCall}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
              type="button"
            >
              <X size={20} className="text-gray-600" />
            </button>

            {/* Call Content */}
            <div className="flex flex-col items-center text-center pt-4">
              {/* Avatar */}
              <div className="relative mb-6">
                <img 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(active.name)}`} 
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-primary-500 shadow-lg" 
                  alt={active.name} 
                />
                {callStatus === 'active' && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 w-4 h-4 rounded-full border-2 border-white animate-pulse"></div>
                )}
              </div>

              {/* Name */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{active.name}</h3>
              
              {/* Status */}
              <div className="mb-6">
                {callStatus === 'connecting' && (
                  <p className="text-sm text-gray-600 animate-pulse">Connecting...</p>
                )}
                {callStatus === 'ringing' && (
                  <p className="text-sm text-orange-600 font-medium animate-pulse">Ringing...</p>
                )}
                {callStatus === 'active' && (
                  <div>
                    <p className="text-sm text-green-600 font-medium mb-1">Call in progress</p>
                    <p className="text-lg font-mono font-semibold text-gray-900">{formatCallDuration(callDuration)}</p>
                  </div>
                )}
                {callStatus === 'ended' && (
                  <p className="text-sm text-gray-600">Call ended</p>
                )}
              </div>

              {/* Call Controls */}
              {callStatus === 'active' && (
                <div className="w-full space-y-4">
                  {/* Mute and Speaker */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-4 rounded-full transition-colors ${
                        isMuted 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                      type="button"
                    >
                      {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    <button
                      onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                      className={`p-4 rounded-full transition-colors ${
                        isSpeakerOn 
                          ? 'bg-primary-100 text-primary-600 hover:bg-primary-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      aria-label={isSpeakerOn ? 'Turn off speaker' : 'Turn on speaker'}
                      type="button"
                    >
                      {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
                    </button>
                  </div>

                  {/* End Call Button */}
                  <button
                    onClick={handleEndCall}
                    className="w-full py-4 px-6 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
                    type="button"
                  >
                    <Phone size={20} className="rotate-[135deg]" />
                    End Call
                  </button>
                </div>
              )}

              {/* Connecting/Ringing Controls */}
              {(callStatus === 'connecting' || callStatus === 'ringing') && (
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0ms]"></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:150ms]"></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:300ms]"></div>
                  </div>
                  <button
                    onClick={handleEndCall}
                    className="w-full py-4 px-6 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
                    type="button"
                  >
                    <Phone size={20} className="rotate-[135deg]" />
                    Cancel Call
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {showVideoCallModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className={`relative bg-black rounded-2xl shadow-2xl w-full h-full ${isMinimized ? 'max-w-md max-h-[600px]' : 'max-w-7xl'} transition-all duration-300`}>
            {/* Header Controls */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(active.name)}`} 
                  className="w-10 h-10 rounded-full border-2 border-white/30" 
                  alt={active.name} 
                />
                <div>
                  <h3 className="text-white font-semibold">{active.name}</h3>
                  {videoCallStatus === 'active' && (
                    <p className="text-white/70 text-sm font-mono">{formatCallDuration(videoCallDuration)}</p>
                  )}
                  {videoCallStatus !== 'active' && (
                    <p className="text-white/70 text-sm">
                      {videoCallStatus === 'connecting' && 'Connecting...'}
                      {videoCallStatus === 'ringing' && 'Ringing...'}
                      {videoCallStatus === 'ended' && 'Call ended'}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                  type="button"
                >
                  {isMinimized ? <Maximize2 size={20} className="text-white" /> : <Minimize2 size={20} className="text-white" />}
                </button>
                <button
                  onClick={handleEndVideoCall}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Close"
                  type="button"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Video Feeds */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Remote Video (Main) */}
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-primary-500/20 to-orange-500/20 flex items-center justify-center">
                {videoCallStatus === 'active' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(active.name)}`} 
                      className="w-32 h-32 rounded-full border-4 border-white/30" 
                      alt={active.name} 
                    />
                    {/* In a real app, this would be the actual video stream */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white/50 text-sm">Video Feed Would Appear Here</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-white">
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(active.name)}`} 
                      className="w-32 h-32 rounded-full border-4 border-white/30 mb-4" 
                      alt={active.name} 
                    />
                    <h3 className="text-2xl font-bold mb-2">{active.name}</h3>
                    {videoCallStatus === 'connecting' && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0ms]"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:150ms]"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:300ms]"></div>
                      </div>
                    )}
                    {videoCallStatus === 'ringing' && (
                      <p className="text-orange-400 font-medium animate-pulse">Ringing...</p>
                    )}
                  </div>
                )}
              </div>

              {/* Local Video (Picture-in-Picture) */}
              {videoCallStatus === 'active' && isVideoCameraOn && (
                <div className="absolute bottom-24 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-white/30 bg-gray-900 shadow-2xl">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="text-white/50 text-xs text-center p-2">
                      Your video
                    </div>
                    {/* In a real app, this would be the local video stream */}
                  </div>
                </div>
              )}
            </div>

            {/* Call Controls - Bottom */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
              {videoCallStatus === 'active' && (
                <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md rounded-full px-6 py-4">
                  {/* Mute/Unmute */}
                  <button
                    onClick={() => setIsVideoMuted(!isVideoMuted)}
                    className={`p-3 rounded-full transition-colors ${
                      isVideoMuted 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    aria-label={isVideoMuted ? 'Unmute' : 'Mute'}
                    type="button"
                  >
                    {isVideoMuted ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>

                  {/* Camera On/Off */}
                  <button
                    onClick={() => setIsVideoCameraOn(!isVideoCameraOn)}
                    className={`p-3 rounded-full transition-colors ${
                      !isVideoCameraOn 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    aria-label={isVideoCameraOn ? 'Turn off camera' : 'Turn on camera'}
                    type="button"
                  >
                    {isVideoCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
                  </button>

                  {/* Speaker */}
                  <button
                    onClick={() => setIsVideoSpeakerOn(!isVideoSpeakerOn)}
                    className={`p-3 rounded-full transition-colors ${
                      isVideoSpeakerOn 
                        ? 'bg-primary-500 text-white hover:bg-primary-600' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    aria-label={isVideoSpeakerOn ? 'Turn off speaker' : 'Turn on speaker'}
                    type="button"
                  >
                    {isVideoSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  </button>

                  {/* End Call */}
                  <button
                    onClick={handleEndVideoCall}
                    className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors ml-2"
                    aria-label="End call"
                    type="button"
                  >
                    <Phone size={20} className="rotate-[135deg]" />
                  </button>
                </div>
              )}

              {/* Connecting/Ringing Controls */}
              {(videoCallStatus === 'connecting' || videoCallStatus === 'ringing') && (
                <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md rounded-full px-6 py-4">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0ms]"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
                  </div>
                  <button
                    onClick={handleEndVideoCall}
                    className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    aria-label="Cancel call"
                    type="button"
                  >
                    <Phone size={20} className="rotate-[135deg]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


