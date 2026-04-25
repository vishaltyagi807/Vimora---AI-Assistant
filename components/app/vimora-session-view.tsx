'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  useAgent,
  useSessionContext,
  useSessionMessages,
  useVoiceAssistant,
} from '@livekit/components-react';
import { AgentAudioVisualizerAura } from '@/components/agents-ui/agent-audio-visualizer-aura';
import { AgentControlBar } from '@/components/agents-ui/agent-control-bar';
import { ChatSidebar } from '@/components/app/chat-sidebar';
import { VoiceOrb } from '@/components/app/voice-orb';

function TopBar({ agentState }: { agentState: string }) {
  const isActive = agentState !== 'disconnected' && agentState !== 'connecting';

  return (
    <div
      className="absolute top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-4"
      style={{ borderBottom: '1px solid rgba(0, 240, 255, 0.05)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,240,255,0.3), rgba(30,63,239,0.2))',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            boxShadow: '0 0 12px rgba(0, 240, 255, 0.3)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 44 44" fill="none">
            <path
              d="M8 10L22 34L36 10"
              stroke="#00f0ff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span
          className="font-orbitron text-base font-black tracking-[0.25em]"
          style={{
            color: '#00f0ff',
            textShadow: '0 0 12px rgba(0, 240, 255, 0.6)',
          }}
        >
          VIMORA
        </span>
      </div>

      {/* Center status */}
      <div className="hidden items-center gap-3 md:flex">
        <motion.div
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: isActive ? '#00f0ff' : 'rgba(100,100,120,0.5)',
            boxShadow: isActive ? '0 0 8px #00f0ff' : 'none',
          }}
          animate={isActive ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span
          className="font-orbitron text-xs tracking-widest"
          style={{ color: isActive ? 'rgba(0, 240, 255, 0.5)' : 'rgba(100, 100, 120, 0.5)' }}
        >
          {isActive ? 'SESSION ACTIVE' : 'CONNECTING'}
        </span>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {[
          { label: 'LATENCY', value: '42ms' },
          { label: 'QUALITY', value: 'HD' },
        ].map((item) => (
          <div key={item.label} className="hidden flex-col items-end gap-0.5 md:flex">
            <span
              className="font-orbitron font-bold"
              style={{ fontSize: '10px', color: 'rgba(0, 240, 255, 0.7)', letterSpacing: '0.1em' }}
            >
              {item.value}
            </span>
            <span
              className="font-orbitron"
              style={{ fontSize: '7px', color: 'rgba(0, 240, 255, 0.3)', letterSpacing: '0.2em' }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BackgroundGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Hex / grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 240, 255, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* Radial glow center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0, 240, 255, 0.04) 0%, transparent 70%)',
        }}
      />
      {/* Purple corner glow */}
      <div
        className="absolute"
        style={{
          top: 0,
          right: 0,
          width: '40%',
          height: '40%',
          background:
            'radial-gradient(ellipse at top right, rgba(138, 43, 226, 0.06) 0%, transparent 70%)',
        }}
      />
      {/* Blue corner glow */}
      <div
        className="absolute"
        style={{
          bottom: 0,
          left: 0,
          width: '40%',
          height: '40%',
          background:
            'radial-gradient(ellipse at bottom left, rgba(30, 63, 239, 0.06) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}

export interface VimoreSessionViewProps {
  supportsChatInput?: boolean;
  supportsVideoInput?: boolean;
  supportsScreenShare?: boolean;
  isPreConnectBufferEnabled?: boolean;
  className?: string;
}

export function VimoreSessionView({
  supportsChatInput = true,
  supportsVideoInput = true,
  supportsScreenShare = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isPreConnectBufferEnabled,
  className,
  ...props
}: React.ComponentProps<'section'> & VimoreSessionViewProps) {
  const session = useSessionContext();
  const { messages } = useSessionMessages(session);
  const [chatOpen, setChatOpen] = useState(false);
  const { state: agentState } = useAgent();
  const { audioTrack: agentAudioTrack } = useVoiceAssistant();

  const stateLabel = agentState ?? 'disconnected';

  return (
    <section
      className={`relative h-full w-full overflow-hidden ${className ?? ''}`}
      style={{ background: '#030712' }}
      {...props}
    >
      <BackgroundGrid />
      <TopBar agentState={stateLabel} />

      {/* Main layout: sidebar | center | right panel */}
      <div className="absolute inset-0 flex flex-col pt-16 pb-28 md:pb-32">
        <div className="flex flex-1 gap-3 overflow-hidden px-3 md:px-4">
          {/* LEFT: Chat sidebar */}
          <div
            className={`hidden flex-shrink-0 transition-all duration-300 md:flex ${chatOpen ? 'w-72' : 'w-0 overflow-hidden'}`}
          >
            {chatOpen && (
              <div className="h-full w-72">
                <ChatSidebar
                  messages={messages}
                  isOpen={chatOpen}
                  onClose={() => setChatOpen(false)}
                />
              </div>
            )}
          </div>

          {/* CENTER: Voice Orb + Visualizer */}
          <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center">
            {/* Aura visualizer backdrop */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <AgentAudioVisualizerAura
                size="xl"
                state={stateLabel}
                color="#00f0ff"
                colorShift={0.08}
                themeMode="dark"
                audioTrack={agentAudioTrack}
                className="opacity-70"
              />
            </div>

            {/* Voice Orb on top */}
            <motion.div
              className="relative z-10"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <VoiceOrb agentState={stateLabel} size={180} />
            </motion.div>

            {/* Mobile transcript toggle */}
            <div className="mt-10 w-full max-w-sm md:hidden">
              <AnimatePresence>
                {messages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="overflow-y-auto rounded-xl p-3"
                      style={{
                        maxHeight: 120,
                        background: 'rgba(5, 8, 25, 0.8)',
                        border: '1px solid rgba(0, 240, 255, 0.1)',
                      }}
                    >
                      {messages.slice(-3).map((msg) => {
                        const isUser = msg.from?.isLocal === true;
                        return (
                          <div key={msg.id} className="mb-1">
                            <span
                              className="font-orbitron mr-2"
                              style={{
                                fontSize: '8px',
                                color: isUser ? 'rgba(138,43,226,0.6)' : 'rgba(0,240,255,0.5)',
                              }}
                            >
                              {isUser ? 'YOU' : 'VIMORA'}:
                            </span>
                            <span
                              className="font-rajdhani text-xs"
                              style={{ color: 'rgba(200,220,255,0.7)' }}
                            >
                              {msg.message}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="absolute right-0 bottom-0 left-0 z-50 flex justify-center px-4 pb-4">
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
        >
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              background: 'rgba(5, 8, 25, 0.85)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(0, 240, 255, 0.12)',
              boxShadow: '0 0 40px rgba(0, 240, 255, 0.06), 0 -1px 0 rgba(0, 240, 255, 0.08)',
            }}
          >
            <AgentControlBar
              variant="livekit"
              controls={{
                leave: true,
                microphone: true,
                chat: supportsChatInput,
                camera: supportsVideoInput,
                screenShare: supportsScreenShare,
              }}
              isChatOpen={chatOpen}
              isConnected={session.isConnected}
              onDisconnect={session.end}
              onIsChatOpenChange={setChatOpen}
              className="border-none bg-transparent shadow-none"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
