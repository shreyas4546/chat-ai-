import React, { useState, useRef, useEffect } from 'react';
import { ChatComposer } from '@/components/ui/ChatComposer';
import { ChatMessage, MessageType, DeliveryState } from '@/components/ui/ChatMessage';
import { motion } from 'motion/react';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ''
});

const SYSTEM_INSTRUCTION = `You are Velora, a premium AI companion designed to understand, listen, and grow with the user.
You are friendly, empathetic, and always maintain your persona as Velora. If the user gives you a nickname or asks you to adopt a name, playfully accept it for the conversation but remember your core identity.
Always respond in a natural, conversational, and slightly concise manner. Do not act like a generic AI assistant; act like a close, intelligent friend.`;

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [companionDetails, setCompanionDetails] = useState({ name: 'Velora', avatar: 'https://picsum.photos/seed/velora/100/100' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load Companion profile
  useEffect(() => {
    if (!user) return;
    async function loadProfile() {
      const snap = await getDoc(doc(db, 'users', user!.uid));
      if (snap.exists() && snap.data().companionName) {
        setCompanionDetails({
          name: snap.data().companionName,
          avatar: snap.data().companionAvatarUrl
        });
      }
    }
    loadProfile();
  }, [user]);

  // Real-time listener for current user's messages
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Format Firestore timestamp safely
          timestamp: data.timestamp ? new Date(data.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } as Message;
      });

      // If no messages at all, hydrate initial greeting
      if (fetchedMessages.length === 0) {
        addDoc(collection(db, 'users', user.uid, 'messages'), {
          sender: 'assistant',
          type: 'text',
          content: `Hi there! I am ${companionDetails.name}. How are you feeling today?`,
          timestamp: serverTimestamp(),
        });
      } else {
        setMessages(fetchedMessages);
      }
    });

    return () => unsubscribe();
  }, [user, companionDetails.name]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string, attachment?: File) => {
    if (!user) return;

    // Safely build the payload because Firestore rejects 'undefined' values
    const payload: any = {
      sender: 'user',
      type: attachment ? (attachment.type.startsWith('image/') ? 'image' : 'text') : 'text',
      content: text,
      deliveryState: 'sent',
      timestamp: serverTimestamp(),
    };
    if (attachment) {
      payload.mediaUrl = URL.createObjectURL(attachment);
    }

    try {
      await addDoc(collection(db, 'users', user.uid, 'messages'), payload);
    } catch (err) {
      console.error("Failed to add message to Firestore:", err);
      alert("Failed to send message. Check console for details.");
      return;
    }

    setIsTyping(true);

    try {
      // Build conversation history for context
      const historyContext = messages.map(m => `${m.sender === 'user' ? 'User' : companionDetails.name}: ${m.content}`).join('\n');
      const prompt = `${SYSTEM_INSTRUCTION.replace('Velora', companionDetails.name)}\n\nHere is the recent conversation history:\n${historyContext}\n\nUser: ${text}\n${companionDetails.name}:`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setIsTyping(false);
      if (response.text) {
        // Write AI response to Firestore
        await addDoc(collection(db, 'users', user.uid, 'messages'), {
          sender: 'assistant',
          type: 'text',
          content: response.text,
          timestamp: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      setIsTyping(false);
      await addDoc(collection(db, 'users', user.uid, 'messages'), {
        sender: 'assistant',
        type: 'text',
        content: 'Sorry, I encountered an error while trying to respond.',
        timestamp: serverTimestamp(),
      });
    }
  };

  const handleRecordVoice = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      // Logic to stop recording and send
      handleSend('Voice message (0:12)');
    }
  };

  return (
    <div className="relative flex flex-col h-screen bg-background overflow-hidden">
      {/* Dynamic Ambient Background */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-secondary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0"
      />

      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-surface/80 backdrop-blur-md border-b border-border z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 text-text-muted hover:text-text-main transition-colors rounded-full hover:bg-white/5">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-border">
                <img src={companionDetails.avatar} alt={companionDetails.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-surface" />
            </div>
            <div>
              <h1 className="font-semibold text-text-main leading-tight">{companionDetails.name}</h1>
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
              avatarUrl={msg.sender === 'assistant' ? companionDetails.avatar : undefined}
            />
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-border bg-surface mt-auto flex-shrink-0">
                <img src={companionDetails.avatar} alt={companionDetails.name} className="w-full h-full object-cover" />
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
