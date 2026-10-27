import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Sparkles, RefreshCw, Trash2, Cpu, Copy, Check } from 'lucide-react';
import { ChatMessage, StudyPlan } from '../types';
import { askDoubtWithNvidia, AVAILABLE_NVIDIA_MODELS } from '../services/nemotronService';

interface DoubtChatProps {
  plans?: StudyPlan[];
}

export const DoubtChat: React.FC<DoubtChatProps> = ({ plans = [] }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('edumind_doubt_chat');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: 'initial',
        role: 'assistant',
        content: "Hi! I'm your AI Doubt Assistant powered by NVIDIA NIM & Nemotron models. Ask me any conceptual question, problem breakdown, or revision doubt!",
        modelUsed: 'nvidia/nemotron-3-ultra-550b-a55b',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('auto');
  const [selectedSubject, setSelectedSubject] = useState<string>(plans[0]?.subject || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    localStorage.setItem('edumind_doubt_chat', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      // Send last 6 messages for context
      const chatContext = newHistory.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await askDoubtWithNvidia({
        messages: chatContext,
        selectedModel,
        contextSubject: selectedSubject || undefined
      });

      const assistantMessage: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: res.reply,
        modelUsed: res.modelUsed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("Doubt solver error:", err);
      const errorMessage: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: `Sorry, I encountered an issue: ${err.message || 'Failed to reach NVIDIA API'}. Please verify your API key and proxy connection.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear all doubt chat messages?")) {
      const reset = [
        {
          id: 'initial',
          role: 'assistant' as const,
          content: "Chat cleared! How can I help you with your studies?",
          modelUsed: 'nvidia/nemotron-3-ultra-550b-a55b',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(reset);
      localStorage.setItem('edumind_doubt_chat', JSON.stringify(reset));
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="glass p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 border" style={{ borderColor: 'var(--border)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black font-display" style={{ color: 'var(--cream)' }}>
              AI Doubt Solver
            </h1>
          </div>
          <p className="text-xs text-stone-400">
            Ask any question or concept doubt, solved across active NVIDIA AI models.
          </p>
        </div>

        {/* Model selector & Subject context */}
        <div className="flex flex-wrap items-center gap-3">
          {plans.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-stone-400">Plan Context:</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-stone-900/60 border border-stone-800 text-stone-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500/50"
              >
                <option value="">General (No specific plan)</option>
                {plans.map(p => (
                  <option key={p.id} value={p.subject}>{p.subject}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-500/70" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-stone-900/60 border border-stone-800 text-stone-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500/50"
            >
              {AVAILABLE_NVIDIA_MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={clearChat}
            className="p-2.5 rounded-xl border border-stone-800 text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat messages viewport */}
      <div 
        className="glass rounded-3xl p-6 border flex flex-col h-[560px] overflow-hidden"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-amber-400" />
                  </div>
                )}

                <div className={`max-w-[80%] rounded-2xl p-4 shadow-md ${
                  isUser 
                    ? 'btn-primary text-stone-950 font-medium' 
                    : 'bg-stone-900/70 border border-stone-800/80 text-stone-200'
                }`}>
                  <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70">
                    <span className="font-semibold uppercase tracking-wider">
                      {isUser ? 'You' : (msg.modelUsed ? msg.modelUsed.split('/')[1] || msg.modelUsed : 'NVIDIA Nemotron')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => copyToClipboard(msg.id, msg.content)}
                          className="hover:opacity-100 transition-opacity"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <UserIcon className="w-4 h-4 text-stone-300" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0 animate-pulse">
                <Bot className="w-4 h-4 text-amber-400" />
              </div>
              <div className="bg-stone-900/70 border border-stone-800/80 rounded-2xl px-4 py-3 text-xs text-stone-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                <span>NVIDIA AI is thinking and formulating the explanation...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="mt-4 pt-3 border-t border-stone-800/80 flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your doubt, formula derivation, or concept question... (Press Enter to send)"
              className="w-full bg-stone-900/60 border border-stone-800 rounded-2xl px-4 py-3 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/50 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-primary p-3.5 rounded-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Send doubt"
          >
            <Send className="w-4 h-4 text-stone-950" />
          </button>
        </form>
      </div>
    </div>
  );
};
