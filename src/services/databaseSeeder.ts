import { supabase } from '@/lib/supabase';

// Comprehensive data generator for Science for Action platform
class DatabaseSeeder {
  
  // Scientific categories with real-world relevance
  private categories = [
    'climate', 'biodiversity', 'medicine', 'biotechnology', 'space',
    'energy', 'sustainability', 'conservation', 'research', 'education',
    'policy', 'innovation', 'technology', 'health', 'environment'
  ];

  // Real scientific topics and causes
  private topicTemplates = [
    // Climate & Environment
    { category: 'climate', templates: [
      'Carbon Capture Research Initiative',
      'Renewable Energy Advocacy Campaign',
      'Climate Data Collection Project',
      'Green Transportation Solutions',
      'Urban Heat Island Study',
      'Ocean Acidification Monitoring',
      'Sustainable Agriculture Program',
      'Clean Energy Policy Advocacy'
    ]},
    
    // Biodiversity & Conservation
    { category: 'biodiversity', templates: [
      'Species Conservation Program',
      'Habitat Restoration Project',
      'Wildlife Corridor Development',
      'Pollinator Protection Initiative',
      'Marine Ecosystem Research',
      'Endangered Species Recovery',
      'Invasive Species Management',
      'Biodiversity Monitoring Network'
    ]},
    
    // Medicine & Health
    { category: 'medicine', templates: [
      'Public Health Data Initiative',
      'Disease Prevention Campaign',
      'Mental Health Awareness Program',
      'Community Health Screening',
      'Medical Research Participation',
      'Health Equity Advocacy',
      'Vaccination Education Campaign',
      'Rare Disease Research Support'
    ]},
    
    // Technology & Innovation
    { category: 'technology', templates: [
      'Open Source Science Platform',
      'AI Ethics Research Initiative',
      'Digital Divide Solutions',
      'Science Education Technology',
      'Data Privacy Advocacy',
      'Citizen Science App Development',
      'STEM Accessibility Program',
      'Tech for Good Initiative'
    ]},
    
    // Energy & Sustainability
    { category: 'energy', templates: [
      'Community Solar Project',
      'Energy Efficiency Campaign',
      'Smart Grid Development',
      'Battery Technology Research',
      'Hydrogen Economy Initiative',
      'Nuclear Safety Advocacy',
      'Energy Storage Solutions',
      'Grid Modernization Project'
    ]}
  ];

  // Global regions for location diversity
  private regions = [
    'Global', 'North America', 'Europe', 'Asia Pacific', 'Latin America', 'Africa',
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia',
    'Japan', 'Brazil', 'India', 'China', 'Mexico', 'Spain', 'Italy', 'Netherlands',
    'California', 'New York', 'Texas', 'Florida', 'Washington', 'Oregon',
    'London', 'Berlin', 'Paris', 'Tokyo', 'Sydney', 'Toronto', 'Vancouver'
  ];

  // Realistic organizations
  private organizations = [
    'Science for Action Coalition', 'Global Research Alliance', 'Community Science Network',
    'Climate Action Initiative', 'Biodiversity Foundation', 'Health Equity Alliance',
    'Open Science Collaborative', 'Sustainability Institute', 'Future Tech Society',
    'Environmental Defense Network', 'Medical Research Foundation', 'Energy Innovation Hub',
    'Conservation International', 'Public Health Coalition', 'Green Technology Initiative',
    'Science Education Alliance', 'Policy Research Center', 'Innovation Lab Network',
    'Citizen Science Platform', 'Research Democracy Project'
  ];

  // Impact levels and time commitments
  private impactLevels = ['low', 'medium', 'high'] as const;
  private difficulties = ['easy', 'medium', 'hard'] as const;
  private timeCommitments = [
    '1-2 hours', '3-5 hours', '6-10 hours', '10+ hours',
    'Weekend project', 'Weekly commitment', 'Monthly involvement', 'Ongoing'
  ];

  // Generate scientific description with context
  private generateDescription(title: string, category: string): string {
    const baseDescriptions = {
      climate: [
        'Join a critical research initiative addressing climate change through community-driven data collection and advocacy.',
        'Participate in groundbreaking research to understand and mitigate the effects of global warming on local ecosystems.',
        'Support evidence-based climate policy through citizen science and grassroots organizing efforts.',
        'Contribute to renewable energy transition by advocating for clean technology adoption in your community.'
      ],
      biodiversity: [
        'Help protect endangered species through habitat monitoring and conservation advocacy efforts.',
        'Join researchers in documenting biodiversity patterns and supporting ecosystem restoration projects.',
        'Participate in wildlife conservation efforts that combine scientific research with community action.',
        'Support ecosystem health through citizen science monitoring and environmental protection advocacy.'
      ],
      medicine: [
        'Contribute to public health research that improves community wellness and healthcare access.',
        'Support medical research participation and health equity initiatives in underserved communities.',
        'Join evidence-based health advocacy efforts that translate research into policy and practice.',
        'Participate in community health initiatives that bridge science and public health outcomes.'
      ],
      technology: [
        'Support ethical technology development that prioritizes privacy, equity, and social benefit.',
        'Join open-source initiatives that democratize access to scientific tools and platforms.',
        'Advocate for responsible AI development and digital rights in scientific research.',
        'Participate in technology policy development that protects scientific integrity and public interest.'
      ],
      energy: [
        'Support the transition to clean energy through research, advocacy, and community organizing.',
        'Join initiatives that advance renewable energy technology and sustainable energy policy.',
        'Participate in energy democracy movements that prioritize community ownership and environmental justice.',
        'Contribute to energy efficiency research and implementation in your local community.'
      ]
    };

    const templates = baseDescriptions[category as keyof typeof baseDescriptions] || baseDescriptions.climate;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  // Generate realistic tags
  private generateTags(category: string, title: string): string[] {
    const categoryTags = {
      climate: ['climate-change', 'renewable-energy', 'carbon-reduction', 'sustainability', 'environment'],
      biodiversity: ['wildlife', 'conservation', 'ecosystem', 'species-protection', 'habitat'],
      medicine: ['public-health', 'research', 'community-health', 'healthcare', 'wellness'],
      technology: ['innovation', 'open-source', 'digital-rights', 'ai-ethics', 'tech-policy'],
      energy: ['clean-energy', 'solar', 'wind', 'efficiency', 'grid-modernization']
    };

    const baseTags = categoryTags[category as keyof typeof categoryTags] || ['science', 'research', 'community'];
    const additionalTags = ['citizen-science', 'advocacy', 'policy', 'education', 'collaboration'];
    
    // Mix category-specific and general tags
    const tags = [...baseTags.slice(0, 3), ...additionalTags.slice(0, 2)];
    
    // Add location-based tags sometimes
    if (Math.random() > 0.7) {
      tags.push('local', 'community-driven');
    }
    
    return tags;
  }

  // Generate realistic completion counts with statistical distribution
  private generateCompletionCount(): number {
    // Use a power law distribution for realistic engagement numbers
    const random = Math.random();
    if (random < 0.6) return Math.floor(Math.random() * 50) + 1; // 1-50 (most common)
    if (random < 0.8) return Math.floor(Math.random() * 200) + 51; // 51-250
    if (random < 0.95) return Math.floor(Math.random() * 500) + 251; // 251-750
    return Math.floor(Math.random() * 2000) + 751; // 751-2750 (rare viral actions)
  }

  // Generate a single action item
  private generateAction(index: number): any {
    const categoryData = this.topicTemplates[Math.floor(Math.random() * this.topicTemplates.length)];
    const template = categoryData.templates[Math.floor(Math.random() * categoryData.templates.length)];
    
    // Add variation to titles
    const variations = [
      template,
      `${template} - Phase 2`,
      `Local ${template}`,
      `Regional ${template}`,
      `Community-Led ${template}`,
      `${template} Network`,
      `Urgent: ${template}`,
      `Join the ${template}`
    ];
    
    const title = variations[Math.floor(Math.random() * variations.length)];
    const category = categoryData.category;
    const description = this.generateDescription(title, category);
    const tags = this.generateTags(category, title);
    const location = this.regions[Math.floor(Math.random() * this.regions.length)];
    const organization = this.organizations[Math.floor(Math.random() * this.organizations.length)];
    const impactLevel = this.impactLevels[Math.floor(Math.random() * this.impactLevels.length)];
    const difficulty = this.difficulties[Math.floor(Math.random() * this.difficulties.length)];
    const timeCommitment = this.timeCommitments[Math.floor(Math.random() * this.timeCommitments.length)];
    const completionCount = this.generateCompletionCount();
    
    // Generate realistic dates
    const daysAgo = Math.floor(Math.random() * 365);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);
    const updatedAt = new Date(createdAt);
    updatedAt.setDate(updatedAt.getDate() + Math.floor(Math.random() * daysAgo));

    return {
      id: `action_${index.toString().padStart(5, '0')}`,
      title,
      description,
      category,
      tags,
      location,
      organization,
      impact_level: impactLevel,
      difficulty,
      time_commitment: timeCommitment,
      completion_count: completionCount,
      created_at: createdAt.toISOString(),
      updated_at: updatedAt.toISOString()
    };
  }

  // Batch insert actions to Supabase
  async seedActions(count: number = 10000, batchSize: number = 100): Promise<void> {
    // Production: debug output removed
    
    try {
      // Clear existing synthetic data (keep real data by checking for action_ prefix)
      const { error: deleteError } = await supabase
        .from('actions')
        .delete()
        .like('id', 'action_%');
      
      if (deleteError) {
        // Production: debug output removed
      }

      let inserted = 0;
      const totalBatches = Math.ceil(count / batchSize);

      for (let batch = 0; batch < totalBatches; batch++) {
        const batchStart = batch * batchSize;
        const batchEnd = Math.min(batchStart + batchSize, count);
        const batchActions = [];

        for (let i = batchStart; i < batchEnd; i++) {
          batchActions.push(this.generateAction(i + 1));
        }

        const { data, error } = await supabase
          .from('actions')
          .insert(batchActions);

        if (error) {
          // Production: debug output removed
          // Continue with next batch
          continue;
        }

        inserted += batchActions.length;
        const progress = Math.round((batch + 1) / totalBatches * 100);
        // Production: debug output removed
        
        // Small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Production: debug output removed
      
      // Generate summary statistics
      await this.generateSummaryStats();
      
    } catch (error) {
      // Production: debug output removed
      throw error;
    }
  }

  // Generate and log summary statistics
  private async generateSummaryStats(): Promise<void> {
    try {
      const { data: categoryStats } = await supabase
        .from('actions')
        .select('category')
        .like('id', 'action_%');

      const { data: locationStats } = await supabase
        .from('actions')
        .select('location')
        .like('id', 'action_%');

      const categoryCount = categoryStats?.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const locationCount = locationStats?.reduce((acc, item) => {
        acc[item.location] = (acc[item.location] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Production: debug output removed
      // Production: debug output removed
      // Production: debug output removed

    } catch (error) {
      // Production: debug output removed
    }
  }

  // Seed trending and popular data
  async seedTrendingData(): Promise<void> {
    // Production: debug output removed
    
    try {
      // Mark top 5% of actions as trending based on completion count
      const { data: allActions } = await supabase
        .from('actions')
        .select('id, completion_count')
        .like('id', 'action_%')
        .order('completion_count', { ascending: false });

      if (allActions && allActions.length > 0) {
        const trendingCount = Math.ceil(allActions.length * 0.05);
        const trendingIds = allActions.slice(0, trendingCount).map(a => a.id);
        
        // Update completion counts to reflect trending status
        const updatePromises = trendingIds.map(id => 
          supabase
            .from('actions')
            .update({ completion_count: Math.floor(Math.random() * 500) + 100 })
            .eq('id', id)
        );

        await Promise.all(updatePromises);
        // Production: debug output removed
      }
    } catch (error) {
      // Production: debug output removed
    }
  }
}

// Export singleton instance
export const databaseSeeder = new DatabaseSeeder();
export default databaseSeeder;

