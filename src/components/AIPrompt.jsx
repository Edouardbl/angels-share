import { useState, useRef, useEffect } from 'react'

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 150, 300].map(delay => (
        <span
          key={delay}
          className="w-2 h-2 bg-[#1D9E75] rounded-full inline-block animate-dot-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#1D9E75]/15 flex items-center justify-center text-sm shrink-0 mt-0.5 mr-2">
          ✨
        </div>
      )}
      <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'bg-[#1A2E44] text-white rounded-tr-sm'
          : 'bg-[#F0FBF7] text-[#1A2E44] rounded-tl-sm border border-[#1D9E75]/15'
      }`}>
        {msg.text}
      </div>
    </div>
  )
}

export default function AIPrompt({ getResponse }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Bonjour ! Je suis votre assistant Angel's Share. Demandez-moi une analyse, une optimisation ou une recommandation sur vos données." }
  ])
  const [isThinking, setIsThinking] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const handleSubmit = () => {
    if (!query.trim() || isThinking) return
    const userMsg = { role: 'user', text: query.trim() }
    setMessages(prev => [...prev, userMsg])
    setQuery('')
    setIsThinking(true)
    const delay = 1200 + Math.random() * 800
    setTimeout(() => {
      const response = getResponse(userMsg.text)
      setMessages(prev => [...prev, { role: 'ai', text: response }])
      setIsThinking(false)
    }, delay)
  }

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const suggestions = ['Comment améliorer mon taux de retour ?', 'Analyse mes fûts dormants', 'Quels clients prioriser ?']

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#1A2E44] hover:bg-[#243d57] text-white rounded-full shadow-2xl flex items-center justify-center text-xl transition-all hover:scale-110"
          title="Assistant IA"
        >
          ✨
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[560px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#1A2E44] rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <div>
                <div className="text-white font-semibold text-sm">Assistant Angel's Share</div>
                <div className="text-[#1D9E75] text-xs">Optimisations & analyses</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors text-lg leading-none">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
            {isThinking && (
              <div className="flex justify-start animate-fade-in">
                <div className="w-7 h-7 rounded-full bg-[#1D9E75]/15 flex items-center justify-center text-sm shrink-0 mt-0.5 mr-2">✨</div>
                <div className="bg-[#F0FBF7] border border-[#1D9E75]/15 rounded-2xl rounded-tl-sm">
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions (only if no user messages yet) */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => { setQuery(s); setTimeout(() => inputRef.current?.focus(), 50) }}
                  className="text-xs bg-gray-50 hover:bg-[#F0FBF7] border border-gray-200 hover:border-[#1D9E75]/30 text-gray-600 hover:text-[#1A2E44] px-3 py-1.5 rounded-full transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-[#1D9E75] transition-colors">
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Demandez une optimisation..."
                className="flex-1 bg-transparent text-sm outline-none text-[#1A2E44] placeholder-gray-400"
                disabled={isThinking}
              />
              <button
                onClick={handleSubmit}
                disabled={!query.trim() || isThinking}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-sm ${
                  query.trim() && !isThinking
                    ? 'bg-[#1D9E75] text-white hover:bg-[#178a64]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
