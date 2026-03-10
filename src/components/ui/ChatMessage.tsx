import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Check, CheckCheck, Play, FileText, Image as ImageIcon } from 'lucide-react';

export type MessageType = 'text' | 'image' | 'video' | 'audio';
export type DeliveryState = 'sending' | 'sent' | 'delivered' | 'read';

export interface ChatMessageProps {
  id: string;
  sender: 'user' | 'assistant';
  type: MessageType;
  content: string;
  timestamp: string;
  deliveryState?: DeliveryState;
  avatarUrl?: string;
  mediaUrl?: string;
}

export function ChatMessage({
  sender,
  type,
  content,
  timestamp,
  deliveryState,
  avatarUrl,
  mediaUrl,
}: ChatMessageProps) {
  const isUser = sender === 'user';

  const renderMedia = () => {
    if (!mediaUrl) return null;

    switch (type) {
      case 'image':
        return (
          <div className="relative rounded-xl overflow-hidden mb-2 max-w-[280px] sm:max-w-sm group">
            <img 
              src={mediaUrl} 
              alt="Attached media" 
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="relative rounded-xl overflow-hidden mb-2 max-w-[280px] sm:max-w-sm bg-black aspect-video flex items-center justify-center group cursor-pointer">
            <video src={mediaUrl} className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
            </div>
          </div>
        );
      case 'audio':
        return (
          <div className="flex items-center gap-3 bg-black/20 rounded-xl p-3 mb-2 min-w-[200px]">
            <button className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors">
              <Play className="w-5 h-5 ml-1" />
            </button>
            <div className="flex-1">
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-1/3 rounded-full" />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-text-muted">
                <span>0:12</span>
                <span>0:45</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-3 bg-black/20 rounded-xl p-3 mb-2">
            <FileText className="w-8 h-8 text-text-muted" />
            <span className="text-sm truncate max-w-[150px]">Document.pdf</span>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "flex w-full mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex max-w-[85%] sm:max-w-[75%] gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        {!isUser && (
          <div className="flex-shrink-0 mt-auto">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-border bg-surface shadow-lg shadow-primary/10">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Velora" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-secondary opacity-80" />
              )}
            </div>
          </div>
        )}

        {/* Bubble */}
        <div className={cn(
          "flex flex-col",
          isUser ? "items-end" : "items-start"
        )}>
          <div className={cn(
            "relative px-4 py-3 rounded-2xl shadow-sm backdrop-blur-sm",
            isUser 
              ? "bg-primary text-white rounded-br-sm shadow-primary/20" 
              : "bg-surface border border-border text-text-main rounded-bl-sm shadow-black/20"
          )}>
            {renderMedia()}
            
            {content && (
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                {content}
              </p>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-1.5 mt-1.5 px-1">
            <span className="text-[11px] font-medium text-text-muted/70 tracking-wide">
              {timestamp}
            </span>
            {isUser && deliveryState && (
              <span className="text-text-muted/70">
                {deliveryState === 'sending' && <Check className="w-3.5 h-3.5 opacity-50" />}
                {deliveryState === 'sent' && <Check className="w-3.5 h-3.5" />}
                {deliveryState === 'delivered' && <CheckCheck className="w-3.5 h-3.5" />}
                {deliveryState === 'read' && <CheckCheck className="w-3.5 h-3.5 text-secondary" />}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
