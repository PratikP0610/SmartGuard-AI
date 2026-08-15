import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnimatedList({ children, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <AnimatePresence>
        {React.Children.map(children, (child) => (
          <motion.div
            key={child.key}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, type: 'spring', bounce: 0.25 }}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
