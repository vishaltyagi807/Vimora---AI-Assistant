'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const BOOT_LINES = [
  { text: 'VIMORA OS v4.2.1 — INITIALIZING...', delay: 0, color: '#00f0ff' },
  { text: '> Loading neural core modules...', delay: 600, color: '#a0c4ff' },
  { text: '> Calibrating voice synthesis engine...', delay: 1100, color: '#a0c4ff' },
  { text: '> Establishing LiveKit secure tunnel...', delay: 1600, color: '#a0c4ff' },
  { text: '> Authenticating agent credentials...', delay: 2100, color: '#a0c4ff' },
  { text: '> Activating real-time STT/TTS pipeline...', delay: 2600, color: '#a0c4ff' },
  { text: '✓ AGENT ONLINE — VIMORA READY', delay: 3100, color: '#00f0ff' },
];

interface BootScreenProps {
  onComplete: () => void;
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div
        style={{
          background: 'rgba(0, 240, 255, 0.08)',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          borderRadius: '2px',
          height: '3px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #1e3fef, #00f0ff)',
            boxShadow: '0 0 12px rgba(0, 240, 255, 0.8)',
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      <div
        className="mt-2 text-right font-orbitron text-xs"
        style={{ color: 'rgba(0, 240, 255, 0.5)' }}
      >
        {Math.round(progress)}%
      </div>
    </div>
  );
}

function HexGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ opacity: 0.06 }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex" x="0" y="0" width="50" height="57.735" patternUnits="userSpaceOnUse">
            <polygon
              points="25,0 50,14.434 50,43.301 25,57.735 0,43.301 0,14.434"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>
    </div>
  );
}

function CoreOrb() {
  return (
    <div className="relative flex items-center justify-center mb-12">
      {/* Outer ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 160,
          height: 160,
          border: '1px solid rgba(0, 240, 255, 0.15)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />
      {/* Middle ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 120,
          height: 120,
          border: '1px solid rgba(138, 43, 226, 0.3)',
          borderTopColor: 'rgba(138, 43, 226, 0.8)',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
      {/* Inner ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 90,
          height: 90,
          border: '1px solid rgba(0, 240, 255, 0.2)',
          borderTopColor: '#00f0ff',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      {/* Core */}
      <motion.div
        className="relative z-10 flex items-center justify-center rounded-full"
        style={{
          width: 64,
          height: 64,
          background: 'radial-gradient(circle, rgba(0,240,255,0.3) 0%, rgba(30,63,239,0.2) 100%)',
          boxShadow: '0 0 30px rgba(0, 240, 255, 0.4), 0 0 80px rgba(0, 240, 255, 0.15)',
        }}
        animate={{
          boxShadow: [
            '0 0 30px rgba(0, 240, 255, 0.4), 0 0 80px rgba(0, 240, 255, 0.15)',
            '0 0 50px rgba(0, 240, 255, 0.7), 0 0 120px rgba(0, 240, 255, 0.3)',
            '0 0 30px rgba(0, 240, 255, 0.4), 0 0 80px rgba(0, 240, 255, 0.15)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M14 3L14 25M3 14L25 14M7 7L21 21M21 7L7 21"
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <circle cx="14" cy="14" r="4" fill="#00f0ff" opacity="0.9" />
        </svg>
      </motion.div>
    </div>
  );
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, i]);
          setProgress(((i + 1) / BOOT_LINES.length) * 100);
        }, line.delay)
      );
    });

    // Trigger exit after all lines displayed
    timers.push(
      setTimeout(
        () => {
          setExiting(true);
        },
        BOOT_LINES[BOOT_LINES.length - 1].delay + 700
      )
    );

    timers.push(
      setTimeout(
        () => {
          onComplete();
        },
        BOOT_LINES[BOOT_LINES.length - 1].delay + 1300
      )
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#030712' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <HexGrid />

          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(0,240,255,0.4), transparent)',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)',
            }}
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />

          <div className="relative z-10 flex flex-col items-center w-full max-w-2xl px-6">
            <CoreOrb />

            {/* Title */}
            <motion.div
              className="mb-8 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1
                className="font-orbitron text-4xl font-black tracking-[0.25em] uppercase mb-1"
                style={{
                  color: '#00f0ff',
                  textShadow: '0 0 20px rgba(0, 240, 255, 0.8), 0 0 60px rgba(0, 240, 255, 0.3)',
                }}
              >
                VIMORA
              </h1>
              <p
                className="font-rajdhani text-sm tracking-[0.4em] uppercase"
                style={{ color: 'rgba(0, 240, 255, 0.4)' }}
              >
                Neural Voice Interface
              </p>
            </motion.div>

            {/* Terminal lines */}
            <div
              className="w-full max-w-md rounded-sm overflow-hidden"
              style={{
                background: 'rgba(0, 240, 255, 0.03)',
                border: '1px solid rgba(0, 240, 255, 0.1)',
              }}
            >
              <div
                className="px-3 py-1.5 flex items-center gap-2"
                style={{ borderBottom: '1px solid rgba(0, 240, 255, 0.08)' }}
              >
                <div className="flex gap-1">
                  {['#ff5f57', '#ffbd2e', '#28ca41'].map((c, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: c, opacity: 0.6 }}
                    />
                  ))}
                </div>
                <span
                  className="font-orbitron text-xs"
                  style={{ color: 'rgba(0, 240, 255, 0.3)' }}
                >
                  SYSTEM_BOOT.LOG
                </span>
              </div>
              <div className="px-4 py-3 min-h-[180px] font-mono text-xs leading-7 space-y-0.5">
                <AnimatePresence>
                  {BOOT_LINES.map(
                    (line, i) =>
                      visibleLines.includes(i) && (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            color: line.color,
                            textShadow:
                              line.color === '#00f0ff'
                                ? '0 0 8px rgba(0, 240, 255, 0.6)'
                                : 'none',
                            fontFamily: 'Orbitron, monospace',
                            fontSize: '11px',
                          }}
                        >
                          {line.text}
                          {i === visibleLines[visibleLines.length - 1] &&
                            i < BOOT_LINES.length - 1 && (
                              <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                                style={{ color: '#00f0ff' }}
                              >
                                _
                              </motion.span>
                            )}
                        </motion.div>
                      )
                  )}
                </AnimatePresence>
              </div>
            </div>

            <ProgressBar progress={progress} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
