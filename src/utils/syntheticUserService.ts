import syntheticUserGenerator from '@/utils/syntheticUserGenerator';
import { UserProfile } from '@/lib/supabase';

// Mock data storage for development
let mockUsers: UserProfile[] = [];
let lastGenerated: Date | null = null;

interface Statistics {
  hasData: boolean;
  lastGenerated: Date | null;
  totalUsers: number;
  profileTypeDistribution: Record<string, number>;
  locationDistribution: Record<string, number>;
  engagementStats: {
    avgActionsCompleted: number;
    avgPoliciesViewed: number;
    avgOrganizationsSupported: number;
    avgTotalImpactScore: number;
  };
  topInterests: { interest: string; count: number }[];
  deviceDistribution: Record<string, number>;
}

export const syntheticUserService = {
  async generateUsers(count: number): Promise<void> {
    const newUsers = syntheticUserGenerator.generateSyntheticUsers(count);
    mockUsers = [...mockUsers, ...newUsers];
    lastGenerated = new Date();
  },

  getStatistics(): Statistics {
    if (mockUsers.length === 0) {
      return {
        hasData: false,
        lastGenerated: null,
        totalUsers: 0,
        profileTypeDistribution: {},
        locationDistribution: {},
        engagementStats: {
          avgActionsCompleted: 0,
          avgPoliciesViewed: 0,
          avgOrganizationsSupported: 0,
          avgTotalImpactScore: 0
        },
        topInterests: [],
        deviceDistribution: {}
      };
    }

    const analysis = syntheticUserGenerator.analyzeUserData(mockUsers);
    return {
      hasData: true,
      lastGenerated,
      ...analysis
    };
  },

  clearDatabase(): void {
    mockUsers = [];
    lastGenerated = null;
  },

  exportData(): { users: UserProfile[]; timestamp: Date | null } {
    return {
      users: mockUsers,
      timestamp: lastGenerated
    };
  },

  async runStressTest(count: number): Promise<void> {
    const testUsers = syntheticUserGenerator.generateSyntheticUsers(count);
    console.log(`Stress test completed with ${testUsers.length} users`);
  }
};
