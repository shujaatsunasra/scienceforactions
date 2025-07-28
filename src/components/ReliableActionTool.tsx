"use client";

import React, { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '@/context/ProfileContext';

interface ActionToolProps {
  title?: string;
  description?: string;
  tags?: string[];
  className?: string;
}

export default function ReliableActionTool({ 
  title = "Take Action Tool", 
  description = "Choose an action and make your voice heard", 
  tags = [], 
  className = '' 
}: ActionToolProps) {
  const [selectedAction, setSelectedAction] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, startTransition] = useTransition();
  const [isMobileView, setIsMobileView] = useState(false);
  
  const { profile } = useProfile();

  // Check mobile view on component mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Predefined action types with immediate templates
  const actionTypes = [
    {
      id: 'contact_rep',
      label: 'Contact Representative',
      icon: '📧',
      template: `Dear Representative,

I am writing as your constituent from ${profile?.location || 'our community'} to express my support for environmental and climate action policies.

As a member of this community, I believe it's crucial that we prioritize:
- Clean energy initiatives
- Environmental protection measures  
- Sustainable development policies

Your leadership on these issues would make a significant difference for our community and future generations.

Thank you for your consideration.

Sincerely,
[Your Name]`
    },
    {
      id: 'social_share',
      label: 'Create Social Post',
      icon: '📱',
      template: `🌍 Taking action for our planet! 

${profile?.interests?.includes('climate') ? 'Climate action' : 'Environmental protection'} starts with each of us. Join me in making a difference in ${profile?.location || 'our community'}.

Every action counts. Every voice matters. 

#ClimateAction #Environment #Community #MakeADifference`
    },
    {
      id: 'petition',
      label: 'Sign Petition',
      icon: '✍️',
      template: `I strongly support this initiative because I believe in creating positive change for our community and environment.

As a resident of ${profile?.location || 'this area'}, I see the importance of taking action on issues that affect our daily lives and future.

Together, we can make a difference.`
    },
    {
      id: 'volunteer',
      label: 'Volunteer Inquiry',
      icon: '🤝',
      template: `Hello,

I'm interested in volunteering with your organization to support environmental and community causes in ${profile?.location || 'our area'}.

I'm particularly interested in:
${profile?.interests?.slice(0, 3).map(interest => `- ${interest}`).join('\n') || '- Environmental protection\n- Community engagement\n- Sustainability initiatives'}

Please let me know how I can get involved.

Thank you!`
    },
    {
      id: 'local_event',
      label: 'Event Inquiry',
      icon: '📅',
      template: `Hi there,

I'm looking for environmental events and activities in ${profile?.location || 'my area'}. 

I'm passionate about making a positive impact and would love to connect with like-minded people in our community.

Please keep me informed about upcoming events, meetings, or volunteer opportunities.

Best regards,`
    },
    {
      id: 'donation',
      label: 'Support Cause',
      icon: '💝',
      template: `I'm committed to supporting organizations that are working to address environmental challenges and create sustainable solutions.

Your work in ${profile?.location || 'our community'} is making a real difference, and I want to be part of that positive change.

Thank you for all that you do.`
    }
  ];

  const handleActionSelect = (actionId: string) => {
    setSelectedAction(actionId);
    const action = actionTypes.find(a => a.id === actionId);
    
    startTransition(() => {
      if (action) {
        setGeneratedText(action.template);
      }
    });
  };

  const selectedActionData = actionTypes.find(a => a.id === selectedAction);

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          {description && (
            <p className="text-gray-600 leading-relaxed">{description}</p>
          )}
          
          {profile && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                👋 Hello {profile.name}! Your location: {profile.location || 'Not set'}
              </p>
            </div>
          )}
        </div>

        {/* Action Selection Grid */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Choose Your Action Type
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {actionTypes.map((action) => (
              <button
                key={action.id}
                onClick={() => handleActionSelect(action.id)}
                disabled={isGenerating}
                className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 ${
                  selectedAction === action.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="text-sm font-medium text-gray-900">{action.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generated Content */}
        {selectedAction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">
                  Your {selectedActionData?.label} Message
                </h4>
                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Ready to use
                </div>
              </div>
              
              <textarea
                value={generatedText}
                onChange={(e) => setGeneratedText(e.target.value)}
                className="w-full h-40 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your message will appear here..."
              />
            </div>
          </motion.div>
        )}

        {/* Tips */}
        {selectedAction && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">💡 Quick Tips</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Personalize the message with your own thoughts</li>
              <li>• Be specific about local issues that matter to you</li>
              <li>• Include your name and location when appropriate</li>
              <li>• Keep your message clear and respectful</li>
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        {selectedAction && generatedText && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(generatedText);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                📋 Copy Text
              </button>
              
              <button
                onClick={() => {
                  // Production: debug output removed
                  alert('Great job taking action! Your voice matters.');
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                ✅ I'm Ready!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

