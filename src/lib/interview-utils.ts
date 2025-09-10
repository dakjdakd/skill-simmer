// Utility functions for the AI Interview Platform

/**
 * Format duration in minutes to human readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}小时`;
  }
  
  return `${hours}小时${remainingMinutes}分钟`;
}

/**
 * Format score to display with one decimal place
 */
export function formatScore(score: number): string {
  return score.toFixed(1);
}

/**
 * Get score status based on score value
 */
export function getScoreStatus(score: number): 'excellent' | 'good' | 'average' | 'poor' {
  if (score >= 8.5) return 'excellent';
  if (score >= 7.0) return 'good';
  if (score >= 5.5) return 'average';
  return 'poor';
}

/**
 * Get status color classes
 */
export function getStatusColorClass(status: string): string {
  switch (status) {
    case 'excellent':
      return 'bg-success/10 text-success border-success/20';
    case 'good':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'average':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'poor':
      return 'bg-error/10 text-error border-error/20';
    default:
      return 'bg-muted/10 text-muted-foreground border-border';
  }
}

/**
 * Get status text in Chinese
 */
export function getStatusText(status: string): string {
  switch (status) {
    case 'excellent':
      return '优秀';
    case 'good':
      return '良好';
    case 'average':
      return '一般';
    case 'poor':
      return '待改进';
    default:
      return '未知';
  }
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(current: number, target: number): number {
  return Math.min(Math.round((current / target) * 100), 100);
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return '刚刚';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}天前`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}周前`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}个月前`;
}

/**
 * Generate random interview questions for demo
 */
export function generateMockQuestions(jobTitle: string): string[] {
  const generalQuestions = [
    "请简单介绍一下你自己。",
    "为什么对这个职位感兴趣？",
    "你认为自己最大的优势是什么？",
    "描述一个你克服困难的经历。",
    "你对我们公司了解多少？",
    "你的职业规划是什么？",
    "你如何处理工作压力？",
    "描述一次团队合作的经验。"
  ];

  const techQuestions = {
    '前端工程师': [
      "请解释一下什么是闭包？",
      "React和Vue有什么区别？",
      "如何优化网页性能？",
      "什么是响应式设计？",
      "描述一下你最满意的项目。"
    ],
    '后端工程师': [
      "解释一下RESTful API的设计原则。",
      "数据库索引的作用是什么？",
      "如何处理高并发问题？",
      "微服务架构的优缺点？",
      "描述一下你的技术栈。"
    ],
    '产品经理': [
      "如何定义产品需求的优先级？",
      "描述一个用户体验优化的案例。",
      "如何与技术团队协作？",
      "如何收集和分析用户反馈？",
      "产品迭代的流程是什么？"
    ]
  };

  const specificQuestions = techQuestions[jobTitle as keyof typeof techQuestions] || [];
  
  return [...generalQuestions, ...specificQuestions];
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('密码长度至少8位');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('密码需包含大写字母');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('密码需包含小写字母');
  }
  
  if (!/\d/.test(password)) {
    errors.push('密码需包含数字');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate achievement based on interview data
 */
export function checkNewAchievements(interviewCount: number, scores: number[]): string[] {
  const newAchievements: string[] = [];
  
  if (interviewCount === 1) {
    newAchievements.push('初出茅庐');
  }
  
  if (interviewCount === 5) {
    newAchievements.push('持之以恒');
  }
  
  if (interviewCount === 10) {
    newAchievements.push('面试达人');
  }
  
  if (scores.some(score => score >= 9)) {
    newAchievements.push('精益求精');
  }
  
  if (scores.length >= 5 && scores.slice(-5).every(score => score >= 8)) {
    newAchievements.push('稳定发挥');
  }
  
  return newAchievements;
}

/**
 * Export interview data to CSV format
 */
export function exportToCSV(data: any[], filename: string): void {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}