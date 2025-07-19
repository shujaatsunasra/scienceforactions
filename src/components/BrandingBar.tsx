"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";

const navItems = [
  { label: "explore", icon: "🔍" },
  { label: "action tool", icon: "⚡", active: true },
  { label: "profile", icon: "👤" },
];

const BrandingBar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Animation variants
  const sidebarVariants = {
    hidden: { x: -40, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 20 }
    }
  };

  const logoVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 400, damping: 20, delay: 0.1 } 
    }
  };

  return (
    <div className="fixed md:sticky top-0 left-0 h-screen w-[280px] min-w-[220px] max-w-[320px] bg-[#FA3C3C] flex flex-col justify-between p-8 z-30 shadow-[4px_0_32px_0_rgba(250,60,60,0.12)]">
      <div>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            transition: { type: "spring", stiffness: 400, damping: 20, delay: 0.1 }
          }}
        >
          <h1 className="text-2xl font-extrabold tracking-tight mb-12 text-white select-none">
            science <span className="font-light">for</span> action
          </h1>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ 
            y: 0, 
            opacity: 1,
            transition: { type: "spring", stiffness: 400, damping: 20 }
          }}
        >
          <h2 className="mt-16 text-3xl font-bold leading-tight text-white select-none">
            Science for<br />people who<br />give a shit
          </h2>
        </motion.div>
      </div>
      
      <nav className="flex flex-col gap-4 mt-12">
        <AnimatePresence>
          {navItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                transition: { 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 20,
                  delay: index * 0.1
                }
              }}
            >
              <button
                className={`rounded-pill px-6 py-3 text-lg font-bold w-full transition-all duration-300 focus:outline-none shadow-smooth border-2 flex items-center ${item.active ? 'bg-white text-[#FA3C3C] border-white' : 'border-white/40 text-white hover:bg-white/10'}`}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span className="mr-2">
                  {item.icon}
                </span>
                {item.label}
                <AnimatePresence>
                  {hoveredItem === item.label && item.active && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                    >
                      <span className="ml-2 text-sm opacity-70">(active)</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default BrandingBar; 