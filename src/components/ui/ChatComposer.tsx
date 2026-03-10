import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, Paperclip, Smile, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChatComposerProps {
  onSend: (text: string, attachment?: File) => void;
  onRecordVoice?: () => void;
  isRecording?: boolean;
  disabled?: boolean;
}

export function ChatComposer({ onSend, onRecordVoice, isRecording, disabled }: ChatComposerProps) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if ((text.trim() || attachment) && !disabled) {
      onSend(text.trim(), attachment || undefined);
      setText('');
      setAttachment(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  return (
    <motion.div 
      className={cn(
        "relative flex flex-col w-full max-w-4xl mx-auto rounded-2xl bg-surface/80 backdrop-blur-xl border border-border transition-all duration-300",
        isFocused ? "ring-2 ring-primary/50 border-primary/30 shadow-[0_0_20px_rgba(157,78,221,0.15)]" : "shadow-lg"
      )}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <AnimatePresence>
        {attachment && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 px-4 pt-3 pb-1"
          >
            <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg border border-border text-sm">
              <Paperclip className="w-4 h-4 text-primary" />
              <span className="truncate max-w-[200px] text-text-main">{attachment.name}</span>
              <button 
                onClick={() => setAttachment(null)}
                className="ml-2 text-text-muted hover:text-red-400 transition-colors"
                aria-label="Remove attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2 p-2 sm:p-3">
        <div className="flex items-center gap-1 pb-1">
          <label className="p-2 text-text-muted hover:text-primary transition-colors cursor-pointer rounded-full hover:bg-primary/10">
            <Paperclip className="w-5 h-5" />
            <input type="file" className="hidden" onChange={handleFileChange} disabled={disabled} />
          </label>
          <button 
            type="button"
            className="p-2 text-text-muted hover:text-primary transition-colors rounded-full hover:bg-primary/10 hidden sm:block"
            aria-label="Add emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 relative min-h-[44px] flex items-center">
          {isRecording ? (
            <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-primary">Recording voice...</span>
              <div className="flex-1 flex items-center justify-center gap-1 h-6">
                {/* Fake waveform */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-primary rounded-full"
                    animate={{ height: ['20%', '100%', '20%'] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Message Velora..."
              disabled={disabled}
              className="w-full bg-transparent text-text-main placeholder:text-text-muted resize-none focus:outline-none py-3 px-2 max-h-[120px] min-h-[44px] scrollbar-thin"
              rows={1}
              aria-label="Message input"
            />
          )}
        </div>

        <div className="flex items-center gap-2 pb-1 pr-1">
          {text.trim() || attachment ? (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={disabled}
              className="p-3 bg-primary text-white rounded-full shadow-lg shadow-primary/25 hover:bg-primary-hover transition-colors disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRecordVoice}
              disabled={disabled}
              className={cn(
                "p-3 rounded-full transition-colors disabled:opacity-50",
                isRecording 
                  ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" 
                  : "bg-surface text-text-muted hover:text-secondary hover:bg-secondary/10"
              )}
              aria-label={isRecording ? "Stop recording" : "Record voice message"}
            >
              <Mic className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
