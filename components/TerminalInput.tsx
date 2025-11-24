import React, { useEffect, useRef } from 'react';

interface TerminalInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onEnter?: () => void;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  placeholder = "",
  autoFocus = false,
  onEnter
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter();
    }
  };

  return (
    <div className="flex items-center font-mono text-sm md:text-base w-full my-2 group">
      <span className="text-terminal-green mr-2 min-w-max">{label}</span>
      <div className="relative flex-grow">
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-none outline-none text-terminal-text placeholder-gray-600 focus:ring-0"
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
};
