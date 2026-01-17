
import React, { useState, useRef, useEffect } from 'react';
import { Message, PLUMBER_DATA } from './types';
import ChatMessage from './components/ChatMessage';
import { getChatResponse } from './services/geminiService';

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '👋 Sveiki! Esu Vytauto Bartušio virtualus asistentas. Kokį klausimą turite ar kuo galėčiau Jums padėti?' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHandoverActive, setIsHandoverActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const result = await getChatResponse(userMessage, history);

    if (result.transferToHuman) {
      setIsHandoverActive(true);
    }

    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: result.answer,
      transferToHuman: result.transferToHuman 
    }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Background placeholder to simulate a website */}
      <div className="absolute inset-0 bg-slate-50 flex items-center justify-center pointer-events-auto opacity-10 select-none">
        <h2 className="text-4xl font-bold text-slate-300">Jūsų Svetainės Turinis</h2>
      </div>

      {/* Chat Window */}
      <div 
        className={`absolute bottom-24 right-4 md:right-8 w-[calc(100vw-2rem)] md:w-[400px] max-h-[600px] h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right pointer-events-auto border border-slate-100 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        {/* Header */}
        <header className="bg-blue-600 p-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-blue-600 ${isHandoverActive ? 'bg-orange-400 animate-pulse' : 'bg-green-400'}`}></div>
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">Vytautas Bartušis</h1>
              <p className="text-[10px] opacity-80 uppercase tracking-wider font-medium">Virtualus asistentas</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* Chat Area */}
        <main 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/50"
        >
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer / Input */}
        <footer className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Klauskite..."
              className="flex-1 bg-slate-100 text-black border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 disabled:bg-slate-300 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <div className="mt-2 text-[9px] text-center text-slate-400 font-bold uppercase tracking-wide">
            VYTAUTO BARTUŠIO • VIRTUALUS PAGALBININKAS
          </div>
        </footer>
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-6 right-6 w-16 h-16 bg-blue-600 rounded-full shadow-2xl text-white flex items-center justify-center hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto z-10 group"
      >
        <div className="relative">
          {isOpen ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              {!isOpen && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </>
          )}
        </div>
      </button>
    </div>
  );
};

export default App;
