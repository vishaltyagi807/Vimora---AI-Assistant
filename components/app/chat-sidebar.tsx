'use client';

import { motion, AnimatePresence } from 'motion/react';
import { type ReceivedMessage } from '@livekit/components-react';
import { useEffect, useRef } from 'react';

interface ChatSidebarProps {
  messages: ReceivedMessage[];
  isOpen: boolean;
  onClose: () => void;
}

function MessageBubble({ msg }: { msg: ReceivedMessage }) {
  const isUser = msg.from?.isLocal === true;
  const time = new Date(msg.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex flex-col mb-3 ${isUser ? 'items-end' : 'items-start'}`}
    >
      <div
        className="flex items-center gap-2 mb-1"
        style={{ flexDirection: isUser ? 'row-reverse' : 'row' }}
      >
        {/* Avatar */}
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: isUser
              ? 'linear-gradient(135deg, rgba(138,43,226,0.5), rgba(100,0,200,0.3))'
              : 'linear-gradient(135deg, rgba(0,240,255,0.4), rgba(30,63,239,0.3))',
            border: `1px solid ${isUser ? 'rgba(138,43,226,0.4)' : 'rgba(0,240,255,0.35)'}`,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            {isUser ? (
              <circle cx="5" cy="5" r="3" fill="rgba(138,43,226,0.9)" />
            ) : (
              <path
                d="M2 3L5 8L8 3"
                stroke="#00f0ff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </div>
        <span
          className="font-orbitron"
          style={{
            fontSize: '8px',
            letterSpacing: '0.2em',
            color: isUser ? 'rgba(138,43,226,0.6)' : 'rgba(0,240,255,0.5)',
          }}
        >
          {isUser ? 'YOU' : 'VIMORA'}
        </span>
        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)' }}>{time}</span>
      </div>

      <div
        className="max-w-[85%] px-3 py-2 rounded-xl font-rajdhani text-sm leading-relaxed"
        style={{
          background: isUser
            ? 'linear-gradient(135deg, rgba(138,43,226,0.18), rgba(100,0,200,0.12))'
            : 'linear-gradient(135deg, rgba(0,240,255,0.1), rgba(30,63,239,0.08))',
          border: `1px solid ${isUser ? 'rgba(138,43,226,0.25)' : 'rgba(0,240,255,0.15)'}`,
          color: isUser ? 'rgba(220, 200, 255, 0.9)' : 'rgba(200, 240, 255, 0.9)',
          boxShadow: isUser
            ? 'inset 0 0 20px rgba(138,43,226,0.05)'
            : 'inset 0 0 20px rgba(0,240,255,0.04)',
          wordBreak: 'break-word',
        }}
      >
        {msg.message}
      </div>
    </motion.div>
  );
}

export function ChatSidebar({ messages, isOpen, onClose }: ChatSidebarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="chat-sidebar"
          className="flex flex-col h-full overflow-hidden rounded-xl"
          style={{
            background: 'rgba(5, 8, 25, 0.75)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(0, 240, 255, 0.1)',
            boxShadow:
              '0 0 40px rgba(0, 240, 255, 0.04), inset 0 0 40px rgba(0, 0, 0, 0.3)',
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(0, 240, 255, 0.08)' }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: '#00f0ff', boxShadow: '0 0 6px #00f0ff' }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span
                className="font-orbitron text-xs font-bold tracking-widest"
                style={{ color: '#00f0ff' }}
              >
                CHAT LOG
              </span>
              <span
                className="font-orbitron text-xs px-1.5 py-0.5 rounded"
                style={{
                  background: 'rgba(0, 240, 255, 0.08)',
                  color: 'rgba(0, 240, 255, 0.5)',
                  fontSize: '9px',
                  border: '1px solid rgba(0, 240, 255, 0.1)',
                }}
              >
                {messages.length}
              </span>
            </div>
            <button
              id="vimora-close-chat"
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: 'rgba(0, 240, 255, 0.6)' }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M2 2L8 8M8 2L2 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{
                    background: 'rgba(0, 240, 255, 0.05)',
                    border: '1px solid rgba(0, 240, 255, 0.1)',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M4 15V14C4 11.8 5.8 10 8 10H12C14.2 10 16 11.8 16 14V15"
                      stroke="rgba(0,240,255,0.4)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="10"
                      cy="6"
                      r="3"
                      stroke="rgba(0,240,255,0.4)"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <p
                  className="font-orbitron text-xs"
                  style={{ color: 'rgba(0, 240, 255, 0.25)', letterSpacing: '0.1em' }}
                >
                  NO MESSAGES YET
                </p>
                <p
                  className="font-rajdhani text-xs mt-1"
                  style={{ color: 'rgba(255,255,255,0.2)' }}
                >
                  Start speaking to begin
                </p>
              </div>
            ) : (
              messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
