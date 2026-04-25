'use client';

import { motion } from 'motion/react';
import { type AgentState } from '@livekit/components-react';

interface VoiceOrbProps {
  agentState: AgentState;
  size?: number;
}

const STATE_CONFIG: Record<
  AgentState,
  { primaryColor: string; secondaryColor: string; label: string; pulseSpeed: number }
> = {
  disconnected: {
    primaryColor: 'rgba(30, 63, 239, 0.2)',
    secondaryColor: 'rgba(138, 43, 226, 0.1)',
    label: 'DISCONNECTED',
    pulseSpeed: 4,
  },
  connecting: {
    primaryColor: 'rgba(0, 240, 255, 0.2)',
    secondaryColor: 'rgba(30, 63, 239, 0.15)',
    label: 'CONNECTING',
    pulseSpeed: 2,
  },
  initializing: {
    primaryColor: 'rgba(0, 240, 255, 0.25)',
    secondaryColor: 'rgba(30, 63, 239, 0.15)',
    label: 'INITIALIZING',
    pulseSpeed: 2,
  },
  idle: {
    primaryColor: 'rgba(0, 240, 255, 0.18)',
    secondaryColor: 'rgba(138, 43, 226, 0.12)',
    label: 'IDLE',
    pulseSpeed: 4,
  },
  listening: {
    primaryColor: 'rgba(0, 240, 255, 0.55)',
    secondaryColor: 'rgba(0, 200, 255, 0.3)',
    label: 'LISTENING',
    pulseSpeed: 1.5,
  },
  thinking: {
    primaryColor: 'rgba(138, 43, 226, 0.5)',
    secondaryColor: 'rgba(100, 0, 200, 0.3)',
    label: 'THINKING',
    pulseSpeed: 1,
  },
  speaking: {
    primaryColor: 'rgba(0, 240, 255, 0.7)',
    secondaryColor: 'rgba(30, 63, 239, 0.4)',
    label: 'SPEAKING',
    pulseSpeed: 0.8,
  },
  'pre-connect-buffering': {
    primaryColor: 'rgba(0, 240, 255, 0.2)',
    secondaryColor: 'rgba(30, 63, 239, 0.12)',
    label: 'BUFFERING',
    pulseSpeed: 2.5,
  },
  failed: {
    primaryColor: 'rgba(255, 60, 60, 0.3)',
    secondaryColor: 'rgba(200, 0, 0, 0.15)',
    label: 'FAILED',
    pulseSpeed: 3,
  },
};

function WaveformRings({ agentState }: { agentState: AgentState }) {
  const isSpeaking = agentState === 'speaking';
  const isListening = agentState === 'listening';

  return (
    <>
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: '100%',
            height: '100%',
            border: `1px solid ${
              isSpeaking
                ? `rgba(0, 240, 255, ${0.5 / i})`
                : isListening
                  ? `rgba(0, 240, 255, ${0.35 / i})`
                  : `rgba(138, 43, 226, ${0.2 / i})`
            }`,
          }}
          animate={{
            scale: isSpeaking
              ? [1, 1.15 + i * 0.12, 1]
              : isListening
                ? [1, 1.08 + i * 0.06, 1]
                : [1, 1.03 + i * 0.02, 1],
            opacity: isSpeaking ? [0.8, 0, 0.8] : isListening ? [0.6, 0, 0.6] : [0.3, 0, 0.3],
          }}
          transition={{
            duration: isSpeaking ? 1.2 : isListening ? 2 : 3.5,
            delay: i * (isSpeaking ? 0.25 : isListening ? 0.4 : 0.7),
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  );
}

function ThinkingRing({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: '85%',
        height: '85%',
        border: '2px solid transparent',
        borderTopColor: '#8a2be2',
        borderRightColor: 'rgba(138, 43, 226, 0.4)',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
    />
  );
}

function ConnectingDots({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <>
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ width: '100%', height: '100%' }}
          animate={{ rotate: [deg, deg + 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: i * 0.1 }}
        >
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 4,
              height: 4,
              top: 4,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#00f0ff',
              boxShadow: '0 0 6px #00f0ff',
            }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
          />
        </motion.div>
      ))}
    </>
  );
}

export function VoiceOrb({ agentState, size = 200 }: VoiceOrbProps) {
  const config = STATE_CONFIG[agentState] ?? STATE_CONFIG.idle;
  const isThinking = agentState === 'thinking';
  const isConnecting = agentState === 'connecting' || agentState === 'initializing';
  const isSpeaking = agentState === 'speaking';
  const isListening = agentState === 'listening';

  const glowColor = isSpeaking
    ? 'rgba(0, 240, 255, 0.7)'
    : isListening
      ? 'rgba(0, 240, 255, 0.5)'
      : isThinking
        ? 'rgba(138, 43, 226, 0.5)'
        : 'rgba(0, 240, 255, 0.2)';

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Waveform rings */}
      <WaveformRings agentState={agentState} />

      {/* Outer decorative ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '92%',
          height: '92%',
          border: '1px solid rgba(0, 240, 255, 0.1)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      {/* Inner ring with state color */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '78%',
          height: '78%',
          border: `1px solid ${glowColor}`,
        }}
        animate={{
          rotate: isSpeaking ? -360 : 360,
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          rotate: { duration: isThinking ? 3 : 8, repeat: Infinity, ease: 'linear' },
          opacity: { duration: config.pulseSpeed, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Thinking spinner */}
      <ThinkingRing active={isThinking} />

      {/* Connecting dots */}
      <ConnectingDots active={isConnecting} />

      {/* Core orb */}
      <motion.div
        className="relative z-10 flex items-center justify-center overflow-hidden rounded-full"
        style={{
          width: '60%',
          height: '60%',
          background: `radial-gradient(circle at 35% 35%, ${config.primaryColor}, ${config.secondaryColor})`,
        }}
        animate={{
          boxShadow: [
            `0 0 ${isSpeaking ? 50 : 25}px ${glowColor}, inset 0 0 30px rgba(0, 0, 0, 0.4)`,
            `0 0 ${isSpeaking ? 80 : 40}px ${glowColor}, inset 0 0 30px rgba(0, 0, 0, 0.4)`,
            `0 0 ${isSpeaking ? 50 : 25}px ${glowColor}, inset 0 0 30px rgba(0, 0, 0, 0.4)`,
          ],
          scale: isSpeaking ? [1, 1.06, 1] : [1, 1.02, 1],
        }}
        transition={{
          duration: config.pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* V logo */}
        <svg
          width="36%"
          height="36%"
          viewBox="0 0 44 44"
          fill="none"
          style={{
            filter:
              isSpeaking || isListening
                ? 'drop-shadow(0 0 6px rgba(0, 240, 255, 0.9))'
                : isThinking
                  ? 'drop-shadow(0 0 6px rgba(138, 43, 226, 0.9))'
                  : 'drop-shadow(0 0 3px rgba(0, 240, 255, 0.5))',
          }}
        >
          <path
            d="M8 10L22 34L36 10"
            stroke={isThinking ? '#8a2be2' : '#00f0ff'}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 10L22 26L30 10"
            stroke={isThinking ? '#8a2be2' : '#00f0ff'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.4"
          />
        </svg>
      </motion.div>

      {/* State label */}
      <div
        className="font-orbitron absolute text-center"
        style={{
          bottom: '-28px',
          left: 0,
          right: 0,
          fontSize: '9px',
          letterSpacing: '0.3em',
          color: isThinking
            ? 'rgba(138, 43, 226, 0.7)'
            : isSpeaking || isListening
              ? 'rgba(0, 240, 255, 0.7)'
              : 'rgba(0, 240, 255, 0.3)',
        }}
      >
        {config.label}
      </div>
    </div>
  );
}
