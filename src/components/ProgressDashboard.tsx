"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActionEngagement } from '@/context/ActionEngagementContext';
import { useProfile } from '@/context/ProfileContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionButton = motion.button as any;

const ProgressDashboard: React.FC = () => {
  const { engagementData, generatedActions } = useActionEngagement();
  const { profile } = useProfile();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'impact'>('overview');

  // Calculate engagement metrics
  const completionRate = engagementData.totalActionsViewed > 0 
    ? Math.round((engagementData.actionsCompleted / engagementData.totalActionsViewed) * 100)
    : 0;

  const averageEngagementTime = engagementData.totalActionsViewed > 0
    ? Math.round(engagementData.totalTimeSpent / engagementData.totalActionsViewed)
    : 0;

  const recentActions = generatedActions
    .filter(action => action.completedAt || action.savedAt)
    .sort((a, b) => {
      const dateA = new Date(a.completedAt || a.savedAt || 0).getTime();
      const dateB = new Date(b.completedAt || b.savedAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  const getImpactLevel = (score: number) => {
    if (score >= 80) return { level: 'High Impact Activist', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 60) return { level: 'Active Participant', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 40) return { level: 'Engaged Citizen', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (score >= 20) return { level: 'Getting Started', color: 'text-purple-600', bgColor: 'bg-purple-100' };
    return { level: 'New Activist', color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };

  const impactScore = Math.min(
    engagementData.actionsCompleted * 10 + 
    engagementData.actionsSaved * 5 + 
    Math.floor(engagementData.totalTimeSpent / 60) * 2, 
    100
  );

  const impact = getImpactLevel(impactScore);

  const tabContent = {
    overview: (
      <div className="space-y-6">
        {/* Impact Score Card */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-text">Your Impact Level</h3>
              <p className="text-grayText">Based on your civic engagement</p>
            </div>
            <div className={`px-3 py-1 rounded-full ${impact.bgColor} ${impact.color} font-medium text-sm`}>
              {impact.level}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{impactScore}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <MotionDiv
                  className="bg-gradient-to-r from-primary to-primaryDark h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${impactScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg p-4 border border-grayBorder">
            <div className="text-2xl font-bold text-primary">{engagementData.actionsCompleted}</div>
            <div className="text-sm text-grayText">Actions Completed</div>
          </div>
          
          <div className="bg-card rounded-lg p-4 border border-grayBorder">
            <div className="text-2xl font-bold text-primary">{engagementData.actionsSaved}</div>
            <div className="text-sm text-grayText">Actions Saved</div>
          </div>
          
          <div className="bg-card rounded-lg p-4 border border-grayBorder">
            <div className="text-2xl font-bold text-primary">{Math.floor(engagementData.totalTimeSpent / 60)}</div>
            <div className="text-sm text-grayText">Minutes Engaged</div>
          </div>
          
          <div className="bg-card rounded-lg p-4 border border-grayBorder">
            <div className="text-2xl font-bold text-primary">{engagementData.streakDays}</div>
            <div className="text-sm text-grayText">Day Streak</div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-card rounded-lg p-6 border border-grayBorder">
          <h4 className="text-md font-semibold text-text mb-4">Action Completion Rate</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span>Completion Rate</span>
                <span>{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <MotionDiv
                  className="bg-green-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-text">{engagementData.actionsCompleted}/{engagementData.totalActionsViewed}</div>
              <div className="text-xs text-grayText">completed/viewed</div>
            </div>
          </div>
        </div>

        {/* Preferred Topics */}
        {engagementData.preferredTopics.length > 0 && (
          <div className="bg-card rounded-lg p-6 border border-grayBorder">
            <h4 className="text-md font-semibold text-text mb-4">Your Key Focus Areas</h4>
            <div className="flex flex-wrap gap-2">
              {engagementData.preferredTopics.slice(0, 6).map(topic => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    ),

    history: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text">Recent Activity</h3>
        {recentActions.length > 0 ? (
          <div className="space-y-3">
            {recentActions.map(action => (
              <MotionDiv
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg p-4 border border-grayBorder hover:border-primary/20 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-text mb-1">{action.title}</h4>
                    <p className="text-sm text-grayText line-clamp-2">{action.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        action.completedAt ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {action.completedAt ? 'Completed' : 'Saved'}
                      </span>
                      <span className="text-xs text-grayText">
                        {new Date(action.completedAt || action.savedAt || '').toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-4">
                    {Array(action.impact).fill(0).map((_, i) => (
                      <span key={i} className="text-primary text-sm">★</span>
                    ))}
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-grayText">No actions yet. Start engaging to see your history!</p>
          </div>
        )}
      </div>
    ),

    impact: (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-text mb-2">Your Civic Impact</h3>
          <p className="text-grayText">See how your actions contribute to positive change</p>
        </div>

        {/* Impact Visualization */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{engagementData.actionsCompleted}</div>
              <div className="text-sm text-grayText">Actions Completed</div>
              <div className="text-xs text-green-600 mt-1">Direct Impact</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{engagementData.actionsSaved}</div>
              <div className="text-sm text-grayText">Actions Saved</div>
              <div className="text-xs text-blue-600 mt-1">Future Potential</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{Math.floor(engagementData.totalTimeSpent / 3600)}</div>
              <div className="text-sm text-grayText">Hours Invested</div>
              <div className="text-xs text-purple-600 mt-1">Time Commitment</div>
            </div>
          </div>
        </div>

        {/* Engagement Pattern */}
        <div className="bg-card rounded-lg p-6 border border-grayBorder">
          <h4 className="text-md font-semibold text-text mb-4">Your Engagement Pattern</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-grayText">Most Active Times</span>
              <span className="text-text font-medium">
                {engagementData.engagementPattern.mostActiveHours.length > 0 
                  ? `${engagementData.engagementPattern.mostActiveHours[0]}:00 - ${engagementData.engagementPattern.mostActiveHours[0] + 1}:00`
                  : 'Building pattern...'
                }
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-grayText">Average Session</span>
              <span className="text-text font-medium">
                {averageEngagementTime > 0 ? `${averageEngagementTime}s` : 'Calculating...'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-grayText">Preferred Action Types</span>
              <span className="text-text font-medium">
                {engagementData.preferredIntents.length > 0 
                  ? engagementData.preferredIntents[0] 
                  : 'Discovering...'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps Recommendations */}
        <div className="bg-card rounded-lg p-6 border border-grayBorder">
          <h4 className="text-md font-semibold text-text mb-4">Recommended Next Steps</h4>
          <div className="space-y-2">
            {impactScore < 25 && (
              <p className="text-sm text-grayText">• Complete your first action to build momentum</p>
            )}
            {impactScore >= 25 && impactScore < 50 && (
              <p className="text-sm text-grayText">• Try engaging with different topics to broaden your impact</p>
            )}
            {impactScore >= 50 && impactScore < 75 && (
              <p className="text-sm text-grayText">• Consider sharing actions with friends to amplify your influence</p>
            )}
            {impactScore >= 75 && (
              <p className="text-sm text-grayText">• You&apos;re making significant impact! Consider becoming a community organizer</p>
            )}
            <p className="text-sm text-grayText">• Save actions for later to build your personal action plan</p>
            <p className="text-sm text-grayText">• Engage consistently to maintain your streak</p>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-text mb-2">Your Progress Dashboard</h1>
        <p className="text-grayText">Track your civic engagement and impact over time</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-graySoft rounded-lg p-1 mb-8">
        {(['overview', 'history', 'impact'] as const).map(tab => (
          <MotionButton
            key={tab}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white text-text shadow-sm'
                : 'text-grayText hover:text-text'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </MotionButton>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <MotionDiv
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tabContent[activeTab]}
        </MotionDiv>
      </AnimatePresence>
    </div>
  );
};

export default ProgressDashboard;
