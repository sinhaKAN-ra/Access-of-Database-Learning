import { getAllDatabases } from './databaseService';
import { DatabaseType } from '@/types/database';

interface UserRequirements {
  projectType?: string;
  expectedLoad?: string;
  dataSize?: string;
  budget?: string;
  team?: string;
  performance?: string[];
  features?: string[];
  scalability?: string;
  consistency?: string;
}

interface DatabaseRecommendation {
  database: DatabaseType;
  score: number;
  reasons: string[];
  warnings: string[];
  useCaseMatch: string;
}

interface RecommendationResult {
  primary: DatabaseRecommendation;
  alternatives: DatabaseRecommendation[];
  architecture: {
    pattern: string;
    components: string[];
    scalingStrategy: string;
    backupStrategy: string;
  };
  implementation: {
    steps: string[];
    considerations: string[];
    timeline: string;
  };
  costs: {
    development: string;
    operational: string;
    scaling: string;
  };
}

export class DatabaseRecommendationEngine {
  private databases: DatabaseType[] = [];

  constructor() {
    this.loadDatabases();
  }

  private async loadDatabases() {
    this.databases = await getAllDatabases();
  }

  async generateResponse(userInput: string, requirements: UserRequirements): Promise<string> {
    const lowerInput = userInput.toLowerCase();

    // Analyze what information we still need
    const missingInfo = this.getMissingInformation(requirements);
    
    if (missingInfo.length > 0) {
      return this.generateFollowUpQuestion(userInput, requirements, missingInfo);
    }

    // If we have enough info, provide recommendations
    if (this.hasEnoughInformation(requirements)) {
      const recommendations = await this.generateRecommendations(requirements);
      return this.formatRecommendationResponse(recommendations);
    }

    return "I need a bit more information to provide the best recommendation. Could you tell me more about your specific requirements?";
  }

  private getMissingInformation(requirements: UserRequirements): string[] {
    const missing = [];
    
    if (!requirements.projectType) {
      missing.push('project type');
    }
    if (!requirements.expectedLoad) {
      missing.push('expected load');
    }
    if (!requirements.budget) {
      missing.push('budget constraints');
    }
    if (!requirements.team) {
      missing.push('team size');
    }

    return missing;
  }

  private generateFollowUpQuestion(userInput: string, requirements: UserRequirements, missingInfo: string[]): string {
    const responses = {
      'project type': [
        "What type of application are you building? (e.g., web app, mobile app, analytics dashboard, IoT system)",
        "Could you describe your project? Is it a web application, mobile app, or something else?",
      ],
      'expected load': [
        "What's your expected user load? (e.g., hundreds, thousands, millions of users)",
        "How many users do you expect to have? This helps me recommend the right scaling approach.",
      ],
      'budget constraints': [
        "Do you have any budget constraints? Are you looking for open-source solutions or is enterprise licensing okay?",
        "What's your budget situation? Are you cost-conscious or do you have enterprise-level funding?",
      ],
      'team size': [
        "How large is your development team? Are you a solo developer or part of a larger team?",
        "What's your team size? This affects the complexity of solutions I can recommend.",
      ],
    };

    const primaryMissing = missingInfo[0];
    const questions = responses[primaryMissing] || ["Could you provide more details about your requirements?"];
    const question = questions[Math.floor(Math.random() * questions.length)];

    // Add context based on what we already know
    let context = "";
    if (requirements.projectType) {
      context += `\n\nI understand you're building a ${requirements.projectType}.`;
    }
    if (requirements.expectedLoad) {
      context += ` You mentioned ${requirements.expectedLoad} load.`;
    }

    return question + context;
  }

  private hasEnoughInformation(requirements: UserRequirements): boolean {
    return !!(requirements.projectType && requirements.expectedLoad);
  }

  async generateRecommendations(requirements: UserRequirements): Promise<RecommendationResult> {
    if (this.databases.length === 0) {
      await this.loadDatabases();
    }

    // Score each database based on requirements
    const scoredDatabases = this.databases.map(db => this.scoreDatabase(db, requirements))
      .filter(scored => scored.score > 0)
      .sort((a, b) => b.score - a.score);

    const primary = scoredDatabases[0];
    const alternatives = scoredDatabases.slice(1, 4);

    // Generate architecture recommendations
    const architecture = this.generateArchitecture(primary, requirements);
    const implementation = this.generateImplementation(primary, requirements);
    const costs = this.generateCostEstimate(primary, requirements);

    return {
      primary,
      alternatives,
      architecture,
      implementation,
      costs,
    };
  }

  private scoreDatabase(database: DatabaseType, requirements: UserRequirements): DatabaseRecommendation {
    let score = 0;
    const reasons: string[] = [];
    const warnings: string[] = [];
    let useCaseMatch = "";

    // Project type scoring
    if (requirements.projectType) {
      const projectTypeScore = this.scoreProjectType(database, requirements.projectType);
      score += projectTypeScore.score;
      reasons.push(...projectTypeScore.reasons);
      warnings.push(...projectTypeScore.warnings);
      useCaseMatch = projectTypeScore.useCase;
    }

    // Load requirements scoring
    if (requirements.expectedLoad) {
      const loadScore = this.scoreLoad(database, requirements.expectedLoad);
      score += loadScore.score;
      reasons.push(...loadScore.reasons);
      warnings.push(...loadScore.warnings);
    }

    // Budget scoring
    if (requirements.budget) {
      const budgetScore = this.scoreBudget(database, requirements.budget);
      score += budgetScore.score;
      reasons.push(...budgetScore.reasons);
      warnings.push(...budgetScore.warnings);
    }

    // Team size scoring
    if (requirements.team) {
      const teamScore = this.scoreTeam(database, requirements.team);
      score += teamScore.score;
      reasons.push(...teamScore.reasons);
      warnings.push(...teamScore.warnings);
    }

    // Performance requirements
    if (requirements.performance) {
      const perfScore = this.scorePerformance(database, requirements.performance);
      score += perfScore.score;
      reasons.push(...perfScore.reasons);
      warnings.push(...perfScore.warnings);
    }

    return {
      database,
      score,
      reasons: [...new Set(reasons)], // Remove duplicates
      warnings: [...new Set(warnings)],
      useCaseMatch,
    };
  }

  private scoreProjectType(database: DatabaseType, projectType: string): { score: number; reasons: string[]; warnings: string[]; useCase: string } {
    const reasons: string[] = [];
    const warnings: string[] = [];
    let score = 0;
    let useCase = "";

    switch (projectType.toLowerCase()) {
      case 'web application':
        if (database.type === 'SQL') {
          score += 30;
          reasons.push('Excellent for web applications with structured data');
          useCase = 'Web Applications';
        } else if (database.type === 'NoSQL' && database.category === 'Document') {
          score += 25;
          reasons.push('Great for web apps with flexible data models');
          useCase = 'Web Applications';
        }
        break;

      case 'mobile application':
        if (database.type === 'NoSQL') {
          score += 30;
          reasons.push('NoSQL databases are ideal for mobile apps');
          useCase = 'Mobile Apps';
        }
        if (database.cloudOffering) {
          score += 10;
          reasons.push('Cloud offering simplifies mobile backend');
        }
        break;

      case 'analytics platform':
        if (database.category === 'Analytics' || database.category === 'Time Series') {
          score += 40;
          reasons.push('Optimized for analytical workloads');
          useCase = 'Analytics';
        } else if (database.type === 'SQL') {
          score += 20;
          reasons.push('SQL databases support complex analytical queries');
          useCase = 'Analytics';
        }
        break;

      case 'iot application':
        if (database.category === 'Time Series') {
          score += 40;
          reasons.push('Perfect for IoT sensor data');
          useCase = 'IoT Applications';
        } else if (database.type === 'NoSQL') {
          score += 25;
          reasons.push('Handles high-volume IoT data well');
          useCase = 'IoT Applications';
        }
        break;

      case 'e-commerce platform':
        if (database.type === 'SQL') {
          score += 35;
          reasons.push('ACID compliance crucial for e-commerce transactions');
          useCase = 'E-commerce';
        } else if (database.type === 'NoSQL' && database.category === 'Document') {
          score += 25;
          reasons.push('Flexible schema good for product catalogs');
          useCase = 'Catalog Management';
        }
        break;
    }

    return { score, reasons, warnings, useCase };
  }

  private scoreLoad(database: DatabaseType, expectedLoad: string): { score: number; reasons: string[]; warnings: string[] } {
    const reasons: string[] = [];
    const warnings: string[] = [];
    let score = 0;

    switch (expectedLoad.toLowerCase()) {
      case 'low':
        score += 20; // All databases can handle low load
        reasons.push('Suitable for low-traffic applications');
        break;

      case 'medium':
        if (database.features.includes('High Availability') || database.features.includes('Horizontal Scaling')) {
          score += 25;
          reasons.push('Built-in scaling features for medium load');
        } else {
          score += 15;
          warnings.push('May need optimization for medium load');
        }
        break;

      case 'high':
        if (database.features.includes('Horizontal Scaling') || database.features.includes('Sharding')) {
          score += 30;
          reasons.push('Excellent horizontal scaling capabilities');
        } else if (database.type === 'SQL') {
          score += 10;
          warnings.push('May require read replicas and careful optimization for high load');
        } else {
          score += 5;
          warnings.push('Scaling strategy needs careful planning');
        }
        break;
    }

    return { score, reasons, warnings };
  }

  private scoreBudget(database: DatabaseType, budget: string): { score: number; reasons: string[]; warnings: string[] } {
    const reasons: string[] = [];
    const warnings: string[] = [];
    let score = 0;

    switch (budget.toLowerCase()) {
      case 'limited':
        if (database.license === 'Open Source') {
          score += 30;
          reasons.push('Open source with no licensing costs');
        } else if (database.license === 'Hybrid') {
          score += 15;
          reasons.push('Free tier available');
          warnings.push('May need paid features for production');
        } else {
          score += 0;
          warnings.push('Commercial licensing may be expensive');
        }
        break;

      case 'enterprise':
        if (database.license === 'Commercial' || database.license === 'Hybrid') {
          score += 25;
          reasons.push('Enterprise support and features available');
        } else {
          score += 20;
          reasons.push('Open source with enterprise support options');
        }
        break;
    }

    return { score, reasons, warnings };
  }

  private scoreTeam(database: DatabaseType, team: string): { score: number; reasons: string[]; warnings: string[] } {
    const reasons: string[] = [];
    const warnings: string[] = [];
    let score = 0;

    switch (team.toLowerCase()) {
      case 'solo':
        if (database.cloudOffering) {
          score += 20;
          reasons.push('Managed service reduces operational overhead');
        }
        if (database.type === 'NoSQL') {
          score += 15;
          reasons.push('Simpler to get started than complex SQL setups');
        }
        break;

      case 'small':
        score += 15;
        reasons.push('Good balance of features and complexity');
        break;

      case 'large':
        if (database.license === 'Commercial' || database.license === 'Hybrid') {
          score += 20;
          reasons.push('Enterprise features and support for large teams');
        }
        score += 10;
        reasons.push('Can handle complex enterprise requirements');
        break;
    }

    return { score, reasons, warnings };
  }

  private scorePerformance(database: DatabaseType, performance: string[]): { score: number; reasons: string[]; warnings: string[] } {
    const reasons: string[] = [];
    const warnings: string[] = [];
    let score = 0;

    performance.forEach(perf => {
      switch (perf.toLowerCase()) {
        case 'high performance':
          if (database.category === 'In-Memory' || database.features.includes('High Performance')) {
            score += 25;
            reasons.push('Optimized for high performance');
          }
          break;

        case 'real-time':
          if (database.category === 'In-Memory' || database.category === 'Time Series') {
            score += 30;
            reasons.push('Excellent for real-time applications');
          }
          break;

        case 'scalability':
          if (database.features.includes('Horizontal Scaling')) {
            score += 25;
            reasons.push('Built for horizontal scaling');
          }
          break;
      }
    });

    return { score, reasons, warnings };
  }

  private generateArchitecture(primary: DatabaseRecommendation, requirements: UserRequirements): any {
    const patterns = {
      'web application': 'Three-tier architecture with load balancer',
      'mobile application': 'API-first architecture with CDN',
      'analytics platform': 'Data lake architecture with ETL pipeline',
      'iot application': 'Event-driven architecture with message queues',
      'e-commerce platform': 'Microservices architecture with CQRS',
    };

    const components = ['Application Server', 'Database', 'Cache Layer'];
    
    if (requirements.expectedLoad === 'high') {
      components.push('Load Balancer', 'Read Replicas');
    }
    
    if (requirements.projectType === 'analytics platform') {
      components.push('Data Warehouse', 'ETL Pipeline');
    }

    return {
      pattern: patterns[requirements.projectType || 'web application'] || 'Standard three-tier architecture',
      components,
      scalingStrategy: this.getScalingStrategy(primary, requirements),
      backupStrategy: this.getBackupStrategy(primary),
    };
  }

  private getScalingStrategy(primary: DatabaseRecommendation, requirements: UserRequirements): string {
    if (requirements.expectedLoad === 'high') {
      if (primary.database.features.includes('Horizontal Scaling')) {
        return 'Horizontal scaling with sharding';
      } else {
        return 'Vertical scaling with read replicas';
      }
    }
    return 'Start with single instance, scale as needed';
  }

  private getBackupStrategy(primary: DatabaseRecommendation): string {
    if (primary.database.cloudOffering) {
      return 'Automated cloud backups with point-in-time recovery';
    }
    return 'Regular automated backups with offsite storage';
  }

  private generateImplementation(primary: DatabaseRecommendation, requirements: UserRequirements): any {
    const steps = [
      'Set up development environment',
      `Install and configure ${primary.database.name}`,
      'Design database schema',
      'Implement data access layer',
      'Set up monitoring and logging',
    ];

    if (requirements.expectedLoad === 'high') {
      steps.push('Configure load balancing', 'Set up read replicas');
    }

    const considerations = [
      'Plan for data migration strategy',
      'Implement proper indexing',
      'Set up backup and recovery procedures',
    ];

    if (primary.database.type === 'NoSQL') {
      considerations.push('Design for eventual consistency');
    }

    return {
      steps,
      considerations,
      timeline: this.estimateTimeline(requirements),
    };
  }

  private estimateTimeline(requirements: UserRequirements): string {
    const baseTime = requirements.team === 'solo' ? 4 : requirements.team === 'small' ? 2 : 1;
    const complexity = requirements.expectedLoad === 'high' ? 2 : 1;
    const weeks = baseTime * complexity;
    
    return `${weeks}-${weeks + 2} weeks for initial implementation`;
  }

  private generateCostEstimate(primary: DatabaseRecommendation, requirements: UserRequirements): any {
    const development = requirements.team === 'solo' ? 'Low' : requirements.team === 'small' ? 'Medium' : 'High';
    
    let operational = 'Low';
    if (primary.database.license === 'Commercial') {
      operational = 'High';
    } else if (primary.database.cloudOffering && requirements.expectedLoad === 'high') {
      operational = 'Medium-High';
    }

    const scaling = requirements.expectedLoad === 'high' ? 'High' : 'Low-Medium';

    return {
      development,
      operational,
      scaling,
    };
  }

  private formatRecommendationResponse(recommendations: RecommendationResult): string {
    const primary = recommendations.primary;
    
    let response = `🎯 **Perfect Match Found!**\n\n`;
    response += `I recommend **${primary.database.name}** for your project.\n\n`;
    response += `**Why it's perfect for you:**\n`;
    primary.reasons.forEach(reason => {
      response += `✅ ${reason}\n`;
    });

    if (primary.warnings.length > 0) {
      response += `\n**Things to consider:**\n`;
      primary.warnings.forEach(warning => {
        response += `⚠️ ${warning}\n`;
      });
    }

    response += `\n**Architecture Pattern:** ${recommendations.architecture.pattern}\n`;
    response += `**Estimated Timeline:** ${recommendations.implementation.timeline}\n`;

    if (recommendations.alternatives.length > 0) {
      response += `\n**Alternative Options:**\n`;
      recommendations.alternatives.slice(0, 2).forEach(alt => {
        response += `• ${alt.database.name} - ${alt.reasons[0] || 'Good alternative choice'}\n`;
      });
    }

    response += `\nCheck the visualization panel for detailed architecture diagrams and implementation guidance! 📊`;

    return response;
  }

  exportToMarkdown(recommendation: RecommendationResult, requirements: UserRequirements): string {
    const primary = recommendation.primary;
    
    let markdown = `# Database Recommendation Report\n\n`;
    markdown += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    
    markdown += `## Project Requirements\n\n`;
    markdown += `- **Project Type:** ${requirements.projectType || 'Not specified'}\n`;
    markdown += `- **Expected Load:** ${requirements.expectedLoad || 'Not specified'}\n`;
    markdown += `- **Budget:** ${requirements.budget || 'Not specified'}\n`;
    markdown += `- **Team Size:** ${requirements.team || 'Not specified'}\n`;
    
    if (requirements.performance) {
      markdown += `- **Performance Requirements:** ${requirements.performance.join(', ')}\n`;
    }
    
    markdown += `\n## Primary Recommendation: ${primary.database.name}\n\n`;
    markdown += `${primary.database.description}\n\n`;
    
    markdown += `### Why This Database?\n\n`;
    primary.reasons.forEach(reason => {
      markdown += `- ${reason}\n`;
    });
    
    if (primary.warnings.length > 0) {
      markdown += `\n### Considerations\n\n`;
      primary.warnings.forEach(warning => {
        markdown += `- ${warning}\n`;
      });
    }
    
    markdown += `\n## Architecture\n\n`;
    markdown += `**Pattern:** ${recommendation.architecture.pattern}\n\n`;
    markdown += `**Components:**\n`;
    recommendation.architecture.components.forEach(component => {
      markdown += `- ${component}\n`;
    });
    
    markdown += `\n**Scaling Strategy:** ${recommendation.architecture.scalingStrategy}\n`;
    markdown += `**Backup Strategy:** ${recommendation.architecture.backupStrategy}\n`;
    
    markdown += `\n## Implementation Plan\n\n`;
    recommendation.implementation.steps.forEach((step, index) => {
      markdown += `${index + 1}. ${step}\n`;
    });
    
    markdown += `\n**Timeline:** ${recommendation.implementation.timeline}\n`;
    
    markdown += `\n## Cost Estimates\n\n`;
    markdown += `- **Development:** ${recommendation.costs.development}\n`;
    markdown += `- **Operational:** ${recommendation.costs.operational}\n`;
    markdown += `- **Scaling:** ${recommendation.costs.scaling}\n`;
    
    if (recommendation.alternatives.length > 0) {
      markdown += `\n## Alternative Options\n\n`;
      recommendation.alternatives.forEach(alt => {
        markdown += `### ${alt.database.name}\n`;
        markdown += `${alt.reasons[0] || 'Alternative option'}\n\n`;
      });
    }
    
    markdown += `\n---\n*Generated by AI Database Consultant*`;
    
    return markdown;
  }
}