"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useProfile } from "@/context/ProfileContext";
import { useDebounce } from "@/hooks/useDebounce";
import ResultCard from "./ResultCard";
import Fuse from "fuse.js";

const INTENTS = [
  "be heard", "get", "buy", "donate", "fund", "invest", "get educated",
  "get funded", "purchase", "get help", "organize", "raise money", "volunteer", "give the middle finger"
];

const TOPICS = [
  "data ethics", "workers", "climate policy", "foodchain workers", "clean energy",
  "energy storage", "get educated", "public health", "insurance", "healthy food",
  "poverty", "climate", "AI ethics", "COVID", "electric vehicles", "maternal health",
  "supplements", "newborns", "trans rights", "data privacy", "agriculture"
];

// Enhanced result type with more fields
type ActionResult = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  cta: string;
  impact: number; // 1-5 scale
  relevance: number; // 1-5 scale
  timeCommitment?: string;
  organizationName?: string;
  link?: string;
  location?: string;
  deadline?: string;
  type: 'policy' | 'action' | 'organization' | 'event';
  trending: boolean;
  personalizedScore?: number;
};

// More comprehensive results with IDs
const DUMMY_RESULTS: ActionResult[] = [
  {
    id: "clean-heat-tax-credit",
    title: "Clean Industrial Heat Tax Credit",
    description: "We need smart policies that will drive investments into industrial innovation to clean up the industrial sector. One way to do this is by providing a clean heat production tax credit to incentivize manufacturers to switch to clean energy sources.",
    tags: ["climate", "industrial", "policy", "US"],
    cta: "be heard",
    impact: 3,
    relevance: 5,
    timeCommitment: "5 minutes",
    organizationName: "Climate Science Alliance",
    link: "https://example.org/clean-heat",
    type: "policy",
    trending: true,
  },
  {
    id: "ny-climate-superfund",
    title: "NY Climate Change Superfund Act",
    description: "New York's Climate Change Superfund Act (S.2129-B/A.3351-B) establishes a cost recovery program to require companies that have emitted significant greenhouse gases to bear a share of the costs of infrastructure adaptation.",
    tags: ["ny", "state-gov", "policy", "new-york"],
    cta: "be heard",
    impact: 5,
    relevance: 4,
    timeCommitment: "10 minutes",
    organizationName: "NY Climate Action",
    link: "https://example.org/ny-climate",
    location: "New York",
    type: "policy",
    trending: true,
  },
  {
    id: "heat-action-platform",
    title: "Heat Action Platform",
    description: "A platform to coordinate local government, health, and community organizations to protect vulnerable populations from extreme heat events. Join community scientists in collecting heat data in your neighborhood.",
    tags: ["public-health", "community-science", "local"],
    cta: "volunteer",
    impact: 4,
    relevance: 3,
    timeCommitment: "2-4 hours",
    organizationName: "Science for People",
    link: "https://example.org/heat-action",
    location: "Local",
    type: "action",
    trending: false,
  },
  {
    id: "ai-ethics-research",
    title: "Data Ethics for AI Research Group",
    description: "Join our research group focused on establishing ethical guidelines for data collection and usage in artificial intelligence systems. We need people who care about how AI technologies impact marginalized communities.",
    tags: ["data-ethics", "AI", "research"],
    cta: "get involved",
    impact: 4, 
    relevance: 5,
    timeCommitment: "Ongoing",
    organizationName: "AI Ethics Collective",
    link: "https://example.org/ai-ethics",
    type: "organization",
    trending: true,
  },
];

const EnhancedActionTool: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { profile, trackPolicyEngagement, updateContributionStats, updateProfile } = useProfile();

  // State management
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [input, setInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedResults, setStreamedResults] = useState<ActionResult[]>([]);

  // Debounced search for real-time updates
  const debouncedInput = useDebounce(input, 300);

  // Setup fuzzy search
  const intentFuse = useMemo(() => new Fuse(INTENTS, { threshold: 0.3 }), []);
  const topicFuse = useMemo(() => new Fuse(TOPICS, { threshold: 0.3 }), []);

  // Deep linking: Update URL params
  const updateURL = useCallback((newIntent?: string, newTopic?: string, newLocation?: string) => {
    const params = new URLSearchParams();
    if (newIntent || intent) params.set('intent', newIntent || intent);
    if (newTopic || topic) params.set('topic', newTopic || topic);
    if (newLocation || location) params.set('location', newLocation || location);
    
    const newPath = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newPath, { scroll: false });
  }, [router, pathname, intent, topic, location]);

  // Initialize from URL params
  useEffect(() => {
    const intentParam = searchParams.get('intent');
    const topicParam = searchParams.get('topic');
    const locationParam = searchParams.get('location');

    if (intentParam && !intent) {
      setIntent(intentParam);
      setStep(1);
    }
    if (topicParam && !topic) {
      setTopic(topicParam);
      setStep(2);
    }
    if (locationParam && !location) {
      setLocation(locationParam);
      if (intentParam && topicParam) {
        setShowResults(true);
      }
    }
  }, [searchParams, intent, topic, location]);

  // Get filtered suggestions based on current input and step
  const getSuggestions = useCallback(() => {
    if (!debouncedInput) {
      return step === 0 ? INTENTS.slice(0, 8) : TOPICS.slice(0, 8);
    }

    if (step === 0) {
      return intentFuse.search(debouncedInput).map(result => result.item).slice(0, 8);
    } else if (step === 1) {
      return topicFuse.search(debouncedInput).map(result => result.item).slice(0, 8);
    }
    return [];
  }, [step, debouncedInput, intentFuse, topicFuse]);

  // Calculate personalized results
  const personalizedResults = useMemo(() => {
    if (!profile) return DUMMY_RESULTS;

    return DUMMY_RESULTS.map(result => {
      let personalizedScore = result.relevance;
      
      // Boost based on user interests
      const interestMatch = profile.interests.some(interest => 
        result.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase())) ||
        result.title.toLowerCase().includes(interest.toLowerCase())
      );
      if (interestMatch) personalizedScore += 2;

      // Boost based on previous engagement
      const hasEngaged = profile.policy_engagement_history.some(
        engagement => engagement.policy_id === result.id
      );
      if (hasEngaged) personalizedScore += 1;

      // Boost based on location
      if (result.location && location && 
          result.location.toLowerCase().includes(location.toLowerCase())) {
        personalizedScore += 1;
      }

      return { ...result, personalizedScore };
    }).sort((a, b) => (b.personalizedScore || b.relevance) - (a.personalizedScore || a.relevance));
  }, [profile, location]);

  // Filter results based on search criteria
  const filteredResults = useMemo(() => {
    let results = personalizedResults;

    // Apply intent filter
    if (intent) {
      results = results.filter(result => 
        result.cta.toLowerCase().includes(intent.toLowerCase()) ||
        result.tags.some(tag => tag.toLowerCase().includes(intent.toLowerCase()))
      );
    }

    // Apply topic filter
    if (topic) {
      results = results.filter(result =>
        result.title.toLowerCase().includes(topic.toLowerCase()) ||
        result.description.toLowerCase().includes(topic.toLowerCase()) ||
        result.tags.some(tag => tag.toLowerCase().includes(topic.toLowerCase()))
      );
    }

    // Apply location filter
    if (location) {
      results = results.filter(result =>
        !result.location || 
        result.location.toLowerCase().includes(location.toLowerCase()) ||
        result.location.toLowerCase() === 'local' ||
        result.location.toLowerCase() === 'remote'
      );
    }

    return results;
  }, [personalizedResults, intent, topic, location]);

  // Simulate streaming results
  const streamResults = useCallback(async () => {
    setIsStreaming(true);
    setStreamedResults([]);
    
    const results = filteredResults;
    
    for (let i = 0; i < results.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setStreamedResults(prev => [...prev, results[i]]);
    }
    
    setIsStreaming(false);
  }, [filteredResults]);

  // Handle selection for each step
  const handleSelect = useCallback((value: string) => {
    if (step === 0) {
      setIntent(value);
      setInput("");
      setStep(1);
      updateURL(value, topic, location);
      
      // Update user profile with intent action
      if (profile) {
        const updatedIntentActions = [...new Set([...profile.intent_actions, value])];
        updateProfile({ intent_actions: updatedIntentActions });
      }
    } else if (step === 1) {
      setTopic(value);
      setInput("");
      setStep(2);
      updateURL(intent, value, location);
      
      // Update user profile with preferred topic
      if (profile) {
        const updatedTopics = [...new Set([...profile.preferred_topics, value])];
        updateProfile({ preferred_topics: updatedTopics });
      }
    }
  }, [step, intent, topic, location, profile, updateProfile, updateURL]);

  // Handle location submission
  const handleLocationSubmit = useCallback(() => {
    if (location.trim()) {
      setShowResults(true);
      streamResults();
      updateURL(intent, topic, location);
      
      // Update user profile with location
      if (profile && location !== profile.location) {
        updateProfile({ location });
      }
    }
  }, [location, intent, topic, profile, updateProfile, streamResults, updateURL]);

  // Reset all states
  const handleReset = useCallback(() => {
    setStep(0);
    setIntent("");
    setTopic("");
    setLocation("");
    setInput("");
    setShowResults(false);
    setStreamedResults([]);
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  // Track result interactions
  const handleResultInteraction = useCallback((result: ActionResult, action: 'view' | 'click') => {
    if (result.type === 'policy') {
      trackPolicyEngagement(result.id, action === 'click' ? 'acted' : 'viewed');
    }
    
    if (action === 'click') {
      updateContributionStats('actions_completed');
    }
  }, [trackPolicyEngagement, updateContributionStats]);

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -24 }
  };

  // Step content rendering
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            key="intent"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
            transition={{ duration: 0.4 }}
          >
            <div className="text-2xl md:text-3xl font-bold text-text mb-8 text-left">
              Tell us what you want to
            </div>
            <div className="bg-card rounded-card shadow-card border border-grayBorder p-6 md:p-8">
              <div className="relative mb-4">
                <input
                  className="w-full rounded-xl border border-grayBorder px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary transition placeholder:text-grayText bg-graySoft"
                  placeholder="Choose an option or type"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const suggestions = getSuggestions();
                      if (suggestions.length > 0) {
                        handleSelect(suggestions[0]);
                      }
                    }
                  }}
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-grayText">🔍</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {getSuggestions().map((suggestion, index) => (
                  <motion.div
                    key={suggestion}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      className="rounded-pill px-4 py-2 bg-graySoft hover:bg-primary hover:text-white transition text-base font-medium shadow-sm border border-grayBorder"
                      onClick={() => handleSelect(suggestion)}
                      type="button"
                    >
                      {suggestion}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="topic"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
            transition={{ duration: 0.4 }}
          >
            <div className="text-2xl md:text-3xl font-bold text-text mb-8 text-left">
              I want to <span className="text-primary">{intent}</span> about
            </div>
            <div className="bg-card rounded-card shadow-card border border-grayBorder p-6 md:p-8">
              <div className="relative mb-4">
                <input
                  className="w-full rounded-xl border border-grayBorder px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary transition placeholder:text-grayText bg-graySoft"
                  placeholder="Choose the topic or type"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const suggestions = getSuggestions();
                      if (suggestions.length > 0) {
                        handleSelect(suggestions[0]);
                      }
                    }
                  }}
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-grayText">🔍</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {getSuggestions().map((suggestion, index) => (
                  <motion.div
                    key={suggestion}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      className="rounded-pill px-4 py-2 bg-graySoft hover:bg-primary hover:text-white transition text-base font-medium shadow-sm border border-grayBorder"
                      onClick={() => handleSelect(suggestion)}
                      type="button"
                    >
                      {suggestion}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="location"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
            transition={{ duration: 0.4 }}
          >
            <div className="text-2xl md:text-3xl font-bold text-text mb-8 text-left">
              I want to <span className="text-primary">{intent}</span> about{" "}
              <span className="text-primary">{topic}</span> in
            </div>
            <div className="bg-card rounded-card shadow-card border border-grayBorder p-6 md:p-8">
              <div className="flex flex-col gap-6 min-h-[180px]">
                <div>
                  <div className="relative mb-6">
                    <input
                      className="w-full rounded-xl border border-grayBorder px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary transition placeholder:text-grayText bg-graySoft"
                      placeholder="Type zip code, city, state, or 'remote'"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && location.trim()) {
                          handleLocationSubmit();
                        }
                      }}
                      autoFocus
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-grayText">📍</span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm text-grayText mb-2">Why location matters:</p>
                  <ul className="text-sm text-grayText list-disc pl-4 space-y-1">
                    <li>Find local initiatives and resources</li>
                    <li>Connect with community organizations</li>
                    <li>Get region-specific action opportunities</li>
                    <li>Access state and local policy actions</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 items-end min-h-[60vh] justify-center">
      <AnimatePresence mode="wait">
        {!showResults ? renderStep() : null}
      </AnimatePresence>
      
      {!showResults && (
        <div className="flex gap-4 mt-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              className="text-grayText text-base font-medium hover:underline px-2 py-2 rounded-pill transition-all"
              onClick={handleReset}
              type="button"
            >
              reset
            </button>
          </motion.div>
          
          {step === 2 && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                className="rounded-pill px-8 py-2 bg-primary text-white font-semibold text-base shadow-smooth transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:bg-primary/90"
                onClick={handleLocationSubmit}
                type="button"
                disabled={!location.trim()}
              >
                Show results
              </button>
            </motion.div>
          )}
          
          {step < 2 && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                className="rounded-pill px-8 py-2 bg-graySoft text-grayText font-semibold text-base shadow-smooth transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:bg-primary hover:text-white"
                onClick={() => {
                  const suggestions = getSuggestions();
                  if (suggestions.length > 0) {
                    handleSelect(suggestions[0]);
                  }
                }}
                type="button"
                disabled={getSuggestions().length === 0}
              >
                Continue
              </button>
            </motion.div>
          )}
        </div>
      )}

      {showResults && (
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <motion.div whileHover={{ x: -3 }} transition={{ type: "spring", stiffness: 400 }}>
                <button
                  className="text-grayText text-base font-medium hover:underline px-2 py-2 rounded-pill transition-all"
                  onClick={() => setShowResults(false)}
                  type="button"
                >
                  ← Back to search
                </button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
                <button
                  className="text-grayText text-base font-medium hover:underline px-2 py-2 rounded-pill transition-all"
                  onClick={handleReset}
                  type="button"
                >
                  reset
                </button>
              </motion.div>
            </div>

            {/* Results Summary */}
            <div className="mb-6 p-4 bg-graySoft rounded-xl">
              <p className="text-sm text-grayText">
                Found <span className="font-semibold text-text">{filteredResults.length}</span> actions for{" "}
                <span className="font-semibold text-primary">{intent}</span> about{" "}
                <span className="font-semibold text-primary">{topic}</span> in{" "}
                <span className="font-semibold text-primary">{location}</span>
              </p>
              {isStreaming && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-xs text-grayText">Loading more results...</span>
                </div>
              )}
            </div>

            {/* Streaming Results */}
            <div>
              <AnimatePresence>
                {streamedResults.map((result, idx) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    layout
                    onViewportEnter={() => handleResultInteraction(result, 'view')}
                  >
                    <ResultCard 
                      {...result} 
                      onClick={() => handleResultInteraction(result, 'click')}
                      isPersonalized={!!result.personalizedScore}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* No results state */}
            {!isStreaming && streamedResults.length === 0 && (
              <div className="text-center py-12">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-grayText mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467.901-6.062 2.379L3 14c1.167-3.5 4.347-6 8-6s6.833 2.5 8 6l-2.938 3.379z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-2">No results found</h3>
                  <p className="text-grayText mb-4">Try adjusting your search terms or exploring different topics.</p>
                  <button
                    onClick={() => setShowResults(false)}
                    className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                  >
                    Refine search
                  </button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EnhancedActionTool;
