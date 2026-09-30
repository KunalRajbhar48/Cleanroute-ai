import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, ArrowRight, MessageSquare } from 'lucide-react';
import { ChatMessage, Complaint } from '../types';
import { getCleanBotResponse } from '../services/aiService';

interface CleanBotChatProps {
  complaints: Complaint[];
  onNavigate: (page: string) => void;
}

export const CleanBotChat: React.FC<CleanBotChatProps> = ({
  complaints,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: 'Hello! I am CleanBot AI, your municipal waste intelligence assistant. How can I help you keep our city clean today?',
      timestamp: 'Just now',
    },
  ]);

  const quickPrompts = [
    'How do I report waste?',
    'Track complaint CR-1024',
    'What waste types can I report?',
    'How does route optimization work?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    // Query AI service
    setTimeout(() => {
      const botReply = getCleanBotResponse(query, complaints);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply.text,
        timestamp: 'Just now',
        actionLink: botReply.actionLink,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open CleanBot AI"
            className="group flex items-center gap-2.5 p-3.5 sm:px-4 sm:py-3.5 rounded-full bg-[#234D3C] hover:bg-[#1D3F31] dark:bg-[#3F755E] dark:hover:bg-[#4E8B70] text-[#FAF8F2] shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-[#FAF8F2]/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#FAF8F2]" />
            </div>
            <span className="hidden sm:inline font-semibold text-xs tracking-wide">
              CleanBot AI
            </span>
          </button>
        )}
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[350px] sm:w-[400px] h-[520px] rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-250">
          {/* Header */}
          <div className="p-4 bg-[#EDEDE3]/80 dark:bg-[#14221A] border-b border-[#234D3C]/10 dark:border-[#8EAD9A]/15 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#234D3C] dark:bg-[#3F755E] text-[#FAF8F2] flex items-center justify-center shadow-inner">
                <Sparkles className="w-4 h-4 text-[#FAF8F2]" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm text-[#1E2923] dark:text-[#F5F3EA]">
                  CleanBot AI
                </h3>
                <p className="text-[11px] text-[#66736B] dark:text-[#95A89D]">
                  Your smart waste assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-[#FAF8F2] dark:hover:bg-[#233C2F] text-[#66736B] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-[#EDEDE3]/40 dark:bg-[#182820]/60 border-b border-[#234D3C]/8 flex items-center gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-lg border border-[#234D3C]/10 bg-[#FAF8F2] dark:bg-[#233C2F] text-[#1E2923] dark:text-[#F5F3EA] hover:bg-[#DCE7DE] transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-left">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#234D3C] text-[#FAF8F2] rounded-br-none'
                      : 'bg-[#EDEDE3] dark:bg-[#14221A] text-[#1E2923] dark:text-[#F5F3EA] border border-[#234D3C]/8 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>

                  {m.actionLink && (
                    <button
                      onClick={() => {
                        onNavigate(m.actionLink!.page);
                        setIsOpen(false);
                      }}
                      className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#234D3C] dark:text-[#A4B588] hover:underline"
                    >
                      <span>{m.actionLink.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <span className="text-[9px] text-[#66736B] dark:text-[#95A89D] mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-[#FAF8F2] dark:bg-[#182820] border-t border-[#234D3C]/10 dark:border-[#8EAD9A]/15">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask CleanBot a question..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 bg-[#EDEDE3]/40 dark:bg-[#14221A] text-[#1E2923] dark:text-[#F5F3EA] focus:outline-none focus:ring-1 focus:ring-[#234D3C]"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#234D3C] text-[#FAF8F2] hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
