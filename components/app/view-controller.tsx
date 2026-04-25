'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useSessionContext } from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { VimoreSessionView } from '@/components/app/vimora-session-view';
import { VimoreWelcomeView } from '@/components/app/vimora-welcome-view';

const FADE_VARIANTS = {
  variants: {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  },
  initial: 'hidden' as const,
  animate: 'visible' as const,
  exit: 'hidden' as const,
  transition: { duration: 0.5, ease: 'linear' as const },
};

interface ViewControllerProps {
  appConfig: AppConfig;
}

export function ViewController({ appConfig }: ViewControllerProps) {
  const { isConnected, start } = useSessionContext();

  return (
    <AnimatePresence mode="wait">
      {!isConnected && (
        <motion.div key="welcome" {...FADE_VARIANTS} className="w-full">
          <VimoreWelcomeView startButtonText={appConfig.startButtonText} onStartCall={start} />
        </motion.div>
      )}

      {isConnected && (
        <motion.div key="session-view" {...FADE_VARIANTS} className="fixed inset-0">
          <VimoreSessionView
            supportsChatInput={appConfig.supportsChatInput}
            supportsVideoInput={appConfig.supportsVideoInput}
            supportsScreenShare={appConfig.supportsScreenShare}
            isPreConnectBufferEnabled={appConfig.isPreConnectBufferEnabled}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
