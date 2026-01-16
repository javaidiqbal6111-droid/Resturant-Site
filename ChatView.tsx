
import React, { useState, useEffect, useRef } from 'react';
import { Send, X, User, Bike } from 'lucide-react';
import { Message, Rider } from './types';

interface ChatViewProps {
  rider: Rider;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ rider, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi! I'm ${rider.name}, your Mustafa Elmi courier. I've just picked up your order and I'm on my way!`,
      sender: 'rider',
      timestamp: Date.now() - 60000,
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate rider reply
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          text: "Thanks! See you soon. I'm following the GPS directions.",
          sender: 'rider',
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, reply]);
      }, 2000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-[2rem] h-[80vh] sm:h-[600px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={rider.image} className="w-10 h-10 rounded-full object-cover border border-gray-100" alt={rider.name} />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">{rider.name}</h4>
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">On his way</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                msg.sender === 'user' 
                  ? 'bg-green-500 text-white rounded-tr-none shadow-md shadow-green-100' 
                  : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none shadow-sm'
              }`}>
                {msg.text}
                <div className={`text-[10px] mt-1 opacity-60 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-green-400 focus:bg-white transition-all text-sm"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="w-11 h-11 bg-green-500 text-white rounded-xl flex items-center justify-center hover:bg-green-600 disabled:opacity-50 transition-all active:scale-90"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};