'use client';

import { motion, AnimatePresence } from 'motion/react';
import { type AgentState, type ReceivedMessage } from '@livekit/components-react';

interface TranscriptPanelProps {
  agentState: AgentState;
  messages: ReceivedMessage[];
}

const STATE_LABEL: Record<AgentState, string> = {
  disconnected: 'OFFLINE',
  connecting: 'CONNECTING...',
  initializing: 'INITIALIZING...',
  idle: 'STANDBY',
  listening: 'LISTENING...',
  thinking: 'PROCESSING...',
  speaking: 'SPEAKING',
};

const STATE_COLOR: Record<AgentState, string> = {
  disconnected: 'rgba(100, 100, 120, 0.6)',
  connecting: 'rgba(0, 240, 255, 0.5)',
  initializing: 'rgba(0, 240, 255, 0.5)',
  idle: 'rgba(0, 240, 255, 0.3)',
  listening: 'rgba(0, 240, 255, 0.9)',
  thinking: 'rgba(138, 43, 226, 0.9)',
  speaking: 'rgba(0, 240, 255, 1)',
};

function AgentStateDisplay({ agentState }: { agentState: AgentState }) {
  const isSpeaking = agentState === 'speaking';
  const isListening = agentState === 'listening';
  const isThinking = agentState === 'thinking';
  const color = STATE_COLOR[agentState];

  return (
    <div
      className="p-3 rounded-lg mb-3"
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        border: `1px solid ${
          isThinking
            ? 'rgba(138, 43, 226, 0.2)'
            : 'rgba(0, 240, 255, 0.08)'
        }`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="font-orbitron text-xs tracking-widest"
          style={{ color: 'rgba(0, 240, 255, 0.4)', fontSize: '9px' }}
        >
          AGENT STATE
        </span>
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
          style={{
            background: `${color}15`,
            border: `1px solid ${color}30`,
          }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: color, boxShadow: `0 0 6px ${color}` }}
            animate={
              isSpeaking || isListening
                ? { opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }
                : isThinking
                  ? { opacity: [1, 0.5, 1] }
                  : { opacity: 1 }
            }
            transition={{ duration: isSpeaking ? 0.8 : 1.5, repeat: Infinity }}
          />
          <span
            className="font-orbitron font-bold"
            style={{ color, fontSize: '9px', letterSpacing: '0.2em' }}
          >
            {STATE_LABEL[agentState]}
          </span>
        </div>
      </div>

      {/* Visual audio bars for speaking */}
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            className="flex items-end justify-center gap-1 h-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full flex-shrink-0"
                style={{ background: `rgba(0, 240, 255, ${0.4 + (i % 3) * 0.2})` }}
                animate={{
                  height: [
                    4 + Math.random() * 8,
                    8 + Math.random() * 16,
                    4 + Math.random() * 8,
                  ],
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.3,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        )}
        {isListening && (
          <motion.div
            className="flex items-center gap-1 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <motion.div
                key={i}
                className="rounded-full"
                style={{ width: 3, background: 'rgba(0, 240, 255, 0.4)' }}
                animate={{ height: [3, 8 + Math.random() * 8, 3] }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        )}
        {isThinking && (
          <motion.div
            className="flex justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#8a2be2' }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.9, delay: i * 0.3, repeat: Infinity }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TranscriptEntry({ msg, index }: { msg: ReceivedMessage; index: number }) {
  const isUser = msg.from?.isLocal === true;
  const time = new Date(msg.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="mb-2"
    >
      <div className="flex items-center gap-2 mb-0.5">
        <div
          className="w-1 h-1 rounded-full flex-shrink-0"
          style={{
            background: isUser ? '#8a2be2' : '#00f0ff',
            boxShadow: isUser ? '0 0 4px #8a2be2' : '0 0 4px #00f0ff',
          }}
        />
        <span
          className="font-orbitron flex-shrink-0"
          style={{
            fontSize: '8px',
            letterSpacing: '0.2em',
            color: isUser ? 'rgba(138,43,226,0.6)' : 'rgba(0,240,255,0.5)',
          }}
        >
          {isUser ? 'USER' : 'AGENT'}
        </span>
        <span
          className="font-mono flex-shrink-0"
          style={{ fontSize: '9px', color: 'rgba(255,255,255,0.15)' }}
        >
          {time}
        </span>
      </div>
      <div
        className="pl-4 font-rajdhani text-sm leading-relaxed border-l"
        style={{
          borderColor: isUser ? 'rgba(138,43,226,0.2)' : 'rgba(0,240,255,0.15)',
          color: isUser ? 'rgba(200, 180, 255, 0.8)' : 'rgba(180, 230, 255, 0.8)',
        }}
      >
        {msg.message}
      </div>
    </motion.div>
  );
}

export function TranscriptPanel({ agentState, messages }: TranscriptPanelProps) {
  return (
    <div
      className="flex flex-col h-full rounded-xl overflow-hidden"
      style={{
        background: 'rgba(5, 8, 25, 0.75)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(0, 240, 255, 0.08)',
        boxShadow: '0 0 40px rgba(138, 43, 226, 0.04), inset 0 0 40px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(0, 240, 255, 0.06)' }}
      >
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ background: '#8a2be2', boxShadow: '0 0 6px #8a2be2' }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <span
          className="font-orbitron text-xs font-bold tracking-widest"
          style={{ color: 'rgba(138, 43, 226, 0.8)' }}
        >
          TRANSCRIPT
        </span>
      </div>

      {/* Agent State */}
      <div className="p-3 flex-shrink-0">
        <AgentStateDisplay agentState={agentState} />
      </div>

      {/* Transcript messages */}
      <div
        className="flex-1 overflow-y-auto px-4 pb-4"
        style={{ scrollbarWidth: 'thin' }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-6">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
              style={{
                background: 'rgba(138, 43, 226, 0.05)',
                border: '1px solid rgba(138, 43, 226, 0.1)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1V13M1 7H13"
                  stroke="rgba(138,43,226,0.4)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p
              className="font-orbitron"
              style={{ color: 'rgba(138, 43, 226, 0.25)', fontSize: '9px', letterSpacing: '0.15em' }}
            >
              AWAITING INPUT
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <TranscriptEntry key={msg.id} msg={msg} index={i} />
          ))
        )}
      </div>

      {/* Footer metrics */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(0, 240, 255, 0.06)' }}
      >
        <span
          className="font-orbitron"
          style={{ color: 'rgba(0, 240, 255, 0.2)', fontSize: '8px', letterSpacing: '0.15em' }}
        >
          {messages.length} ENTRIES
        </span>
        <motion.div
          className="flex items-center gap-1"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(0, 240, 255, 0.4)' }} />
          <span
            className="font-orbitron"
            style={{ color: 'rgba(0, 240, 255, 0.3)', fontSize: '8px', letterSpacing: '0.15em' }}
          >
            LIVE
          </span>
        </motion.div>
      </div>
    </div>
  );
}
