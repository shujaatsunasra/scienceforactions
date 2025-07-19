"use client";

import React, { useState, MouseEvent } from "react";
import { 
  motion as m, 
  AnimatePresence 
} from "framer-motion";

// Create properly typed motion components
const motion = {
  div: m.div as any,
  span: m.span as any,
  p: m.p as any,
  svg: m.svg as any,
  button: m.button as any
};

// Define props for the ResultCard component
type ResultCardProps = {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  cta: string;
  impact?: number; // 1-5 scale
  relevance?: number; // 1-5 scale
  timeCommitment?: string;
  organizationName?: string;
  link?: string;
  onClick?: () => void;
  isPersonalized?: boolean;
  type?: 'policy' | 'action' | 'organization' | 'event';
  trending?: boolean;
  location?: string;
  deadline?: string;
};

const ResultCard: React.FC<ResultCardProps> = ({ 
  id,
  title, 
  description, 
  tags, 
  cta, 
  impact = 3, 
  relevance = 3,
  timeCommitment,
  organizationName,
  link,
  onClick,
  isPersonalized = false,
  type = 'action',
  trending = false,
  location,
  deadline
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 32, transition: { duration: 0.3 } }
  };

  const expandVariants = {
    collapsed: { height: 0, opacity: 0, marginTop: 0 },
    expanded: { 
      height: "auto", 
      opacity: 1, 
      marginTop: 16,
      transition: { 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.07,
        delayChildren: 0.05
      }
    }
  };

  const childVariants = {
    collapsed: { opacity: 0, y: 10 },
    expanded: { opacity: 1, y: 0 }
  };

  // Generate stars based on impact score
  const renderImpactStars = (score: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`text-sm ${i < score ? 'text-primary' : 'text-grayBorder'}`}>★</span>
    ));
  };

  // Generate impact description
  const getImpactDescription = (score: number): string => {
    switch(score) {
      case 1: return "Low impact - Personal awareness";
      case 2: return "Moderate - Local awareness";
      case 3: return "Significant - Community impact";
      case 4: return "High - Regional influence";
      case 5: return "Very high - Policy changing";
      default: return "Moderate impact";
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5, type: "spring" }}
      layoutId={`card-${title.replace(/\s+/g, '-').toLowerCase()}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ originY: 0 }}
      className="overflow-hidden"
    >
      <motion.div 
        className={`bg-card rounded-card shadow-card border border-grayBorder flex flex-col md:flex-row gap-6 p-6 md:p-8 mb-6 transition-all duration-300 ease-smooth cursor-pointer overflow-hidden relative ${isHovered ? 'border-primary/30' : 'border-grayBorder'}`}
        onClick={() => setIsExpanded(!isExpanded)}
        animate={{ 
          scale: isHovered ? 1.01 : 1,
          y: isHovered ? -2 : 0,
          boxShadow: isHovered ? '0 8px 28px 0 rgba(60,60,60,0.15)' : '0 4px 16px 0 rgba(60,60,60,0.06)'
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Subtle highlight effect when hovering */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        {/* Status indicator for new items */}
        {relevance > 4 && (
          <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary shadow-glow animate-pulse" />
        )}
        {/* Colored block with organization info */}
        <div className="w-full md:w-48 h-auto md:h-auto rounded-xl bg-gradient-to-br from-primary/10 to-primary/25 flex-shrink-0 mb-4 md:mb-0 flex flex-col justify-between p-4 relative overflow-hidden">
          {/* Background pattern for visual interest */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <motion.div 
            initial={{ opacity: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0.8 }}
            className="text-xs font-medium text-primary/80 mb-2 relative"
          >
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-sm bg-primary/30 mr-1.5"></span>
              {organizationName || "Science for Action"}
            </div>
          </motion.div>
          
          <div className="flex flex-col mt-auto relative">
            <div className="mb-2">
              <div className="text-xs text-grayText mb-1 font-medium">Impact Score</div>
              <div 
                className="flex mb-1" 
                title={`Impact score: ${impact}/5 - ${getImpactDescription(impact)}`}
              >
                {renderImpactStars(impact)}
              </div>
            </div>
            
            {timeCommitment && (
              <motion.div 
                className="flex items-center text-xs text-grayText mt-1 bg-white/30 backdrop-blur-sm rounded-lg px-2 py-1.5 w-fit"
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {timeCommitment}
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="relative">
              <motion.div 
                className="text-xl md:text-2xl font-bold text-text mb-2 flex flex-wrap items-center gap-2"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="relative">
                  {title}
                  {/* Animated underline effect on hover */}
                  <motion.span 
                    className="absolute left-0 bottom-0 h-[3px] bg-primary/40 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: isHovered ? '100%' : 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  />
                </span>
                {relevance > 4 && (
                  <motion.span 
                    className="text-xs font-bold text-white bg-primary rounded-pill px-2 py-1 shadow-sm flex items-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ y: -2, scale: 1.05 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="m12 2-5.5 9h11L12 2z"></path>
                      <path d="m6.5 11 5.5 9 5.5-9H6.5z"></path>
                    </svg>
                    RELEVANT
                  </motion.span>
                )}
              </motion.div>
              <motion.div 
                className="text-base text-grayText mb-4 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                {description}
              </motion.div>
            </div>
            
            <motion.div 
              className="flex flex-wrap gap-2 mb-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {tags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (index * 0.05) }}
                  whileHover={{ y: -2, scale: 1.05 }}
                >
                  <span className="rounded-pill bg-graySoft text-grayText px-3 py-1.5 text-xs font-medium border border-grayBorder hover:bg-primary/5 hover:border-primary/30 transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mr-1.5"></span>
                    {tag}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Expand/collapse indicator */}
            <motion.div 
              className={`flex items-center text-xs mt-1 px-3 py-1.5 rounded-full border ${isExpanded ? 'text-primary border-primary/30 bg-primary/5' : 'text-grayText border-grayBorder/50 bg-graySoft/50'} w-fit`}
              animate={{ 
                opacity: isHovered ? 1 : 0.8,
                scale: isHovered ? 1.02 : 1
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span>{isExpanded ? "Less details" : "More details"}</span>
              <motion.span
                className="ml-1.5 inline-flex"
                animate={{ 
                  rotate: isExpanded ? 180 : 0,
                  y: isExpanded ? 0 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </motion.span>
            </motion.div>

            {/* Additional info that shows when expanded */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  className="border-t border-grayBorder pt-4 overflow-hidden mt-3"
                  variants={expandVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  layout
                >
                  <motion.div 
                    variants={childVariants}
                    className="bg-graySoft/30 rounded-xl p-4 border border-grayBorder/50 mb-4"
                  >
                    <h4 className="font-semibold text-text mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary">
                        <path d="M12 19V5"></path>
                        <path d="M5 12h14"></path>
                      </svg>
                      Why this matters:
                    </h4>
                    <p className="text-sm text-grayText mb-1 leading-relaxed">
                      Taking action on this issue can directly impact policy decisions 
                      and support scientific research that leads to meaningful change.
                      {impact >= 4 && " Your participation has the potential to influence significant outcomes."}
                    </p>
                  </motion.div>
                  
                  <motion.div variants={childVariants} className="mb-5">
                    <h4 className="font-semibold text-text mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary">
                        <path d="m6 18 6-6-6-6"></path>
                        <path d="m18 6-6 6 6 6"></path>
                      </svg>
                      Impact level: {getImpactDescription(impact)}
                    </h4>
                    <div className="w-full h-3 bg-graySoft rounded-pill overflow-hidden shadow-inner">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-primary/70 to-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${(impact / 5) * 100}%` }}
                        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                    
                    <div className="flex justify-between mt-1.5 text-xs text-grayText">
                      <span>Low Impact</span>
                      <span>High Impact</span>
                    </div>
                  </motion.div>
                  
                  {link && (
                    <motion.div variants={childVariants} className="mt-3 bg-white/50 border border-primary/20 rounded-xl p-3">
                      <a 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        <span>Learn more about this initiative</span>
                        <motion.span 
                          className="ml-1"
                          initial={{ x: 0 }}
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                        >→</motion.span>
                      </a>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              className="relative group overflow-hidden"
            >
              <motion.span 
                className="absolute inset-0 bg-primary opacity-10 rounded-pill transform origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              <button className="rounded-pill border-2 border-primary text-primary px-6 py-2 font-semibold text-base transition-all duration-300 ease-out shadow-smooth hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 relative z-10">
                <span className="flex items-center">
                  {cta}
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="ml-1.5 h-4 w-4"
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </motion.svg>
                </span>
              </button>
            </motion.div>
            
            {/* Add to favorites or bookmark feature */}
            <div className="relative">
              <motion.button
                className={`p-2 rounded-full ${isSaved ? 'text-primary bg-primary/10' : 'text-grayText hover:text-primary'} focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  setIsSaved(!isSaved);
                  setShowTooltip(true);
                  // Hide tooltip after 2 seconds
                  setTimeout(() => setShowTooltip(false), 2000);
                }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill={isSaved ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </motion.button>
              
              {/* Tooltip */}
              <AnimatePresence>
                {showTooltip && (
                  <motion.div 
                    className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 shadow-lg"
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isSaved ? 'Saved to your collection' : 'Save for later'}
                    <div className="absolute right-1 bottom-0 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultCard;