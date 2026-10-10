'use client';

import { motion } from 'framer-motion';

/** Page transition: fade + slight upward slide, 200ms ease-out. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}
