// Authentication service for user management
// This module handles user authentication, registration, and session management

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'zh' | 'en';
    notifications: boolean;
  };
  stats: {
    totalInterviews: number;
    averageScore: number;
    bestScore: number;
    totalPracticeTime: number; // in minutes
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

class AuthService {
  private currentUser: User | null = null;
  private authListeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Initialize from localStorage on startup
    this.initializeAuth();
  }

  private initializeAuth() {
    try {
      const storedUser = localStorage.getItem('auth_user');
      const storedToken = localStorage.getItem('auth_token');
      
      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser);
        // Convert date strings back to Date objects
        user.createdAt = new Date(user.createdAt);
        user.lastLoginAt = new Date(user.lastLoginAt);
        
        this.currentUser = user;
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      this.clearAuth();
    }
  }

  private notifyListeners() {
    this.authListeners.forEach(listener => listener(this.currentUser));
  }

  private clearAuth() {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    this.currentUser = null;
    this.notifyListeners();
  }

  private generateMockUser(email: string, name: string): User {
    return {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      preferences: {
        theme: 'system',
        language: 'zh',
        notifications: true
      },
      stats: {
        totalInterviews: Math.floor(Math.random() * 10) + 1,
        averageScore: Math.round((Math.random() * 2 + 7) * 10) / 10,
        bestScore: Math.round((Math.random() * 1.5 + 8.5) * 10) / 10,
        totalPracticeTime: Math.floor(Math.random() * 300) + 60
      }
    };
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation - in a real app, this would be an API call
      if (!credentials.email || !credentials.password) {
        return { success: false, error: '请填写完整的登录信息' };
      }

      if (!this.isValidEmail(credentials.email)) {
        return { success: false, error: '请输入有效的邮箱地址' };
      }

      if (credentials.password.length < 6) {
        return { success: false, error: '密码长度至少6位' };
      }

      // Check if user exists in localStorage (mock database)
      const existingUsers = this.getStoredUsers();
      const existingUser = existingUsers.find(u => u.email === credentials.email);
      
      if (!existingUser) {
        return { success: false, error: '用户不存在，请先注册' };
      }

      // In a real app, you'd verify the password hash
      // For demo purposes, we'll accept any password for existing users
      
      // Update last login time
      existingUser.lastLoginAt = new Date();
      this.updateStoredUser(existingUser);
      
      // Set current user and store in localStorage
      this.currentUser = existingUser;
      const mockToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      localStorage.setItem('auth_user', JSON.stringify(existingUser));
      localStorage.setItem('auth_token', mockToken);
      
      this.notifyListeners();
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: '登录失败，请稍后重试' };
    }
  }

  async register(data: RegisterData): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validation
      if (!data.name || !data.email || !data.password || !data.confirmPassword) {
        return { success: false, error: '请填写完整的注册信息' };
      }

      if (!this.isValidEmail(data.email)) {
        return { success: false, error: '请输入有效的邮箱地址' };
      }

      if (data.password.length < 6) {
        return { success: false, error: '密码长度至少6位' };
      }

      if (data.password !== data.confirmPassword) {
        return { success: false, error: '两次输入的密码不一致' };
      }

      // Check if user already exists
      const existingUsers = this.getStoredUsers();
      if (existingUsers.some(u => u.email === data.email)) {
        return { success: false, error: '该邮箱已被注册' };
      }

      // Create new user
      const newUser = this.generateMockUser(data.email, data.name);
      
      // Store user
      existingUsers.push(newUser);
      localStorage.setItem('stored_users', JSON.stringify(existingUsers));
      
      // Set as current user
      this.currentUser = newUser;
      const mockToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      localStorage.setItem('auth_token', mockToken);
      
      this.notifyListeners();
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: '注册失败，请稍后重试' };
    }
  }

  async logout(): Promise<void> {
    this.clearAuth();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authListeners.indexOf(callback);
      if (index > -1) {
        this.authListeners.splice(index, 1);
      }
    };
  }

  async updateProfile(updates: Partial<Pick<User, 'name' | 'preferences'>>): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.currentUser) {
        return { success: false, error: '用户未登录' };
      }

      // Update current user
      this.currentUser = {
        ...this.currentUser,
        ...updates
      };

      // Update in localStorage
      localStorage.setItem('auth_user', JSON.stringify(this.currentUser));
      
      // Update in stored users
      this.updateStoredUser(this.currentUser);
      
      this.notifyListeners();
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: '更新失败，请稍后重试' };
    }
  }

  async updateStats(stats: Partial<User['stats']>): Promise<void> {
    if (!this.currentUser) return;

    this.currentUser.stats = {
      ...this.currentUser.stats,
      ...stats
    };

    localStorage.setItem('auth_user', JSON.stringify(this.currentUser));
    this.updateStoredUser(this.currentUser);
    this.notifyListeners();
  }

  private getStoredUsers(): User[] {
    try {
      const stored = localStorage.getItem('stored_users');
      if (!stored) return [];
      
      const users = JSON.parse(stored);
      // Convert date strings back to Date objects
      return users.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastLoginAt: new Date(user.lastLoginAt)
      }));
    } catch {
      return [];
    }
  }

  private updateStoredUser(updatedUser: User): void {
    const users = this.getStoredUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('stored_users', JSON.stringify(users));
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Demo method to create some sample users
  createSampleUsers(): void {
    const sampleUsers = [
      this.generateMockUser('demo@example.com', '演示用户'),
      this.generateMockUser('test@example.com', '测试用户'),
      this.generateMockUser('user@example.com', '普通用户')
    ];
    
    localStorage.setItem('stored_users', JSON.stringify(sampleUsers));
  }
}

export const authService = new AuthService();
export default authService;