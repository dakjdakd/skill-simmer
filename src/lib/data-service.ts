// Data persistence service for managing interview records and user data
// This module handles local storage, data synchronization, and state management

import { User } from './auth-service';
import { AIMessage } from './ai-service';

export interface InterviewRecord {
  id: string;
  userId: string;
  jobTitle: string;
  companyName?: string;
  jobDescription: string;
  resumeContent: string;
  interviewerStyle: 'strict' | 'friendly' | 'open';
  interviewType: 'technical' | 'behavioral' | 'comprehensive';
  duration: number; // in minutes
  startTime: Date;
  endTime?: Date;
  status: 'in_progress' | 'completed' | 'abandoned';
  conversation: AIMessage[];
  feedback?: InterviewFeedback;
  tags: string[];
  isBookmarked: boolean;
  notes?: string;
}

export interface InterviewFeedback {
  overallScore: number;
  dimensionScores: {
    logicClarity: number;
    professionalFit: number;
    expressionAbility: number;
    comprehension: number;
    pressureHandling: number;
  };
  strengths: string[];
  improvements: string[];
  summary: string;
  keyMoments: {
    timestamp: string;
    type: 'highlight' | 'good' | 'improvement';
    content: string;
  }[];
  generatedAt: Date;
}

export interface UserProgress {
  userId: string;
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  bestScore: number;
  totalPracticeTime: number; // in minutes
  skillTrends: {
    date: Date;
    scores: Record<string, number>;
  }[];
  achievements: Achievement[];
  lastUpdated: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'milestone' | 'streak' | 'score' | 'special';
  condition: {
    type: string;
    value: number;
    comparison: 'gte' | 'lte' | 'eq';
  };
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'zh' | 'en';
  notifications: {
    enabled: boolean;
    email: boolean;
    browser: boolean;
    reminders: boolean;
  };
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    crashReporting: boolean;
  };
  interview: {
    autoSave: boolean;
    defaultDuration: number;
    preferredStyle: string;
    voiceEnabled: boolean;
  };
}

class DataService {
  private readonly STORAGE_KEYS = {
    INTERVIEWS: 'interview_records',
    PROGRESS: 'user_progress',
    SETTINGS: 'app_settings',
    ACHIEVEMENTS: 'achievements_data',
    CACHE: 'app_cache'
  };

  private cache = new Map<string, any>();
  private listeners = new Map<string, ((data: any) => void)[]>();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize default achievements if they don't exist
    if (!this.getAchievements().length) {
      this.initializeAchievements();
    }

    // Initialize default settings if they don't exist
    if (!this.getSettings()) {
      this.initializeSettings();
    }
  }

  // Interview Records Management
  async saveInterviewRecord(record: InterviewRecord): Promise<void> {
    try {
      const records = this.getInterviewRecords();
      const existingIndex = records.findIndex(r => r.id === record.id);
      
      if (existingIndex !== -1) {
        records[existingIndex] = record;
      } else {
        records.push(record);
      }
      
      localStorage.setItem(this.STORAGE_KEYS.INTERVIEWS, JSON.stringify(records));
      this.notifyListeners('interviews', records);
      
      // Update user progress
      if (record.status === 'completed' && record.feedback) {
        await this.updateUserProgress(record);
      }
    } catch (error) {
      console.error('Failed to save interview record:', error);
      throw new Error('保存面试记录失败');
    }
  }

  getInterviewRecords(userId?: string): InterviewRecord[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.INTERVIEWS);
      if (!stored) return [];
      
      const records = JSON.parse(stored).map((record: any) => ({
        ...record,
        startTime: new Date(record.startTime),
        endTime: record.endTime ? new Date(record.endTime) : undefined,
        conversation: record.conversation.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        feedback: record.feedback ? {
          ...record.feedback,
          generatedAt: new Date(record.feedback.generatedAt)
        } : undefined
      }));
      
      return userId ? records.filter((r: InterviewRecord) => r.userId === userId) : records;
    } catch (error) {
      console.error('Failed to get interview records:', error);
      return [];
    }
  }

  async deleteInterviewRecord(recordId: string): Promise<void> {
    try {
      const records = this.getInterviewRecords();
      const filteredRecords = records.filter(r => r.id !== recordId);
      
      localStorage.setItem(this.STORAGE_KEYS.INTERVIEWS, JSON.stringify(filteredRecords));
      this.notifyListeners('interviews', filteredRecords);
    } catch (error) {
      console.error('Failed to delete interview record:', error);
      throw new Error('删除面试记录失败');
    }
  }

  async updateInterviewBookmark(recordId: string, isBookmarked: boolean): Promise<void> {
    try {
      const records = this.getInterviewRecords();
      const record = records.find(r => r.id === recordId);
      
      if (record) {
        record.isBookmarked = isBookmarked;
        await this.saveInterviewRecord(record);
      }
    } catch (error) {
      console.error('Failed to update bookmark:', error);
      throw new Error('更新收藏状态失败');
    }
  }

  // User Progress Management
  async updateUserProgress(record: InterviewRecord): Promise<void> {
    try {
      const progress = this.getUserProgress(record.userId) || this.createDefaultProgress(record.userId);
      
      // Update basic stats
      progress.totalInterviews += 1;
      if (record.status === 'completed') {
        progress.completedInterviews += 1;
      }
      
      if (record.feedback) {
        // Update scores
        const scores = Object.values(record.feedback.dimensionScores);
        const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        
        progress.averageScore = (
          (progress.averageScore * (progress.completedInterviews - 1) + avgScore) / 
          progress.completedInterviews
        );
        
        if (avgScore > progress.bestScore) {
          progress.bestScore = avgScore;
        }
        
        // Add skill trend data
        progress.skillTrends.push({
          date: new Date(),
          scores: {
            '逻辑清晰度': record.feedback.dimensionScores.logicClarity,
            '专业契合度': record.feedback.dimensionScores.professionalFit,
            '表达能力': record.feedback.dimensionScores.expressionAbility,
            '问题理解力': record.feedback.dimensionScores.comprehension,
            '压力应对力': record.feedback.dimensionScores.pressureHandling
          }
        });
        
        // Keep only last 50 trend points
        if (progress.skillTrends.length > 50) {
          progress.skillTrends = progress.skillTrends.slice(-50);
        }
      }
      
      // Update practice time
      if (record.endTime) {
        const practiceTime = Math.round(
          (record.endTime.getTime() - record.startTime.getTime()) / (1000 * 60)
        );
        progress.totalPracticeTime += practiceTime;
      }
      
      progress.lastUpdated = new Date();
      
      localStorage.setItem(this.STORAGE_KEYS.PROGRESS, JSON.stringify([progress]));
      this.notifyListeners('progress', progress);
      
      // Check for new achievements
      await this.checkAchievements(record.userId, progress);
    } catch (error) {
      console.error('Failed to update user progress:', error);
      throw new Error('更新用户进度失败');
    }
  }

  getUserProgress(userId: string): UserProgress | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.PROGRESS);
      if (!stored) return null;
      
      const progressList = JSON.parse(stored);
      const progress = progressList.find((p: any) => p.userId === userId);
      
      if (!progress) return null;
      
      return {
        ...progress,
        skillTrends: progress.skillTrends.map((trend: any) => ({
          ...trend,
          date: new Date(trend.date)
        })),
        achievements: progress.achievements.map((achievement: any) => ({
          ...achievement,
          unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined
        })),
        lastUpdated: new Date(progress.lastUpdated)
      };
    } catch (error) {
      console.error('Failed to get user progress:', error);
      return null;
    }
  }

  private createDefaultProgress(userId: string): UserProgress {
    return {
      userId,
      totalInterviews: 0,
      completedInterviews: 0,
      averageScore: 0,
      bestScore: 0,
      totalPracticeTime: 0,
      skillTrends: [],
      achievements: [],
      lastUpdated: new Date()
    };
  }

  // Achievements Management
  private initializeAchievements(): void {
    const defaultAchievements: Achievement[] = [
      {
        id: 'first_interview',
        title: '初出茅庐',
        description: '完成首次AI面试',
        icon: '🎯',
        type: 'milestone',
        condition: { type: 'total_interviews', value: 1, comparison: 'gte' }
      },
      {
        id: 'streak_7',
        title: '持之以恒',
        description: '连续练习7天',
        icon: '🔥',
        type: 'streak',
        condition: { type: 'daily_streak', value: 7, comparison: 'gte' }
      },
      {
        id: 'high_score',
        title: '精益求精',
        description: '单次得分超过9分',
        icon: '⭐',
        type: 'score',
        condition: { type: 'single_score', value: 9, comparison: 'gte' }
      },
      {
        id: 'interview_master',
        title: '面试达人',
        description: '完成20次面试练习',
        icon: '🏆',
        type: 'milestone',
        condition: { type: 'total_interviews', value: 20, comparison: 'gte' }
      },
      {
        id: 'all_skills_high',
        title: '全能选手',
        description: '所有维度得分超过8分',
        icon: '💎',
        type: 'score',
        condition: { type: 'all_dimensions', value: 8, comparison: 'gte' }
      },
      {
        id: 'pressure_master',
        title: '压力克星',
        description: '压力应对力达到9分',
        icon: '🛡️',
        type: 'score',
        condition: { type: 'pressure_handling', value: 9, comparison: 'gte' }
      }
    ];
    
    localStorage.setItem(this.STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(defaultAchievements));
  }

  getAchievements(): Achievement[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.ACHIEVEMENTS);
      if (!stored) return [];
      
      return JSON.parse(stored).map((achievement: any) => ({
        ...achievement,
        unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined
      }));
    } catch (error) {
      console.error('Failed to get achievements:', error);
      return [];
    }
  }

  private async checkAchievements(userId: string, progress: UserProgress): Promise<void> {
    const achievements = this.getAchievements();
    const userRecords = this.getInterviewRecords(userId);
    const newUnlocks: Achievement[] = [];
    
    for (const achievement of achievements) {
      if (achievement.unlockedAt) continue; // Already unlocked
      
      let shouldUnlock = false;
      
      switch (achievement.condition.type) {
        case 'total_interviews':
          shouldUnlock = progress.totalInterviews >= achievement.condition.value;
          break;
        case 'single_score':
          shouldUnlock = progress.bestScore >= achievement.condition.value;
          break;
        case 'all_dimensions':
          const latestRecord = userRecords
            .filter(r => r.feedback)
            .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())[0];
          if (latestRecord?.feedback) {
            const scores = Object.values(latestRecord.feedback.dimensionScores);
            shouldUnlock = scores.every(score => score >= achievement.condition.value);
          }
          break;
        case 'pressure_handling':
          const bestPressureScore = Math.max(
            ...userRecords
              .filter(r => r.feedback)
              .map(r => r.feedback!.dimensionScores.pressureHandling)
          );
          shouldUnlock = bestPressureScore >= achievement.condition.value;
          break;
      }
      
      if (shouldUnlock) {
        achievement.unlockedAt = new Date();
        newUnlocks.push(achievement);
      }
    }
    
    if (newUnlocks.length > 0) {
      localStorage.setItem(this.STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      this.notifyListeners('achievements', newUnlocks);
    }
  }

  // Settings Management
  private initializeSettings(): void {
    const defaultSettings: AppSettings = {
      theme: 'system',
      language: 'zh',
      notifications: {
        enabled: true,
        email: false,
        browser: true,
        reminders: true
      },
      privacy: {
        dataCollection: true,
        analytics: true,
        crashReporting: true
      },
      interview: {
        autoSave: true,
        defaultDuration: 30,
        preferredStyle: 'friendly',
        voiceEnabled: false
      }
    };
    
    localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
  }

  getSettings(): AppSettings | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get settings:', error);
      return null;
    }
  }

  async updateSettings(settings: Partial<AppSettings>): Promise<void> {
    try {
      const currentSettings = this.getSettings() || {};
      const updatedSettings = { ...currentSettings, ...settings };
      
      localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
      this.notifyListeners('settings', updatedSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw new Error('更新设置失败');
    }
  }

  // Data Export/Import
  async exportUserData(userId: string): Promise<string> {
    try {
      const data = {
        interviews: this.getInterviewRecords(userId),
        progress: this.getUserProgress(userId),
        settings: this.getSettings(),
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export user data:', error);
      throw new Error('导出数据失败');
    }
  }

  async importUserData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.interviews || !Array.isArray(data.interviews)) {
        throw new Error('Invalid data format');
      }
      
      // Import interviews
      for (const record of data.interviews) {
        await this.saveInterviewRecord(record);
      }
      
      // Import settings if available
      if (data.settings) {
        await this.updateSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to import user data:', error);
      throw new Error('导入数据失败');
    }
  }

  // Event Listeners
  onDataChange(key: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    
    this.listeners.get(key)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(key);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private notifyListeners(key: string, data: any): void {
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Cache Management
  setCache(key: string, data: any, ttl: number = 3600000): void { // 1 hour default TTL
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl
    });
  }

  getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Utility Methods
  async clearAllData(): Promise<void> {
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      this.clearCache();
      this.initializeDefaultData();
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw new Error('清除数据失败');
    }
  }

  getStorageUsage(): { used: number; available: number; percentage: number } {
    try {
      let used = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }
      
      // Estimate available storage (5MB typical limit)
      const available = 5 * 1024 * 1024;
      const percentage = (used / available) * 100;
      
      return { used, available, percentage };
    } catch (error) {
      console.error('Failed to get storage usage:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}

export const dataService = new DataService();
export default dataService;