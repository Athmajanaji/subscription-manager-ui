// src/components/PageTransition.jsx
import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, y: 10, scale: 0.995 },
  in: { opacity: 1, y: 0, scale: 1 },
  out: { opacity: 0, y: -10, scale: 0.995 }
};

const transition = { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] };

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="in"
      exit="out"
      transition={transition}
      style={{ height: '100%' }} // keep layout stable
    >
      {children}
    </motion.div>
  );
}
