// Knowledge service for AI-enhanced recommendations
class KnowledgeService {
  constructor() {
    this.baseURL = '/api/knowledge';
  }

  async getResearchKnowledge(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.limit) params.set('limit', filters.limit);
    if (filters.herbId) params.set('herbId', filters.herbId);
    if (filters.diseaseId) params.set('diseaseId', filters.diseaseId);
    if (filters.verified) params.set('verified', filters.verified);

    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseURL}/research-knowledge?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to get research knowledge');
    }

    return data.data;
  }

  async getHerbalKnowledge() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseURL}/herbal-knowledge`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to get herbal knowledge');
    }

    return data.data;
  }

  async getEnhancedRecommendations(conditions, preferences = '', allergies = '') {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseURL}/ai-enhanced-recommend`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conditions,
        preferences,
        allergies
      })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to get enhanced recommendations');
    }

    return data.data;
  }

  // Analyze research trends
  analyzeResearchTrends(knowledgeBase) {
    const trends = {
      topHerbs: {},
      topConditions: {},
      researchGrowth: {},
      verifiedVsUnverified: { verified: 0, unverified: 0 }
    };

    knowledgeBase.forEach(post => {
      // Track herb popularity
      if (post.herb) {
        trends.topHerbs[post.herb.name] = (trends.topHerbs[post.herb.name] || 0) + 1;
      }

      // Track condition research
      if (post.disease) {
        trends.topConditions[post.disease.name] = (trends.topConditions[post.disease.name] || 0) + 1;
      }

      // Track research growth by month
      const month = new Date(post.publishedAt).toISOString().slice(0, 7);
      trends.researchGrowth[month] = (trends.researchGrowth[month] || 0) + 1;

      // Track verification status
      if (post.verified) {
        trends.verifiedVsUnverified.verified++;
      } else {
        trends.verifiedVsUnverified.unverified++;
      }
    });

    return {
      ...trends,
      topHerbs: Object.entries(trends.topHerbs)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10),
      topConditions: Object.entries(trends.topConditions)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10),
      researchGrowth: Object.entries(trends.researchGrowth)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12) // Last 12 months
    };
  }

  // Generate research insights
  generateInsights(knowledgeBase) {
    const insights = [];

    // Most researched herb
    const herbCounts = {};
    knowledgeBase.forEach(post => {
      if (post.herb) {
        herbCounts[post.herb.name] = (herbCounts[post.herb.name] || 0) + 1;
      }
    });

    const mostResearchedHerb = Object.entries(herbCounts)
      .sort(([,a], [,b]) => b - a)[0];

    if (mostResearchedHerb) {
      insights.push({
        type: 'most_researched',
        title: 'Most Researched Herb',
        description: `${mostResearchedHerb[0]} has ${mostResearchedHerb[1]} research studies`,
        data: mostResearchedHerb
      });
    }

    // Verification rate
    const verifiedCount = knowledgeBase.filter(post => post.verified).length;
    const verificationRate = (verifiedCount / knowledgeBase.length * 100).toFixed(1);

    insights.push({
      type: 'verification_rate',
      title: 'Research Quality',
      description: `${verificationRate}% of research is verified by experts`,
      data: { verified: verifiedCount, total: knowledgeBase.length, rate: verificationRate }
    });

    // Recent activity
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentPosts = knowledgeBase.filter(post => 
      new Date(post.publishedAt) > weekAgo
    ).length;

    insights.push({
      type: 'recent_activity',
      title: 'Recent Research Activity',
      description: `${recentPosts} new research posts this week`,
      data: { recent: recentPosts }
    });

    return insights;
  }
}

export default new KnowledgeService();
