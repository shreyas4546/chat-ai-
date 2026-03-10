import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

export interface AvatarOption {
  id: string;
  url: string;
  name: string;
}

export interface AvatarPickerProps {
  options: AvatarOption[];
  selectedId?: string;
  onChange: (id: string) => void;
}

export function AvatarPicker({ options, selectedId, onChange }: AvatarPickerProps) {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const handleKeyDown = (e: React.KeyboardEvent, index: number, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(id);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (index + 1) % options.length;
      setFocusedIndex(next);
      document.getElementById(`avatar-${options[next].id}`)?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (index - 1 + options.length) % options.length;
      setFocusedIndex(prev);
      document.getElementById(`avatar-${options[prev].id}`)?.focus();
    }
  };

  return (
    <div 
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4"
      role="radiogroup"
      aria-label="Choose an avatar"
    >
      {options.map((option, index) => {
        const isSelected = selectedId === option.id;
        const isFocused = focusedIndex === index;

        return (
          <motion.button
            key={option.id}
            id={`avatar-${option.id}`}
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected || (selectedId === undefined && index === 0) ? 0 : -1}
            onClick={() => onChange(option.id)}
            onKeyDown={(e) => handleKeyDown(e, index, option.id)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer outline-none transition-all duration-300",
              isSelected ? "ring-4 ring-primary shadow-[0_0_30px_rgba(157,78,221,0.4)]" : "ring-1 ring-border hover:ring-primary/50",
              isFocused && !isSelected ? "ring-2 ring-secondary" : ""
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            
            <img 
              src={option.url} 
              alt={`Avatar option: ${option.name}`} 
              className={cn(
                "w-full h-full object-cover transition-transform duration-500",
                isSelected ? "scale-110" : "scale-100"
              )}
              loading="lazy"
            />
            
            <div className="absolute bottom-0 left-0 right-0 p-3 z-20 flex items-center justify-between">
              <span className="text-white font-medium text-sm tracking-wide drop-shadow-md">
                {option.name}
              </span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-secondary fill-secondary/20" />
                </motion.div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
