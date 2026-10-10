'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CrystalIcon, Wordmark } from './Logo';

const FLAG = 'pathorko:splash-seen';

/** PWA launch splash: centred crystal with a fade-in, shown once per session. */
export default function Splash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(FLAG) === '1';
      window.sessionStorage.setItem(FLAG, '1');
    } catch {
      seen = false;
    }
    const timer = window.setTimeout(() => setVisible(false), seen ? 0 : 1100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-[#0a0a0f]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="will-change-transform"
          >
            <CrystalIcon size={96} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
          >
            <Wordmark className="text-2xl" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
