"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type GeneratedAction } from '@/context/ActionEngagementContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as any;

interface ActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  action: GeneratedAction | null;
  onComplete: (actionId: string, feedback?: Record<string, unknown>) => void;
  onSave: () => void;
  onRate: (rating: number, feedback?: string) => void;
}

const ActionDrawer: React.FC<ActionDrawerProps> = ({
  isOpen,
  onClose,
  action,
  onComplete,
  onSave
  // onRate - commented out as it's not used in this component
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'template' | 'resources'>('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Reset state when action changes
  useEffect(() => {
    if (action) {
      setActiveTab('overview');
      setFormData({});
      setIsSubmitting(false);
    }
  }, [action]);

  if (!action) return null;

  // Handle completing the action
  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onComplete(action.id, formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Drawer variants for mobile/desktop
  const drawerVariants = {
    hidden: { 
      x: '100%',
      opacity: 0
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      x: '100%',
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text mb-3">Action Overview</h3>
              <p className="text-grayText leading-relaxed">{action.description}</p>
            </div>

            {action.nextSteps && action.nextSteps.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-text mb-3">Next Steps</h4>
                <ul className="space-y-2">
                  {action.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-grayText">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {action.organizationName && (
              <div className="bg-graySoft rounded-lg p-4">
                <h4 className="text-md font-semibold text-text mb-2">Organization</h4>
                <p className="text-grayText">{action.organizationName}</p>
              </div>
            )}
          </div>
        );

      case 'template':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text mb-3">
                {action.template?.type === 'letter' ? 'Letter Template' : 'Form Template'}
              </h3>
              {action.template && (
                <div className="bg-graySoft rounded-lg p-4">
                  <textarea
                    className="w-full h-64 p-4 border border-grayBorder rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.templateContent || action.template.content}
                    onChange={(e) => setFormData((prev) => ({ ...prev, templateContent: e.target.value }))}
                    placeholder="Customize your message..."
                  />
                </div>
              )}
            </div>

            {action.template?.type === 'letter' && (
              <div>
                <h4 className="text-md font-semibold text-text mb-3">Your Information</h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    className="w-full p-3 border border-grayBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.name || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full p-3 border border-grayBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.email || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                  <input
                    type="text"
                    placeholder="Your Address"
                    className="w-full p-3 border border-grayBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.address || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text mb-3">Resources & Links</h3>
            </div>

            {action.resourceLinks && action.resourceLinks.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-text mb-3">Helpful Resources</h4>
                <div className="space-y-3">
                  {action.resourceLinks.map((resource, index) => (
                    <div key={index} className="bg-graySoft rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {resource.type === 'emergency' ? '🚨' : 
                           resource.type === 'support' ? '🤝' : 
                           resource.type === 'application' ? '📝' : '📖'}
                        </span>
                        <div>
                          <h5 className="font-semibold text-text">{resource.title}</h5>
                          <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                          >
                            Visit Resource →
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {action.socialShareData && (
              <div>
                <h4 className="text-md font-semibold text-text mb-3">Share This Action</h4>
                <div className="bg-graySoft rounded-lg p-4">
                  <p className="text-grayText mb-3">{action.socialShareData.message}</p>
                  <div className="flex gap-2 mb-3">
                    {action.socialShareData.hashtags.map(hashtag => (
                      <span key={hashtag} className="text-primary text-sm">
                        {hashtag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                      Share on Twitter
                    </button>
                    <button className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition-colors">
                      Share on Facebook
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <MotionDiv
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <MotionDiv
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-1/2 xl:w-2/5 bg-white z-50 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-white border-b border-grayBorder p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text">{action.title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-graySoft rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-graySoft rounded-lg p-1">
                {(['overview', 'template', 'resources'] as const).map(tab => (
                  <button
                    key={tab}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-white text-text shadow-sm'
                        : 'text-grayText hover:text-text'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {renderTabContent()}
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-grayBorder p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={onSave}
                    className="px-4 py-2 border border-grayBorder text-grayText rounded-lg hover:bg-graySoft transition-colors"
                  >
                    Save for Later
                  </button>
                </div>

                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    'Complete Action'
                  )}
                </button>
              </div>
            </div>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};

export default ActionDrawer;

