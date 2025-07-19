"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type GeneratedAction } from '@/context/ActionEngagementContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionButton = motion.button as any;

interface AdaptiveActionCardProps {
  action: GeneratedAction;
  index: number;
  displayMode: 'grid' | 'stack';
  onSelect: () => void;
  onSave: () => void;
  onRate: (rating: number, feedback?: string) => void;
}

const AdaptiveActionCard: React.FC<AdaptiveActionCardProps> = ({
  action,
  index,
  displayMode,
  onSelect,
  onSave,
  onRate
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(!!action.savedAt);
  const [showRating, setShowRating] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Update saved state when action changes
  useEffect(() => {
    setIsSaved(!!action.savedAt);
  }, [action.savedAt]);

  // Animation variants based on display mode
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: displayMode === 'stack' ? 20 : 32,
      scale: displayMode === 'grid' ? 0.95 : 1
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    hover: {
      y: -4,
      scale: displayMode === 'grid' ? 1.02 : 1.01,
      transition: { duration: 0.2 }
    }
  };

  // Generate impact stars
  const renderImpactStars = (score: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`text-sm ${i < score ? 'text-primary' : 'text-grayBorder'}`}>
        ★
      </span>
    ));
  };

  // Generate urgency indicator
  const getUrgencyColor = (urgency: number) => {
    if (urgency >= 4) return 'bg-red-500';
    if (urgency >= 3) return 'bg-orange-500';
    if (urgency >= 2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Handle save action
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave();
    setIsSaved(true);
  };

  // Handle rating submission
  const handleRatingSubmit = (rating: number) => {
    setUserRating(rating);
    onRate(rating);
    setShowRating(false);
  };

  return (
    <MotionDiv
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`
        relative group cursor-pointer
        ${displayMode === 'grid' 
          ? 'bg-card rounded-card shadow-card border border-grayBorder p-6' 
          : 'bg-card rounded-card shadow-card border border-grayBorder p-6 mb-4'
        }
        transition-all duration-200
        hover:shadow-lg hover:border-primary/20
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* Urgency indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div 
          className={`w-2 h-2 rounded-full ${getUrgencyColor(action.urgency)}`}
          title={`Urgency: ${action.urgency}/5`}
        />
        {action.engagementScore && (
          <div className="text-xs text-grayText font-medium bg-graySoft px-2 py-1 rounded-pill">
            {Math.round(action.engagementScore)}% match
          </div>
        )}
      </div>

      {/* Action type badge */}
      <div className="mb-3">
        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-pill">
          {action.ctaType.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* Title and description */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-text mb-2 line-clamp-2">
          {action.title}
        </h3>
        <p className="text-grayText text-sm line-clamp-3 leading-relaxed">
          {action.description}
        </p>
      </div>

      {/* Meta information */}
      <div className="mb-4 space-y-2">
        {action.timeCommitment && (
          <div className="flex items-center gap-2 text-xs text-grayText">
            <span>⏱️</span>
            <span>{action.timeCommitment}</span>
          </div>
        )}
        
        {action.organizationName && (
          <div className="flex items-center gap-2 text-xs text-grayText">
            <span>🏢</span>
            <span>{action.organizationName}</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-xs text-grayText">Impact:</span>
            {renderImpactStars(action.impact)}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {action.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="inline-block px-2 py-1 bg-graySoft text-grayText text-xs rounded-pill"
            >
              {tag}
            </span>
          ))}
          {action.tags.length > 3 && (
            <span className="inline-block px-2 py-1 bg-graySoft text-grayText text-xs rounded-pill">
              +{action.tags.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* CTA Button */}
          <MotionButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primaryDark transition-all"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {action.cta}
          </MotionButton>

          {/* Secondary actions */}
          <MotionButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full transition-all ${
              isSaved 
                ? 'text-primary bg-primary/10' 
                : 'text-grayText hover:text-primary hover:bg-primary/10'
            }`}
            onClick={handleSave}
            title={isSaved ? 'Saved' : 'Save action'}
          >
            {isSaved ? '❤️' : '🤍'}
          </MotionButton>
        </div>

        {/* Rating button */}
        <div className="relative">
          <MotionButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-grayText hover:text-primary transition-all rounded-full hover:bg-primary/10"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setShowRating(!showRating);
            }}
            title="Rate this action"
          >
            ⭐
          </MotionButton>

          {/* Rating dropdown */}
          {showRating && (
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute right-0 bottom-full mb-2 bg-white rounded-lg shadow-lg border border-grayBorder p-3 min-w-[120px] z-10"
            >
              <p className="text-xs text-grayText mb-2">Rate this action:</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(rating => (
                  <MotionButton
                    key={rating}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`text-lg ${
                      rating <= userRating ? 'text-primary' : 'text-grayBorder'
                    } hover:text-primary transition-colors`}
                    onClick={() => handleRatingSubmit(rating)}
                  >
                    ⭐
                  </MotionButton>
                ))}
              </div>
            </MotionDiv>
          )}
        </div>
      </div>

      {/* Hover effect overlay */}
      <MotionDiv
        className="absolute inset-0 bg-primary/5 rounded-card pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Completion indicator */}
      {action.completedAt && (
        <div className="absolute top-4 left-4">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>
      )}
    </MotionDiv>
  );
};

export default AdaptiveActionCard;
