
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  
  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('### ')) {
        return <h3 key={i} className="font-bold text-lg mt-2 mb-1">{trimmedLine.replace('### ', '')}</h3>;
      }
      
      // Handle bold, phone numbers and emails
      const parts = line.split(/(\*\*.*?\*\*|\+370\s?\d{3}\s?\d{5}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g);
      
      const formattedLine = parts.map((part, j) => {
        // Bold
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        // Phone number
        if (part.match(/\+370\s?\d{3}\s?\d{5}/)) {
          const cleanPhone = part.replace(/\s/g, '');
          return <a key={j} href={`tel:${cleanPhone}`} className="text-blue-600 underline font-bold hover:text-blue-800">{part}</a>;
        }
        // Email
        if (part.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
          return <a key={j} href={`mailto:${part}`} className="text-blue-600 underline font-bold hover:text-blue-800">{part}</a>;
        }
        return part;
      });

      return <div key={i} className="mb-1 min-h-[1.25rem]">{formattedLine}</div>;
    });
  };

  return (
    <div className={`flex w-full mb-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div 
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
          isAssistant 
            ? 'bg-white text-slate-800 rounded-tl-none border border-slate-100' 
            : 'bg-blue-600 text-white rounded-tr-none'
        }`}
      >
        <div className="text-sm md:text-base leading-relaxed">
          {formatContent(message.content)}
        </div>
        
        {message.transferToHuman && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              Susisiekite tiesiogiai:
            </p>
            <div className="flex flex-col gap-2">
              <a 
                href="tel:+37067805425" 
                className="flex items-center justify-between p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="font-bold">+370 678 05425</span>
                </div>
              </a>
              
              <a 
                href="mailto:info@vytautui.aurimoweb.store" 
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-600 text-white rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-bold">info@vytautui.aurimoweb.store</span>
                </div>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
