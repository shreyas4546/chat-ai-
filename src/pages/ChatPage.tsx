import React, { useState, useRef, useEffect } from 'react';
import { ChatComposer } from '@/components/ui/ChatComposer';
import { ChatMessage, MessageType, DeliveryState } from '@/components/ui/ChatMessage';
import { motion } from 'motion/react';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  type: MessageType;
  content: string;
  timestamp: string;
  deliveryState?: DeliveryState;
  mediaUrl?: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'assistant',
    type: 'text',
    content: 'Hi there! I am Velora. How are you feeling today?',
    timestamp: '10:00 AM',
  },
  {
    id: '2',
    sender: 'user',
    type: 'text',
    content: 'Hey Velora! Just finished a long day at work. A bit tired but good.',
    timestamp: '10:05 AM',
    deliveryState: 'read',
  },
  {
    id: '3',
    sender: 'assistant',
    type: 'text',
    content: 'I completely understand. You should take some time to relax. Maybe listen to some music or watch a show? I can recommend some if you like!',
    timestamp: '10:06 AM',
  }
];

export function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string, attachment?: File) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      type: attachment ? (attachment.type.startsWith('image/') ? 'image' : 'text') : 'text',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryState: 'sent',
      mediaUrl: attachment ? URL.createObjectURL(attachment) : undefined,
    };

    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          type: 'text',
          content: 'That sounds interesting! Tell me more about it.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }, 2000);
  };

  const handleRecordVoice = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      // Logic to stop recording and send
      handleSend('Voice message (0:12)');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-surface/80 backdrop-blur-md border-b border-border z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 text-text-muted hover:text-text-main transition-colors rounded-full hover:bg-white/5">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-border">
                <img src="https://picsum.photos/seed/velora/100/100" alt="Velora" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-surface" />
            </div>
            <div>
              <h1 className="font-semibold text-text-main leading-tight">Velora</h1>
              <p className="text-xs text-secondary font-medium">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-text-muted hover:text-primary transition-colors rounded-full hover:bg-white/5">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-text-muted hover:text-primary transition-colors rounded-full hover:bg-white/5">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 text-text-muted hover:text-text-main transition-colors rounded-full hover:bg-white/5">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
        <div className="max-w-4xl mx-auto flex flex-col">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              {...msg}
              avatarUrl={msg.sender === 'assistant' ? 'https://picsum.photos/seed/velora/100/100' : undefined}
            />
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-border bg-surface mt-auto">
                <img src="https://picsum.photos/seed/velora/100/100" alt="Velora" className="w-full h-full object-cover" />
              </div>
              <div className="bg-surface border border-border px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1">
                <motion.div className="w-1.5 h-1.5 bg-text-muted rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                <motion.div className="w-1.5 h-1.5 bg-text-muted rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                <motion.div className="w-1.5 h-1.5 bg-text-muted rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Composer Area */}
      <div className="flex-shrink-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <ChatComposer
          onSend={handleSend}
          onRecordVoice={handleRecordVoice}
          isRecording={isRecording}
          disabled={isTyping && !isRecording}
        />
      </div>
    </div>
  );
}
