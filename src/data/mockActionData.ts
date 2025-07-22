// Mock data service to provide realistic actions until backend is fully integrated
import type { GeneratedAction } from '@/context/ActionEngagementContext';

export interface ActionTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  organizationName: string;
  location: string;
  impact: 1 | 2 | 3 | 4 | 5;
  urgency: 1 | 2 | 3 | 4 | 5;
  timeCommitment: string;
  ctaType: 'contact_rep' | 'volunteer' | 'donate' | 'petition' | 'learn_more' | 'organize' | 'get_help';
  link: string;
  nextSteps: string[];
  resourceLinks?: Array<{
    title: string;
    url: string;
    type: 'emergency' | 'informational' | 'application' | 'support';
  }>;
}

const MOCK_ACTIONS: ActionTemplate[] = [
  // Climate Change Actions
  {
    id: 'climate-001',
    title: 'Contact Your Representative About Clean Energy',
    description: 'Urge your local representative to support renewable energy infrastructure investments in your district.',
    category: 'climate_change',
    tags: ['climate change', 'renewable energy', 'policy', 'advocacy'],
    organizationName: 'Climate Action Network',
    location: 'National',
    impact: 4,
    urgency: 5,
    timeCommitment: '15 minutes',
    ctaType: 'contact_rep',
    link: '#contact-rep-climate',
    nextSteps: [
      'Find your representative\'s contact information',
      'Personalize the message template',
      'Follow up in 2 weeks if no response',
      'Share your action on social media'
    ],
    resourceLinks: [
      { title: 'Find Your Representative', url: '#find-rep', type: 'informational' },
      { title: 'Message Templates', url: '#templates', type: 'informational' }
    ]
  },
  {
    id: 'climate-002',
    title: 'Join Local Climate Action Group',
    description: 'Connect with community members organizing for local climate resilience and sustainability initiatives.',
    category: 'climate_change',
    tags: ['climate change', 'community organizing', 'local action', 'volunteer'],
    organizationName: '350.org Local Chapter',
    location: 'Local Community',
    impact: 3,
    urgency: 3,
    timeCommitment: '2-3 hours/week',
    ctaType: 'volunteer',
    link: '#volunteer-climate',
    nextSteps: [
      'Attend next monthly meeting',
      'Sign up for volunteer activities',
      'Bring a friend to expand the network',
      'Share local climate wins on social media'
    ]
  },
  {
    id: 'climate-003',
    title: 'Support Emergency Climate Relief Fund',
    description: 'Donate to help communities affected by extreme weather events and climate disasters.',
    category: 'climate_change',
    tags: ['climate change', 'emergency relief', 'disaster response', 'donation'],
    organizationName: 'Climate Emergency Fund',
    location: 'National',
    impact: 5,
    urgency: 4,
    timeCommitment: '5 minutes',
    ctaType: 'donate',
    link: '#donate-climate-relief',
    nextSteps: [
      'Set up recurring monthly donation',
      'Share the fund with your network',
      'Follow impact updates from recipients',
      'Consider corporate matching programs'
    ]
  },

  // Healthcare Actions
  {
    id: 'health-001',
    title: 'Advocate for Mental Health Resources in Schools',
    description: 'Push for increased funding and staffing for mental health support in local schools.',
    category: 'healthcare',
    tags: ['healthcare', 'mental health', 'education', 'youth', 'advocacy'],
    organizationName: 'Mental Health America',
    location: 'Local Community',
    impact: 4,
    urgency: 4,
    timeCommitment: '30 minutes',
    ctaType: 'contact_rep',
    link: '#advocate-mental-health',
    nextSteps: [
      'Research current school mental health programs',
      'Contact school board members',
      'Attend next school board meeting',
      'Rally other parents and community members'
    ]
  },
  {
    id: 'health-002',
    title: 'Volunteer at Community Health Fair',
    description: 'Help provide free health screenings and education to underserved community members.',
    category: 'healthcare',
    tags: ['healthcare', 'community service', 'health education', 'volunteer'],
    organizationName: 'Community Health Coalition',
    location: 'Local Community',
    impact: 3,
    urgency: 2,
    timeCommitment: '4 hours',
    ctaType: 'volunteer',
    link: '#volunteer-health-fair',
    nextSteps: [
      'Complete volunteer orientation',
      'Choose your preferred role (registration, translation, etc.)',
      'Invite friends to volunteer together',
      'Follow up with participants after the event'
    ]
  },

  // Education Actions
  {
    id: 'education-001',
    title: 'Tutor Students in STEM Subjects',
    description: 'Help bridge the educational gap by providing free tutoring in science and math.',
    category: 'education',
    tags: ['education', 'STEM', 'tutoring', 'youth development', 'volunteer'],
    organizationName: 'Boys & Girls Club',
    location: 'Local Community',
    impact: 4,
    urgency: 3,
    timeCommitment: '2 hours/week',
    ctaType: 'volunteer',
    link: '#tutor-stem',
    nextSteps: [
      'Complete background check and training',
      'Schedule regular tutoring sessions',
      'Develop engaging lesson plans',
      'Track student progress and celebrate wins'
    ]
  },

  // Social Justice Actions
  {
    id: 'justice-001',
    title: 'Support Criminal Justice Reform Initiative',
    description: 'Sign and promote a petition calling for comprehensive criminal justice reform in your state.',
    category: 'social_justice',
    tags: ['social justice', 'criminal justice', 'reform', 'petition', 'advocacy'],
    organizationName: 'ACLU',
    location: 'State',
    impact: 4,
    urgency: 4,
    timeCommitment: '10 minutes',
    ctaType: 'petition',
    link: '#petition-justice-reform',
    nextSteps: [
      'Share petition with your network',
      'Write to local newspapers',
      'Contact state legislators',
      'Attend town halls on criminal justice'
    ]
  },
  {
    id: 'justice-002',
    title: 'Volunteer for Voter Registration Drive',
    description: 'Help register eligible voters in underrepresented communities ahead of upcoming elections.',
    category: 'voting_rights',
    tags: ['voting rights', 'democracy', 'voter registration', 'community outreach'],
    organizationName: 'League of Women Voters',
    location: 'Local Community',
    impact: 5,
    urgency: 5,
    timeCommitment: '3-4 hours',
    ctaType: 'volunteer',
    link: '#volunteer-voter-reg',
    nextSteps: [
      'Complete voter registration training',
      'Set up registration booth at local events',
      'Use multilingual materials when needed',
      'Follow up to ensure voters have polling info'
    ]
  },

  // Housing Actions
  {
    id: 'housing-001',
    title: 'Advocate for Affordable Housing Development',
    description: 'Support zoning changes and funding for affordable housing in your community.',
    category: 'housing',
    tags: ['housing', 'affordability', 'zoning', 'community development', 'advocacy'],
    organizationName: 'Habitat for Humanity',
    location: 'Local Community',
    impact: 4,
    urgency: 3,
    timeCommitment: '1-2 hours',
    ctaType: 'contact_rep',
    link: '#advocate-affordable-housing',
    nextSteps: [
      'Research local housing policies',
      'Attend city council meetings',
      'Connect with housing advocacy groups',
      'Organize neighborhood support'
    ]
  },

  // Technology & Digital Rights
  {
    id: 'tech-001',
    title: 'Protect Digital Privacy Rights',
    description: 'Support legislation that strengthens data privacy protections for all users.',
    category: 'technology',
    tags: ['digital rights', 'privacy', 'data protection', 'technology policy'],
    organizationName: 'Electronic Frontier Foundation',
    location: 'National',
    impact: 4,
    urgency: 4,
    timeCommitment: '20 minutes',
    ctaType: 'contact_rep',
    link: '#privacy-rights',
    nextSteps: [
      'Learn about current privacy bills',
      'Contact your senators and representatives',
      'Share privacy tools with friends',
      'Attend digital rights workshops'
    ]
  },

  // Immigration Actions
  {
    id: 'immigration-001',
    title: 'Volunteer with Refugee Resettlement',
    description: 'Help newly arrived refugees with language practice, job searching, and community navigation.',
    category: 'immigration',
    tags: ['immigration', 'refugee support', 'language assistance', 'community integration'],
    organizationName: 'International Rescue Committee',
    location: 'Local Community',
    impact: 5,
    urgency: 3,
    timeCommitment: '3 hours/week',
    ctaType: 'volunteer',
    link: '#volunteer-refugee-support',
    nextSteps: [
      'Complete cultural competency training',
      'Be matched with a refugee family',
      'Provide ongoing support and friendship',
      'Advocate for refugee-friendly policies'
    ]
  },

  // Women's Rights Actions
  {
    id: 'womens-001',
    title: 'Support Reproductive Health Access',
    description: 'Donate to organizations providing reproductive healthcare and advocacy.',
    category: 'womens_rights',
    tags: ['women\'s rights', 'reproductive health', 'healthcare access', 'donation'],
    organizationName: 'Planned Parenthood',
    location: 'National',
    impact: 5,
    urgency: 5,
    timeCommitment: '5 minutes',
    ctaType: 'donate',
    link: '#donate-reproductive-health',
    nextSteps: [
      'Set up recurring donations',
      'Volunteer at local clinics',
      'Share accurate health information',
      'Vote for pro-choice candidates'
    ]
  },

  // LGBTQ+ Rights Actions
  {
    id: 'lgbtq-001',
    title: 'Volunteer for LGBTQ+ Youth Support',
    description: 'Provide mentorship and support for LGBTQ+ young people in your community.',
    category: 'lgbtq_rights',
    tags: ['LGBTQ+ rights', 'youth support', 'mentorship', 'community support'],
    organizationName: 'PFLAG',
    location: 'Local Community',
    impact: 4,
    urgency: 3,
    timeCommitment: '2 hours/week',
    ctaType: 'volunteer',
    link: '#volunteer-lgbtq-youth',
    nextSteps: [
      'Complete LGBTQ+ ally training',
      'Attend support group meetings',
      'Advocate for inclusive school policies',
      'Create safe spaces in your community'
    ]
  },

  // Emergency/Get Help Actions
  {
    id: 'help-001',
    title: 'Find Local Food Assistance Programs',
    description: 'Access information about food banks, SNAP benefits, and nutrition programs in your area.',
    category: 'get_help',
    tags: ['food security', 'social services', 'emergency assistance', 'nutrition'],
    organizationName: 'Feeding America',
    location: 'Local Community',
    impact: 3,
    urgency: 5,
    timeCommitment: '30 minutes',
    ctaType: 'get_help',
    link: '#find-food-assistance',
    nextSteps: [
      'Locate nearest food banks',
      'Apply for SNAP benefits',
      'Find WIC program locations',
      'Connect with community gardens'
    ],
    resourceLinks: [
      { title: 'SNAP Benefits Application', url: '#snap-app', type: 'application' },
      { title: 'Emergency Food Hotline', url: '#food-hotline', type: 'emergency' },
      { title: 'Local Food Banks Map', url: '#food-banks', type: 'informational' }
    ]
  },
  {
    id: 'help-002',
    title: 'Access Mental Health Crisis Support',
    description: 'Find immediate mental health resources and ongoing support services.',
    category: 'mental_health',
    tags: ['mental health', 'crisis support', 'therapy', 'emergency assistance'],
    organizationName: 'National Suicide Prevention Lifeline',
    location: 'National',
    impact: 5,
    urgency: 5,
    timeCommitment: 'Immediate',
    ctaType: 'get_help',
    link: '#mental-health-crisis',
    nextSteps: [
      'Call 988 for immediate crisis support',
      'Find local therapists and counselors',
      'Access free mental health apps',
      'Connect with peer support groups'
    ],
    resourceLinks: [
      { title: '988 Suicide & Crisis Lifeline', url: 'tel:988', type: 'emergency' },
      { title: 'Crisis Text Line', url: 'sms:741741', type: 'emergency' },
      { title: 'Find Local Therapists', url: '#find-therapist', type: 'informational' }
    ]
  }
];

export class MockActionService {
  private static instance: MockActionService;
  private actions: ActionTemplate[] = MOCK_ACTIONS;

  private constructor() {}

  public static getInstance(): MockActionService {
    if (!MockActionService.instance) {
      MockActionService.instance = new MockActionService();
    }
    return MockActionService.instance;
  }

  // Get actions filtered by intent, topic, and location
  public getActionsByIntent(intent: string, topic: string, location: string, limit = 12): GeneratedAction[] {
    console.log('🔍 MockActionService: Filtering actions', { intent, topic, location, limit });
    
    let filteredActions = [...this.actions];

    // Filter by topic (category or tags)
    if (topic && topic !== '') {
      const topicLower = topic.toLowerCase().replace(/\s+/g, '_');
      filteredActions = filteredActions.filter(action => 
        action.category === topicLower || 
        action.tags.some(tag => tag.toLowerCase().includes(topic.toLowerCase())) ||
        action.title.toLowerCase().includes(topic.toLowerCase()) ||
        action.description.toLowerCase().includes(topic.toLowerCase())
      );
    }

    // Filter by location preference
    if (location && location !== '' && location !== 'Not specified') {
      const locationLower = location.toLowerCase();
      if (locationLower.includes('online') || locationLower.includes('virtual')) {
        // Prefer actions that can be done online
        filteredActions = filteredActions.filter(action => 
          action.location === 'National' || 
          action.ctaType === 'contact_rep' || 
          action.ctaType === 'petition' ||
          action.ctaType === 'donate'
        );
      } else if (locationLower.includes('local')) {
        // Prefer local community actions
        filteredActions = filteredActions.filter(action => 
          action.location === 'Local Community' || 
          action.ctaType === 'volunteer' ||
          action.ctaType === 'organize'
        );
      }
    }

    // Sort by relevance (urgency * impact) and add some randomization
    filteredActions.sort((a, b) => {
      const scoreA = a.urgency * a.impact + Math.random() * 2;
      const scoreB = b.urgency * b.impact + Math.random() * 2;
      return scoreB - scoreA;
    });

    // Convert to GeneratedAction format
    const generatedActions: GeneratedAction[] = filteredActions.slice(0, limit).map(action => ({
      id: action.id,
      title: action.title,
      description: action.description,
      tags: action.tags,
      intent: intent,
      topic: topic,
      location: location,
      cta: this.getCTAText(action.ctaType),
      ctaType: action.ctaType,
      impact: action.impact,
      urgency: action.urgency,
      timeCommitment: action.timeCommitment,
      organizationName: action.organizationName,
      link: action.link,
      nextSteps: action.nextSteps,
      resourceLinks: action.resourceLinks,
      generatedAt: new Date().toISOString(),
      relevanceScore: Math.floor(Math.random() * 40) + 60, // 60-100
      engagementScore: Math.floor(Math.random() * 50) + 50  // 50-100
    }));

    console.log('✅ MockActionService: Generated actions', {
      total: generatedActions.length,
      topics: [...new Set(generatedActions.map(a => a.tags).flat())],
      ctaTypes: [...new Set(generatedActions.map(a => a.ctaType))]
    });

    return generatedActions;
  }

  // Get popular actions across all categories
  public getPopularActions(limit = 10): GeneratedAction[] {
    const popularActions = [...this.actions]
      .sort((a, b) => (b.impact * b.urgency) - (a.impact * a.urgency))
      .slice(0, limit);

    return popularActions.map(action => ({
      id: action.id,
      title: action.title,
      description: action.description,
      tags: action.tags,
      intent: 'popular',
      topic: action.category,
      location: action.location,
      cta: this.getCTAText(action.ctaType),
      ctaType: action.ctaType,
      impact: action.impact,
      urgency: action.urgency,
      timeCommitment: action.timeCommitment,
      organizationName: action.organizationName,
      link: action.link,
      nextSteps: action.nextSteps,
      resourceLinks: action.resourceLinks,
      generatedAt: new Date().toISOString(),
      relevanceScore: Math.floor(Math.random() * 30) + 70,
      engagementScore: Math.floor(Math.random() * 40) + 60
    }));
  }

  // Get actions by specific tags
  public getActionsByTags(tags: string[], limit = 8): GeneratedAction[] {
    const taggedActions = this.actions.filter(action =>
      tags.some(tag => action.tags.some(actionTag => 
        actionTag.toLowerCase().includes(tag.toLowerCase())
      ))
    );

    return taggedActions.slice(0, limit).map(action => ({
      id: action.id,
      title: action.title,
      description: action.description,
      tags: action.tags,
      intent: 'tagged',
      topic: action.category,
      location: action.location,
      cta: this.getCTAText(action.ctaType),
      ctaType: action.ctaType,
      impact: action.impact,
      urgency: action.urgency,
      timeCommitment: action.timeCommitment,
      organizationName: action.organizationName,
      link: action.link,
      nextSteps: action.nextSteps,
      resourceLinks: action.resourceLinks,
      generatedAt: new Date().toISOString(),
      relevanceScore: Math.floor(Math.random() * 30) + 70,
      engagementScore: Math.floor(Math.random() * 40) + 60
    }));
  }

  private getCTAText(ctaType: string): string {
    const ctaMap = {
      'contact_rep': 'Contact Representative',
      'volunteer': 'Sign Up to Volunteer',
      'donate': 'Donate Now',
      'petition': 'Sign Petition',
      'learn_more': 'Learn More',
      'organize': 'Start Organizing',
      'get_help': 'Get Help Now'
    };
    return ctaMap[ctaType as keyof typeof ctaMap] || 'Take Action';
  }

  // Get unique tags for filtering
  public getAllTags(): string[] {
    const tags = new Set<string>();
    this.actions.forEach(action => {
      action.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  // Get unique categories
  public getAllCategories(): string[] {
    const categories = new Set<string>();
    this.actions.forEach(action => {
      categories.add(action.category);
    });
    return Array.from(categories).sort();
  }
}

export const mockActionService = MockActionService.getInstance();
