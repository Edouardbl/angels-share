import { useState, useRef, useEffect } from 'react'

const PRIORITY_STYLES = {
  high: { bar: 'bg-red-500', badge: 'bg-red-50 text-red-600', label: 'Priorité haute' },
  medium: { bar: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700', label: 'À surveiller' },
  low: { bar: 'bg-blue-400', badge: 'bg-blue-50 text-blue-600', label: 'Info' },
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 150, 300].map(delay => (
        <span
          key={delay}
          className="w-1.5 h-1.5 bg-blue-400 rounded-full inline-block animate-dot-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  )
}

function ChatMessage({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5 mr-2">
          <svg className="w-3 h-3 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
      )}
      <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'bg-[#0F172A] text-white rounded-tr-sm'
          : 'bg-slate-50 text-[#0F172A] rounded-tl-sm border border-slate-200'
      }`}>
        {msg.text}
      </div>
    </div>
  )
}

function InsightCard({ insight, index, onFollowUp }) {
  const p = PRIORITY_STYLES[insight.priority]
  return (
    <div
      className="animate-card-in bg-white rounded-xl border border-slate-100 overflow-hidden hover:border-slate-200 transition-colors"
      style={{ animationDelay: `${index * 90}ms`, animationFillMode: 'both', opacity: 0 }}
    >
      <div className={`h-0.5 ${p.bar}`} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="font-semibold text-[#0F172A] text-sm">{insight.title}</div>
          <div className="flex items-center gap-1.5 shrink-0">
            {insight.metric && (
              <span className="font-bold text-xs text-slate-500">{insight.metric}</span>
            )}
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.badge}`}>
              {p.label}
            </span>
          </div>
        </div>
        <p className="text-slate-500 text-xs leading-relaxed mb-3">{insight.text}</p>
        <button
          onClick={() => onFollowUp(insight.followUp)}
          className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center gap-1"
        >
          Approfondir
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function AIPrompt({ getResponse, insights = [], triggerQuery = null }) {
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState('insights')
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Bonjour, je suis votre assistant Angel's Share. Posez-moi une question sur vos données ou utilisez les insights ci-contre." }
  ])
  const [isThinking, setIsThinking] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && tab === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, tab])

  useEffect(() => {
    if (!triggerQuery?.text) return
    setIsOpen(true)
    setTab('chat')
    setQuery(triggerQuery.text)
    setTimeout(() => inputRef.current?.focus(), 150)
  }, [triggerQuery])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const handleSubmit = () => {
    if (!query.trim() || isThinking) return
    const userMsg = { role: 'user', text: query.trim() }
    setMessages(prev => [...prev, userMsg])
    setQuery('')
    setIsThinking(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: getResponse(userMsg.text) }])
      setIsThinking(false)
    }, 1200 + Math.random() * 800)
  }

  const handleFollowUp = (q) => {
    setTab('chat')
    setQuery(q)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const suggestions = ['Comment améliorer mon taux de retour ?', 'Analyse mes fûts dormants', 'Quels clients prioriser ?']

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setTab('insights') }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white pl-4 pr-5 py-3 rounded-full shadow-xl transition-all hover:scale-105 text-sm font-semibold"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          Analyses IA
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] max-h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <span className="font-semibold text-[#0F172A] text-sm">Analyses IA</span>
            </div>
            <div className="flex items-center gap-1">
              {/* Tabs */}
              <div className="flex bg-slate-100 rounded-lg p-0.5 mr-2">
                {['insights', 'chat'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      tab === t
                        ? 'bg-white text-[#0F172A] shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t === 'insights' ? 'Insights' : 'Chat'}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Insights tab */}
          {tab === 'insights' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {insights.length === 0 ? (
                <div className="text-center text-slate-400 text-sm py-8">Aucun insight disponible</div>
              ) : (
                insights.map((insight, i) => (
                  <InsightCard key={insight.id} insight={insight} index={i} onFollowUp={handleFollowUp} />
                ))
              )}
            </div>
          )}

          {/* Chat tab */}
          {tab === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
                {messages.map((msg, i) => <ChatMessage key={i} msg={msg} />)}
                {isThinking && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5 mr-2">
                      <svg className="w-3 h-3 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-sm">
                      <TypingDots />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {messages.length === 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                  {suggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => { setQuery(s); setTimeout(() => inputRef.current?.focus(), 50) }}
                      className="text-xs bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-600 hover:text-blue-700 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div className="px-3 py-3 border-t border-slate-100 shrink-0">
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-blue-400 transition-colors">
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
                    placeholder="Posez une question..."
                    className="flex-1 bg-transparent text-sm outline-none text-[#0F172A] placeholder-slate-400"
                    disabled={isThinking}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!query.trim() || isThinking}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-sm ${
                      query.trim() && !isThinking
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    ↑
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
