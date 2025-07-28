import { supabaseUserService } from '@/services/supabaseUserService';
import { supabase } from '@/lib/supabase';

export class DatabaseInitializer {
  async initializeDatabase() {
    // Production: debug output removed
    
    try {
      // Check connection
      const isConnected = await this.checkConnection();
      if (!isConnected) {
        throw new Error('Unable to connect to Supabase database');
      }

      // Generate synthetic data
      await this.generateInitialData();
      
      // Production: debug output removed
    } catch (error) {
      // Production: debug output removed
      throw error;
    }
  }

  private async checkConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('user_profiles').select('id').limit(1);
      return !error;
    } catch (error) {
      // Production: debug output removed
      return false;
    }
  }

  private async generateInitialData() {
    // Production: debug output removed
    
    // Check if we already have data
    const { count: userCount } = await supabase
      .from('user_profiles')
      .select('id', { count: 'exact', head: true });

    const { count: actionCount } = await supabase
      .from('action_items')
      .select('id', { count: 'exact', head: true });

    // Production: debug output removed

    // Generate initial actions if none exist
    if (!actionCount || actionCount === 0) {
      // Production: debug output removed
      await this.generateActionItems();
    }

    // Generate users if we have less than 100
    if (!userCount || userCount < 100) {
      // Production: debug output removed
      const usersToGenerate = Math.max(500 - (userCount || 0), 0); // Much smaller default
      await supabaseUserService.generateSyntheticUsers(usersToGenerate);
    }

    // Production: debug output removed
  }

  private async generateActionItems() {
    const actionTemplates = [
      // Climate & Environment
      {
        title: "Join Local Climate Action Group",
        description: "Connect with community members taking action on climate change in your area.",
        category: "Environmental",
        difficulty: "easy" as const,
        time_commitment: "2 hours",
        impact_level: "medium" as const,
        organization: "Climate Action Network",
        tags: ["climate", "community", "advocacy"],
      },
      {
        title: "Participate in Tree Planting Initiative",
        description: "Help restore local ecosystems by participating in community tree planting.",
        category: "Environmental",
        difficulty: "medium" as const,
        time_commitment: "4 hours",
        impact_level: "high" as const,
        organization: "Green City Initiative",
        tags: ["environment", "hands-on", "restoration"],
      },
      {
        title: "Advocate for Renewable Energy Policy",
        description: "Contact representatives to support clean energy legislation.",
        category: "Environmental",
        difficulty: "easy" as const,
        time_commitment: "30 minutes",
        impact_level: "medium" as const,
        organization: "Clean Energy Coalition",
        tags: ["policy", "advocacy", "energy"],
      },

      // Social Justice
      {
        title: "Volunteer at Local Food Bank",
        description: "Help distribute food to families in need in your community.",
        category: "Social Justice",
        difficulty: "easy" as const,
        time_commitment: "3 hours",
        impact_level: "high" as const,
        organization: "Community Food Network",
        tags: ["hunger", "volunteer", "community"],
      },
      {
        title: "Support Criminal Justice Reform",
        description: "Join advocacy efforts for fair sentencing and prison reform.",
        category: "Social Justice",
        difficulty: "medium" as const,
        time_commitment: "2 hours",
        impact_level: "medium" as const,
        organization: "Justice Reform Coalition",
        tags: ["justice", "reform", "advocacy"],
      },
      {
        title: "Mentor Youth in Underserved Communities",
        description: "Provide guidance and support to young people facing challenges.",
        category: "Social Justice",
        difficulty: "hard" as const,
        time_commitment: "8 hours",
        impact_level: "high" as const,
        organization: "Youth Empowerment Program",
        tags: ["youth", "mentoring", "education"],
      },

      // Education
      {
        title: "Tutor Students in STEM",
        description: "Help students succeed in science, technology, engineering, and math.",
        category: "Education",
        difficulty: "medium" as const,
        time_commitment: "2 hours",
        impact_level: "high" as const,
        organization: "STEM Education Alliance",
        tags: ["education", "tutoring", "STEM"],
      },
      {
        title: "Advocate for Public School Funding",
        description: "Support increased funding for public education in your district.",
        category: "Education",
        difficulty: "easy" as const,
        time_commitment: "1 hour",
        impact_level: "medium" as const,
        organization: "Public Education Coalition",
        tags: ["education", "funding", "policy"],
      },
      {
        title: "Donate Books to Local Libraries",
        description: "Support literacy by donating books to community libraries.",
        category: "Education",
        difficulty: "easy" as const,
        time_commitment: "1 hour",
        impact_level: "low" as const,
        organization: "Library Friends Network",
        tags: ["literacy", "books", "community"],
      },

      // Healthcare
      {
        title: "Support Universal Healthcare Initiative",
        description: "Advocate for accessible healthcare for all community members.",
        category: "Healthcare",
        difficulty: "medium" as const,
        time_commitment: "2 hours",
        impact_level: "high" as const,
        organization: "Healthcare for All",
        tags: ["healthcare", "advocacy", "policy"],
      },
      {
        title: "Volunteer at Community Health Clinic",
        description: "Assist healthcare workers in providing services to underserved populations.",
        category: "Healthcare",
        difficulty: "medium" as const,
        time_commitment: "4 hours",
        impact_level: "high" as const,
        organization: "Community Health Network",
        tags: ["health", "volunteer", "clinic"],
      },
      {
        title: "Promote Mental Health Awareness",
        description: "Help reduce stigma and increase access to mental health resources.",
        category: "Healthcare",
        difficulty: "easy" as const,
        time_commitment: "1 hour",
        impact_level: "medium" as const,
        organization: "Mental Health Alliance",
        tags: ["mental health", "awareness", "advocacy"],
      },

      // Technology & Digital Rights
      {
        title: "Teach Digital Literacy to Seniors",
        description: "Help older adults navigate technology and stay connected.",
        category: "Technology",
        difficulty: "medium" as const,
        time_commitment: "3 hours",
        impact_level: "medium" as const,
        organization: "Digital Inclusion Project",
        tags: ["technology", "seniors", "education"],
      },
      {
        title: "Advocate for Net Neutrality",
        description: "Support open internet policies that benefit all users.",
        category: "Technology",
        difficulty: "easy" as const,
        time_commitment: "30 minutes",
        impact_level: "medium" as const,
        organization: "Internet Freedom Coalition",
        tags: ["internet", "policy", "rights"],
      },
      {
        title: "Support Digital Privacy Rights",
        description: "Advocate for stronger data protection and privacy laws.",
        category: "Technology",
        difficulty: "medium" as const,
        time_commitment: "1 hour",
        impact_level: "medium" as const,
        organization: "Privacy Rights Foundation",
        tags: ["privacy", "data", "rights"],
      },

      // Economic Justice
      {
        title: "Support Living Wage Campaign",
        description: "Advocate for fair wages that allow workers to meet basic needs.",
        category: "Economic",
        difficulty: "medium" as const,
        time_commitment: "2 hours",
        impact_level: "high" as const,
        organization: "Economic Justice Coalition",
        tags: ["wages", "workers", "economy"],
      },
      {
        title: "Volunteer for Financial Literacy Program",
        description: "Teach community members about budgeting, saving, and investing.",
        category: "Economic",
        difficulty: "medium" as const,
        time_commitment: "3 hours",
        impact_level: "medium" as const,
        organization: "Financial Empowerment Network",
        tags: ["finance", "education", "empowerment"],
      },
      {
        title: "Support Small Business Development",
        description: "Help local entrepreneurs start and grow their businesses.",
        category: "Economic",
        difficulty: "hard" as const,
        time_commitment: "5 hours",
        impact_level: "high" as const,
        organization: "Small Business Alliance",
        tags: ["business", "entrepreneurship", "local"],
      },

      // Democracy & Civic Engagement
      {
        title: "Register Voters in Your Community",
        description: "Help eligible citizens register to vote in upcoming elections.",
        category: "Political",
        difficulty: "easy" as const,
        time_commitment: "3 hours",
        impact_level: "high" as const,
        organization: "Voter Registration Drive",
        tags: ["voting", "democracy", "civic"],
      },
      {
        title: "Attend Town Hall Meetings",
        description: "Participate in local government meetings to voice community concerns.",
        category: "Political",
        difficulty: "easy" as const,
        time_commitment: "2 hours",
        impact_level: "medium" as const,
        organization: "Civic Engagement Coalition",
        tags: ["government", "local", "participation"],
      },
      {
        title: "Support Campaign Finance Reform",
        description: "Advocate for transparency and limits on political contributions.",
        category: "Political",
        difficulty: "medium" as const,
        time_commitment: "1 hour",
        impact_level: "medium" as const,
        organization: "Democracy Reform Initiative",
        tags: ["campaign", "reform", "transparency"],
      },

      // Housing & Community Development
      {
        title: "Volunteer with Habitat for Humanity",
        description: "Help build affordable housing for families in need.",
        category: "Community",
        difficulty: "hard" as const,
        time_commitment: "8 hours",
        impact_level: "high" as const,
        organization: "Habitat for Humanity",
        tags: ["housing", "building", "volunteer"],
      },
      {
        title: "Advocate for Affordable Housing",
        description: "Support policies that increase access to affordable housing.",
        category: "Community",
        difficulty: "medium" as const,
        time_commitment: "2 hours",
        impact_level: "high" as const,
        organization: "Housing Justice Coalition",
        tags: ["housing", "affordability", "policy"],
      },
      {
        title: "Organize Neighborhood Cleanup",
        description: "Coordinate community efforts to clean and beautify local areas.",
        category: "Community",
        difficulty: "medium" as const,
        time_commitment: "4 hours",
        impact_level: "medium" as const,
        organization: "Neighborhood Alliance",
        tags: ["cleanup", "beautification", "community"],
      },
    ];

    // Insert action templates with some randomization
    for (const template of actionTemplates) {
      const variations = [
        { location: "Local", completion_count: Math.floor(Math.random() * 1000) },
        { location: "Remote", completion_count: Math.floor(Math.random() * 1500) },
        { location: "New York, NY", completion_count: Math.floor(Math.random() * 800) },
        { location: "Los Angeles, CA", completion_count: Math.floor(Math.random() * 600) },
        { location: "Chicago, IL", completion_count: Math.floor(Math.random() * 400) },
      ];

      for (let i = 0; i < 3; i++) {
        const variation = variations[i % variations.length];
        const actionData = {
          ...template,
          title: `${template.title} ${i > 0 ? `(${i + 1})` : ''}`,
          location: variation.location,
          completion_count: variation.completion_count,
          is_active: true,
        };

        const { error } = await supabase
          .from('action_items')
          .insert([actionData]);

        if (error) {
          // Production: debug output removed
        }
      }
    }

    // Production: debug output removed
  }

  async generateTestData() {
    // Production: debug output removed
    
    try {
      // Generate a smaller set for testing
      await supabaseUserService.generateSyntheticUsers(100);
      await this.generateActionItems();
      
      // Production: debug output removed
    } catch (error) {
      // Production: debug output removed
      throw error;
    }
  }

  async clearDatabase() {
    // Production: debug output removed
    
    try {
      // Clear in reverse dependency order
      await supabase.from('user_actions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('user_sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('system_metrics').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('action_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('user_profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Production: debug output removed
    } catch (error) {
      // Production: debug output removed
      throw error;
    }
  }

  async getStats() {
    try {
      const [userCount, actionCount, userActionCount, systemMetricCount] = await Promise.all([
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('action_items').select('id', { count: 'exact', head: true }),
        supabase.from('user_actions').select('id', { count: 'exact', head: true }),
        supabase.from('system_metrics').select('id', { count: 'exact', head: true }),
      ]);

      return {
        users: userCount.count || 0,
        actions: actionCount.count || 0,
        user_actions: userActionCount.count || 0,
        system_metrics: systemMetricCount.count || 0,
      };
    } catch (error) {
      // Production: debug output removed
      return {
        users: 0,
        actions: 0,
        user_actions: 0,
        system_metrics: 0,
      };
    }
  }
}

export const databaseInitializer = new DatabaseInitializer();

