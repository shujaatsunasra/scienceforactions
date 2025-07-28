"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          </motion.div>
          <p className="text-grayText text-sm">Loading...</p>
        </div>
      </motion.div>
    </div>
  );
}

