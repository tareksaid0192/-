import React from 'react';
import { ChatMessage } from '../types';
import { Bot, User } from 'lucide-react';

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex items-start gap-2.5 my-2.5 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white ${
          isUser ? 'bg-[#5B3D91]' : 'bg-[#4DB6AC]'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-xs text-sm leading-relaxed ${
          isUser
            ? 'bg-[#5B3D91] text-white rounded-tr-none text-right'
            : 'bg-white text-[#2D253D] border border-[#EAE4F2] rounded-tl-none text-right'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <span
          className={`block text-[10px] mt-1 text-left font-poppins ${
            isUser ? 'text-white/70' : 'text-[#7A708A]'
          }`}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
