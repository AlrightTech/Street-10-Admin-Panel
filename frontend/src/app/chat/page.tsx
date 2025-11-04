'use client'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useMemo, useRef, useState, useEffect } from 'react'
import { Menu, Search, Plus, Phone, Video, Info, Send, Paperclip, Smile, Truck, Eye, AlertTriangle } from 'lucide-react'

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showEmojiPicker && !target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker])

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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Chat</h1>
              <p className="text-sm text-gray-500 mt-1">Dashboard • Chat</p>
            </div>
            <div className="flex-1 grid grid-cols-12 gap-2 sm:gap-4 min-h-0 overflow-hidden">
              {/* Conversations list */}
              <aside className="col-span-12 md:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Messages</h2>
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="New message">
                    <Plus size={18} className="sm:w-5 sm:h-5 text-gray-700" />
                  </button>
                </div>
                <div className="p-3 sm:p-4 border-b border-gray-200">
                  <div className="relative">
                    <Search size={16} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-8 sm:pl-9 pr-2 sm:pr-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Search by name, order ID" />
                  </div>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <button onClick={()=>setFilter('all')} className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                      filter==='all'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}>
                      All
                    </button>
                    <button onClick={()=>setFilter('customer')} className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                      filter==='customer'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}>
                      Customers
                    </button>
                    <button onClick={()=>setFilter('support')} className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                      filter==='support'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}>
                      Support
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto flex-1">
                  {filtered.map((c) => {
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
                            <span className="text-[10px] px-1.5 sm:px-2 py-0.5 rounded bg-gray-100 text-gray-700">Order {c.orderId}</span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </aside>

              {/* Chat thread */}
              <section className="col-span-12 md:col-span-6 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col min-h-0">
                {/* Chat header */}
                <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(active.name)}`} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0" alt={active.name} />
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900">{active.name}</h3>
                      {active.orderId && (
                        <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">Order {active.orderId}</p>
                      )}
                      <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></span>
                        <span className="text-[10px] sm:text-xs text-green-600 font-medium">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Call">
                      <Phone size={16} className="sm:w-[18px] sm:h-[18px] text-gray-700" />
                    </button>
                    <button className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Video">
                      <Video size={16} className="sm:w-[18px] sm:h-[18px] text-gray-700" />
                    </button>
                    <button className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Info">
                      <Info size={16} className="sm:w-[18px] sm:h-[18px] text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {active.messages.map((m, idx) => {
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

                {/* Quick Replies */}
                <div className="px-3 sm:px-4 pt-2 pb-2 flex gap-2 overflow-x-auto">
                  <button 
                    onClick={()=>insertQuick('Thank you for your order!')} 
                    className="text-xs px-2.5 sm:px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    Thank you for your order!
                  </button>
                  <button 
                    onClick={()=>insertQuick('Issue forwarded to support')} 
                    className="text-xs px-2.5 sm:px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    Issue forwarded to support
                  </button>
                </div>

                {/* Composer */}
                <div className="border-t border-gray-200 p-2 sm:p-4 relative">
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
                      placeholder="Type your message here" 
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
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Order Details</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Order ID</span>
                      <span className="text-sm font-semibold text-primary-500">{active.orderId || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Status</span>
                      <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded">Shipped</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Amount</span>
                      <span className="text-sm font-semibold text-gray-900">$89.99</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Date</span>
                      <span className="text-xs text-gray-900">Dec 28, 2024</span>
                    </div>
                  </div>
                </div>

                {/* Product */}
                    <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Product</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3">
                    <img src="/images/sidebar-topicon.png" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" alt="product" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-1">{active.product?.title || 'Wireless Bluetooth Headphones'}</p>
                      <p className="text-xs text-gray-600">Qty: {active.product?.qty || 1}</p>
                      {active.product?.variant && (
                        <p className="text-xs text-gray-600">Color: {active.product.variant}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Customer Info</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(active.name)}`} className="w-10 h-10 rounded-full flex-shrink-0" alt={active.name} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{active.name}</p>
                        <p className="text-xs text-gray-600">Premium Customer</p>
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
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full text-sm px-4 py-2.5 rounded-lg border border-gray-300 text-primary-500 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 font-medium">
                      <Eye size={16} />
                      View Full Order
                    </button>
                    <button className="w-full text-sm px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium">
                      <Truck size={16} />
                      Track Shipment
                    </button>
                    <button className="w-full text-sm px-4 py-2.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 font-medium">
                      <AlertTriangle size={16} />
                      Report Issue
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
        <main className="p-3 space-y-3">
          {/* Page Header */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900">Chat</h1>
            <p className="text-xs text-gray-500 mt-1">Dashboard • Chat</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 px-2 py-2">
            <div className="flex gap-2 overflow-x-auto text-sm">
              <button onClick={()=>setMobileTab('messages')} className={`px-3 py-2 rounded-md ${mobileTab==='messages'?'bg-orange-100 text-orange-700 font-medium':'text-gray-700'}`}>Messages</button>
              <button onClick={()=>setMobileTab('chat')} className={`px-3 py-2 rounded-md ${mobileTab==='chat'?'bg-orange-100 text-orange-700 font-medium':'text-gray-700'}`}>Chat</button>
              <button onClick={()=>setMobileTab('details')} className={`px-3 py-2 rounded-md ${mobileTab==='details'?'bg-orange-100 text-orange-700 font-medium':'text-gray-700'}`}>Details</button>
            </div>
          </div>

          {/* Messages list */}
          {mobileTab==='messages' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-3 border-b">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg" placeholder="Search by name, order ID..." />
                </div>
              </div>
              <div className="divide-y">
                {filtered.map((c) => {
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
            <div className="bg-white rounded-lg border border-gray-200 flex flex-col min-h-[60vh]">
              <div className="p-3 border-b flex items-center justify-between">
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
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {active.messages.map((m, idx) => {
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
              <div className="border-t p-2 sm:p-3 relative">
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
            </div>
          )}
        </main>
      </div>
    </div>
  )
}


