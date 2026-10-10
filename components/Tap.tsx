'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/** Wraps any control with the native-feeling press: scale to 0.96 on tap. */
export default function Tap({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}
