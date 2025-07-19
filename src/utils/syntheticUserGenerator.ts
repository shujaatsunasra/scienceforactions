import { UserProfile } from '@/lib/supabase';

// Sample data for generating realistic users
const FIRST_NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Cameron', 'Avery', 'Quinn', 'Sage',
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William',
  'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander',
  'Abigail', 'Michael', 'Emily', 'Daniel', 'Elizabeth', 'Jacob', 'Sofia', 'Logan', 'Avery', 'Jackson',
  'Ella', 'Levi', 'Madison', 'Sebastian', 'Scarlett', 'Mateo', 'Victoria', 'Jack', 'Aria', 'Owen',
  'Grace', 'Theodore', 'Chloe', 'Aiden', 'Camila', 'Samuel', 'Penelope', 'Joseph', 'Riley', 'John',
  'Layla', 'David', 'Lillian', 'Wyatt', 'Nora', 'Matthew', 'Zoey', 'Luke', 'Mila', 'Asher'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

const US_CITIES = [
  { city: 'New York', state: 'NY', zip: '10001' },
  { city: 'Los Angeles', state: 'CA', zip: '90210' },
  { city: 'Chicago', state: 'IL', zip: '60601' },
  { city: 'Houston', state: 'TX', zip: '77001' },
  { city: 'Phoenix', state: 'AZ', zip: '85001' },
  { city: 'Philadelphia', state: 'PA', zip: '19101' },
  { city: 'San Antonio', state: 'TX', zip: '78201' },
  { city: 'San Diego', state: 'CA', zip: '92101' },
  { city: 'Dallas', state: 'TX', zip: '75201' },
  { city: 'San Jose', state: 'CA', zip: '95101' },
  { city: 'Austin', state: 'TX', zip: '73301' },
  { city: 'Jacksonville', state: 'FL', zip: '32099' },
  { city: 'Fort Worth', state: 'TX', zip: '76101' },
  { city: 'Columbus', state: 'OH', zip: '43085' },
  { city: 'Charlotte', state: 'NC', zip: '28201' },
  { city: 'San Francisco', state: 'CA', zip: '94102' },
  { city: 'Indianapolis', state: 'IN', zip: '46201' },
  { city: 'Seattle', state: 'WA', zip: '98101' },
  { city: 'Denver', state: 'CO', zip: '80201' },
  { city: 'Washington', state: 'DC', zip: '20001' },
  { city: 'Boston', state: 'MA', zip: '02101' },
  { city: 'El Paso', state: 'TX', zip: '79901' },
  { city: 'Nashville', state: 'TN', zip: '37201' },
  { city: 'Detroit', state: 'MI', zip: '48201' },
  { city: 'Oklahoma City', state: 'OK', zip: '73101' },
  { city: 'Portland', state: 'OR', zip: '97201' },
  { city: 'Las Vegas', state: 'NV', zip: '89101' },
  { city: 'Memphis', state: 'TN', zip: '38101' },
  { city: 'Louisville', state: 'KY', zip: '40201' },
  { city: 'Baltimore', state: 'MD', zip: '21201' },
  { city: 'Milwaukee', state: 'WI', zip: '53201' },
  { city: 'Albuquerque', state: 'NM', zip: '87101' },
  { city: 'Tucson', state: 'AZ', zip: '85701' },
  { city: 'Fresno', state: 'CA', zip: '93701' },
  { city: 'Sacramento', state: 'CA', zip: '94203' },
  { city: 'Kansas City', state: 'MO', zip: '64101' },
  { city: 'Mesa', state: 'AZ', zip: '85201' },
  { city: 'Atlanta', state: 'GA', zip: '30301' },
  { city: 'Omaha', state: 'NE', zip: '68101' },
  { city: 'Colorado Springs', state: 'CO', zip: '80901' },
  { city: 'Raleigh', state: 'NC', zip: '27601' },
  { city: 'Virginia Beach', state: 'VA', zip: '23451' },
  { city: 'Long Beach', state: 'CA', zip: '90801' },
  { city: 'Miami', state: 'FL', zip: '33101' },
  { city: 'Oakland', state: 'CA', zip: '94601' },
  { city: 'Minneapolis', state: 'MN', zip: '55401' },
  { city: 'Tulsa', state: 'OK', zip: '74101' },
  { city: 'Cleveland', state: 'OH', zip: '44101' },
  { city: 'Wichita', state: 'KS', zip: '67201' },
  { city: 'Arlington', state: 'TX', zip: '76001' }
];

const GLOBAL_CITIES = [
  'Toronto, Canada', 'London, UK', 'Paris, France', 'Berlin, Germany', 'Tokyo, Japan',
  'Sydney, Australia', 'Madrid, Spain', 'Rome, Italy', 'Amsterdam, Netherlands', 'Stockholm, Sweden',
  'Copenhagen, Denmark', 'Oslo, Norway', 'Helsinki, Finland', 'Dublin, Ireland', 'Vienna, Austria',
  'Zurich, Switzerland', 'Brussels, Belgium', 'Prague, Czech Republic', 'Warsaw, Poland', 'Budapest, Hungary',
  'Mexico City, Mexico', 'São Paulo, Brazil', 'Buenos Aires, Argentina', 'Santiago, Chile', 'Lima, Peru',
  'Seoul, South Korea', 'Singapore', 'Mumbai, India', 'Delhi, India', 'Bangkok, Thailand'
];

const TOPICS = [
  'Climate Change', 'Healthcare', 'Education', 'Economic Justice', 'Civil Rights',
  'Immigration', 'Criminal Justice', 'Environment', 'Technology Ethics', 'Workers Rights',
  'Housing', 'Food Security', 'Mental Health', 'Veterans Affairs', 'Disability Rights',
  'Data Privacy', 'AI Ethics', 'Public Health', 'Clean Energy', 'Transportation'
];

const INTENTS = ['be_heard', 'volunteer', 'get_help', 'organize', 'donate'];

const PROFILE_TYPES = ['guest', 'registered', 'activist', 'organizer'];

const DEVICES = ['desktop', 'mobile', 'tablet'];

// Helper functions
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomChoices<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateEmail(firstName: string, lastName: string): string {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com'];
  const variations = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomInt(1, 999)}`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase().charAt(0)}`,
  ];
  
  return `${randomChoice(variations)}@${randomChoice(domains)}`;
}

function generateLocation(): string {
  if (Math.random() < 0.7) { // 70% US locations
    const location = randomChoice(US_CITIES);
    return `${location.city}, ${location.state} ${location.zip}`;
  } else { // 30% global locations
    return randomChoice(GLOBAL_CITIES);
  }
}

function generateIntentHistory(): string[] {
  const historyLength = randomInt(1, 5);
  const history: string[] = [];
  
  for (let i = 0; i < historyLength; i++) {
    history.push(randomChoice(INTENTS));
  }
  
  return history;
}

function generatePolicyEngagementHistory() {
  const historyLength = randomInt(0, 10);
  const history = [];
  
  for (let i = 0; i < historyLength; i++) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - randomInt(1, 365));
    
    history.push({
      policyId: `policy-${randomInt(1000, 9999)}`,
      action: randomChoice(['viewed', 'shared', 'acted'] as const),
      timestamp: pastDate.toISOString(),
    });
  }
  
  return history;
}

function generateRegistrationDate(): string {
  const now = new Date();
  const pastDate = new Date(now.getTime() - randomInt(1, 730) * 24 * 60 * 60 * 1000); // 1-730 days ago
  return pastDate.toISOString();
}

function generateLastLogin(): string {
  const now = new Date();
  const recentDate = new Date(now.getTime() - randomInt(1, 30) * 24 * 60 * 60 * 1000); // 1-30 days ago
  return recentDate.toISOString();
}

export function generateSyntheticUser(): UserProfile {
  const firstName = randomChoice(FIRST_NAMES);
  const lastName = randomChoice(LAST_NAMES);
  const profileType = randomChoice(PROFILE_TYPES);
  const created_at = generateRegistrationDate();
  
  // Generate engagement stats based on profile type
  let baseActions = 0;
  let basePolicies = 0;
  let baseOrgs = 0;
  
  switch (profileType) {
    case 'guest':
      baseActions = randomInt(0, 2);
      basePolicies = randomInt(0, 5);
      baseOrgs = randomInt(0, 1);
      break;
    case 'registered':
      baseActions = randomInt(1, 8);
      basePolicies = randomInt(3, 15);
      baseOrgs = randomInt(1, 3);
      break;
    case 'activist':
      baseActions = randomInt(5, 15);
      basePolicies = randomInt(10, 30);
      baseOrgs = randomInt(2, 8);
      break;
    case 'organizer':
      baseActions = randomInt(10, 25);
      basePolicies = randomInt(20, 50);
      baseOrgs = randomInt(5, 15);
      break;
  }

  const user: UserProfile = {
    id: crypto.randomUUID(),
    name: `${firstName} ${lastName}`,
    email: generateEmail(firstName, lastName),
    location: generateLocation(),
    interests: randomChoices(TOPICS, randomInt(3, 7)),
    preferred_causes: randomChoices(TOPICS, randomInt(2, 5)),
    contribution_stats: {
      actions_completed: baseActions,
      policies_viewed: basePolicies,
      organizations_supported: baseOrgs,
      total_impact_score: baseActions * 10 + basePolicies * 2 + baseOrgs * 5,
    },
    personalization: {
      layout_preference: randomChoice(['minimal', 'detailed', 'visual']),
      color_scheme: randomChoice(['warm', 'cool', 'neutral']),
      engagement_level: randomChoice(['low', 'medium', 'high']),
      communication_frequency: randomChoice(['daily', 'weekly', 'monthly']),
    },
    profile_completion: Math.random() * 100,
    created_at: created_at,
    updated_at: Math.random() < 0.3 ? generateLastLogin() : created_at,
    last_active: generateLastLogin(),
    engagement_metrics: {
      session_count: randomInt(1, 50),
      avg_session_duration: randomInt(300, 1800), // 5-30 minutes
      page_views: randomInt(10, 200),
      actions_per_session: Math.round((baseActions / Math.max(1, randomInt(1, 50))) * 10) / 10,
    },
  };

  return user;
}

export function generateSyntheticUsers(count: number): UserProfile[] {
  const users: UserProfile[] = [];
  
  for (let i = 0; i < count; i++) {
    users.push(generateSyntheticUser());
  }
  
  return users;
}

// Batch processing for large datasets
export function* generateSyntheticUsersBatch(totalCount: number, batchSize: number = 1000) {
  for (let i = 0; i < totalCount; i += batchSize) {
    const currentBatchSize = Math.min(batchSize, totalCount - i);
    yield generateSyntheticUsers(currentBatchSize);
  }
}

// Analysis functions for the generated data
export function analyzeUserData(users: UserProfile[]) {
  const profileTypeDistribution = users.reduce((acc, user) => {
    const type = determineProfileType(user);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const locationDistribution = users.reduce((acc, user) => {
    const location = user.location || 'Unknown';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const engagementStats = {
    avgActionsCompleted: users.reduce((sum, user) => sum + user.contribution_stats.actions_completed, 0) / users.length,
    avgPoliciesViewed: users.reduce((sum, user) => sum + user.contribution_stats.policies_viewed, 0) / users.length,
    avgOrganizationsSupported: users.reduce((sum, user) => sum + user.contribution_stats.organizations_supported, 0) / users.length,
    avgTotalImpactScore: users.reduce((sum, user) => sum + user.contribution_stats.total_impact_score, 0) / users.length,
  };

  return {
    totalUsers: users.length,
    profileTypeDistribution,
    locationDistribution,
    engagementStats,
    topInterests: getTopInterests(users),
    deviceDistribution: getDeviceDistribution(users),
  };
}

function determineProfileType(user: UserProfile): string {
  const { actions_completed, organizations_supported } = user.contribution_stats;
  
  if (actions_completed >= 10 && organizations_supported >= 5) return 'organizer';
  if (actions_completed >= 5 && organizations_supported >= 2) return 'activist';
  if (actions_completed >= 1) return 'registered';
  return 'guest';
}

function getTopInterests(users: UserProfile[]): Array<{ interest: string; count: number }> {
  const interestCount = users.reduce((acc, user) => {
    user.interests.forEach((interest: string) => {
      acc[interest] = (acc[interest] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(interestCount)
    .map(([interest, count]) => ({ interest, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function getDeviceDistribution(users: UserProfile[]): Record<string, number> {
  // Simulate device distribution based on realistic patterns
  const deviceCount = users.reduce((acc, user) => {
    const device = randomChoice(DEVICES);
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return deviceCount;
}

export default {
  generateSyntheticUser,
  generateSyntheticUsers,
  generateSyntheticUsersBatch,
  analyzeUserData,
};
