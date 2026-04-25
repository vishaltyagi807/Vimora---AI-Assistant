'use client';

import { useEffect, useState } from 'react';

import { motion } from 'motion/react';

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

interface Particle { id: number; x: number; y: number; size: number; duration: number; delay: number; }

function ParticleField() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 6 + 4,
        delay: Math.random() * 4,
      }))
    );
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0 ? '#00f0ff' : p.id % 3 === 1 ? '#8a2be2' : '#1e3fef',
            boxShadow: `0 0 ${p.size * 2}px currentColor`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.7, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function VoiceOrbWelcome() {
  return (
    <div className="relative flex items-center justify-center mb-10">
      {/* Outermost halo */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 260,
          height: 260,
          background:
            'radial-gradient(circle, rgba(0,240,255,0.04) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Outer ring 1 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 210,
          height: 210,
          border: '1px solid rgba(0, 240, 255, 0.08)',
        }}
        animate={{ rotate: 360, scale: [1, 1.02, 1] }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Dashed ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 176,
          height: 176,
          border: '1px dashed rgba(138, 43, 226, 0.25)',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />

      {/* Active cyan ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 148,
          height: 148,
          border: '1.5px solid transparent',
          borderTopColor: '#00f0ff',
          borderRightColor: 'rgba(0, 240, 255, 0.3)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />

      {/* Core orb */}
      <motion.div
        className="relative z-10 flex items-center justify-center rounded-full"
        style={{
          width: 120,
          height: 120,
          background:
            'radial-gradient(circle at 35% 35%, rgba(0,240,255,0.35) 0%, rgba(30,63,239,0.25) 50%, rgba(138,43,226,0.15) 100%)',
          boxShadow:
            '0 0 40px rgba(0, 240, 255, 0.35), 0 0 100px rgba(0, 240, 255, 0.12), inset 0 0 40px rgba(0, 240, 255, 0.1)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
        }}
        animate={{
          boxShadow: [
            '0 0 40px rgba(0, 240, 255, 0.35), 0 0 100px rgba(0, 240, 255, 0.12), inset 0 0 40px rgba(0, 240, 255, 0.1)',
            '0 0 60px rgba(0, 240, 255, 0.55), 0 0 140px rgba(0, 240, 255, 0.2), inset 0 0 60px rgba(0, 240, 255, 0.15)',
            '0 0 40px rgba(0, 240, 255, 0.35), 0 0 100px rgba(0, 240, 255, 0.12), inset 0 0 40px rgba(0, 240, 255, 0.1)',
          ],
          scale: [1, 1.03, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* V logo */}
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path
            d="M8 10L22 34L36 10"
            stroke="#00f0ff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
          <path
            d="M14 10L22 26L30 10"
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.4"
          />
        </svg>
      </motion.div>

      {/* Orbital dots */}
      {[0, 120, 240].map((deg, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: 148,
            height: 148,
          }}
          animate={{ rotate: [deg, deg + 360] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: 5,
              height: 5,
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              background: i === 0 ? '#00f0ff' : i === 1 ? '#8a2be2' : '#1e3fef',
              boxShadow: `0 0 8px ${i === 0 ? '#00f0ff' : i === 1 ? '#8a2be2' : '#1e3fef'}`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

export const VimoreWelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  return (
    <div ref={ref} className="relative flex flex-col items-center justify-center min-h-screen px-4">
      <ParticleField />

      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Brand name */}
        <motion.div
          className="mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <h1
            className="font-orbitron text-5xl md:text-6xl font-black tracking-[0.3em] uppercase"
            style={{
              color: '#00f0ff',
              textShadow:
                '0 0 20px rgba(0, 240, 255, 0.8), 0 0 60px rgba(0, 240, 255, 0.3)',
            }}
          >
            VIMORA
          </h1>
          <p
            className="font-rajdhani text-sm tracking-[0.5em] uppercase mt-1"
            style={{ color: 'rgba(0, 240, 255, 0.4)' }}
          >
            AI Voice Interface
          </p>
        </motion.div>

        <VoiceOrbWelcome />

        <motion.p
          className="font-rajdhani text-lg mb-2 max-w-sm"
          style={{ color: 'rgba(160, 196, 255, 0.8)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Neural voice intelligence. Real-time. Immersive.
        </motion.p>
        <motion.p
          className="font-rajdhani text-sm mb-10 max-w-xs"
          style={{ color: 'rgba(160, 196, 255, 0.4)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Powered by LiveKit Agent Infrastructure
        </motion.p>

        {/* Start button */}
        <motion.button
          onClick={onStartCall}
          id="vimora-start-btn"
          className="relative group font-orbitron text-xs font-bold tracking-[0.3em] uppercase px-10 py-4 rounded-full overflow-hidden"
          style={{
            background: 'transparent',
            border: '1.5px solid rgba(0, 240, 255, 0.5)',
            color: '#00f0ff',
            letterSpacing: '0.3em',
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {/* Hover glow fill */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(138,43,226,0.1))',
            }}
          />
          <span className="relative z-10">{startButtonText}</span>
          {/* Glow on hover */}
          <div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              boxShadow:
                '0 0 20px rgba(0, 240, 255, 0.4), inset 0 0 20px rgba(0, 240, 255, 0.05)',
            }}
          />
        </motion.button>

        {/* Status indicators */}
        <motion.div
          className="flex items-center gap-6 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {[
            { label: 'LATENCY', value: '<50ms', ok: true },
            { label: 'STATUS', value: 'ONLINE', ok: true },
            { label: 'AGENT', value: 'READY', ok: true },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#00f0ff' }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
                />
                <span
                  className="font-orbitron text-xs"
                  style={{ color: '#00f0ff', fontSize: '9px', letterSpacing: '0.15em' }}
                >
                  {stat.value}
                </span>
              </div>
              <span
                className="font-orbitron"
                style={{ color: 'rgba(0, 240, 255, 0.3)', fontSize: '8px', letterSpacing: '0.2em' }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};
