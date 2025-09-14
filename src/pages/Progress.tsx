import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation } from "@/components/ui/navigation";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/auth-service";
import { dataService, UserProgress, Achievement } from "@/lib/data-service";
import { 
  TrendingUp, 
  Calendar, 
  Trophy, 
  Target,
  BarChart3,
  Award,
  Clock,
  CheckCircle,
  Star,
  ArrowUp,
  ArrowDown,
  Brain,
  Zap,
  AlertCircle
} from "lucide-react";
import { LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { Link, useNavigate } from "react-router-dom";

export default function Progress() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("month");
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setCurrentUser(user);
      if (user) {
        loadUserData(user.id);
      } else {
        navigate('/auth');
      }
    });
    
    if (currentUser) {
      loadUserData(currentUser.id);
    } else {
      navigate('/auth');
    }
    
    return unsubscribe;
  }, [navigate]);
  
  const loadUserData = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Load user progress
      const progress = dataService.getUserProgress(userId);
      if (progress) {
        setUserProgress(progress);
      } else {
        // Create default progress if none exists
        const defaultProgress = {
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
        setUserProgress(defaultProgress);
      }
      
      // Load achievements
      const allAchievements = dataService.getAchievements();
      setAchievements(allAchievements);
      
    } catch (error) {
      console.error('Failed to load user data:', error);
      toast({
        title: "加载失败",
        description: "无法加载进度数据，请刷新页面重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="p-6 rounded-full bg-primary/10 text-primary animate-pulse">
              <Brain className="h-12 w-12" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">加载进度数据中...</h2>
              <p className="text-muted-foreground">请稍候</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!currentUser || !userProgress) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="p-6 rounded-full bg-warning/10 text-warning">
              <AlertCircle className="h-12 w-12" />
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">暂无进度数据</h2>
              <p className="text-muted-foreground">开始您的第一次面试练习来查看进度分析</p>
              <Link to="/interview/prepare">
                <Button className="mt-4">
                  <Zap className="h-4 w-4 mr-2" />
                  开始面试练习
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Process user progress data for charts
  const progressData = userProgress.skillTrends && userProgress.skillTrends.length > 0 
    ? userProgress.skillTrends.slice(-10).map((trend, index) => {
        const avgScore = Object.values(trend.scores).reduce((sum, score) => sum + score, 0) / Object.values(trend.scores).length;
        return {
          date: trend.date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
          score: Math.round(avgScore * 10) / 10,
          interviews: 1
        };
      })
    : [
         { date: "12/20", score: 6.8, interviews: 1 },
         { date: "12/22", score: 7.2, interviews: 1 },
         { date: "12/25", score: 7.5, interviews: 1 },
         { date: "12/28", score: 7.8, interviews: 1 },
         { date: "1/2", score: 8.1, interviews: 1 },
         { date: "1/5", score: 8.3, interviews: 1 },
         { date: "1/8", score: 8.6, interviews: 1 },
         { date: "1/12", score: 8.4, interviews: 1 },
         { date: "1/15", score: 8.8, interviews: 1 },
         { date: "今天", score: 9.1, interviews: 1 },
       ];
  
  // Get latest skill scores for radar chart
  const latestSkillTrend = userProgress.skillTrends && userProgress.skillTrends.length > 0 
    ? userProgress.skillTrends[userProgress.skillTrends.length - 1]
    : null;
  const previousSkillTrend = userProgress.skillTrends && userProgress.skillTrends.length > 1
    ? userProgress.skillTrends[userProgress.skillTrends.length - 2]
    : null;
  
  const skillsData = latestSkillTrend 
    ? Object.entries(latestSkillTrend.scores).map(([skill, current]) => {
        const previous = previousSkillTrend?.scores[skill] || current * 0.8;
        return {
          skill,
          current: Math.round(current * 10),
          previous: Math.round(previous * 10)
        };
      })
    : [
         { skill: "逻辑清晰度", current: 88, previous: 78 },
         { skill: "专业契合度", current: 85, previous: 75 },
         { skill: "表达能力", current: 92, previous: 82 },
         { skill: "问题理解力", current: 90, previous: 80 },
         { skill: "压力应对力", current: 82, previous: 72 },
       ];
  
  const radarData = skillsData.map(skill => ({
    skill: skill.skill.replace('力', ''),
    current: skill.current,
    previous: skill.previous,
  }));
  
  // Generate practice frequency data (mock for now)
  const practiceFrequency = [
    { day: "周一", count: Math.floor(Math.random() * 3) + 1 },
    { day: "周二", count: Math.floor(Math.random() * 3) },
    { day: "周三", count: Math.floor(Math.random() * 4) + 1 },
    { day: "周四", count: Math.floor(Math.random() * 3) },
    { day: "周五", count: Math.floor(Math.random() * 3) + 1 },
    { day: "周六", count: Math.floor(Math.random() * 2) },
    { day: "周日", count: Math.floor(Math.random() * 2) },
  ];
  
  // Calculate statistics
  const weeklyInterviews = practiceFrequency.reduce((sum, day) => sum + day.count, 0);
  const previousWeeklyInterviews = Math.max(1, weeklyInterviews - Math.floor(Math.random() * 3));
  const weeklyChange = weeklyInterviews - previousWeeklyInterviews;
  
  const stats = [
    { 
      label: "总练习次数", 
      value: userProgress.totalInterviews.toString(), 
      change: "+" + Math.max(0, userProgress.totalInterviews - Math.floor(userProgress.totalInterviews * 0.8)), 
      trend: "up" as const
    },
    { 
      label: "平均得分", 
      value: userProgress.averageScore.toFixed(1), 
      change: "+" + (userProgress.averageScore - Math.max(6, userProgress.averageScore - 0.5)).toFixed(1), 
      trend: "up" as const
    },
    { 
      label: "最高得分", 
      value: userProgress.bestScore.toFixed(1), 
      change: "+" + (userProgress.bestScore - Math.max(7, userProgress.bestScore - 0.3)).toFixed(1), 
      trend: "up" as const
    },
    { 
      label: "本周练习", 
      value: weeklyInterviews.toString(), 
      change: (weeklyChange >= 0 ? "+" : "") + weeklyChange, 
      trend: weeklyChange >= 0 ? "up" as const : "down" as const
    },
  ];
  
  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
              进步追踪
            </h1>
            <p className="text-muted-foreground text-lg">
              详细分析你的面试能力变化和成长轨迹
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">本周</SelectItem>
                <SelectItem value="month">本月</SelectItem>
                <SelectItem value="quarter">本季度</SelectItem>
                <SelectItem value="all">全部</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              导出报告
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <div className={`flex items-center space-x-1 mt-1 ${
                      stat.trend === 'up' ? 'text-success' : 'text-error'
                    }`}>
                      {stat.trend === 'up' ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                      <span className="text-xs font-medium">{stat.change}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Score Trend */}
            <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <span>得分趋势</span>
                    </CardTitle>
                    <CardDescription>
                      你的面试得分变化曲线 • 最近{progressData.length}次面试
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {progressData.length > 0 ? progressData[progressData.length - 1].score : '0'}
                    </div>
                    <div className="text-xs text-muted-foreground">当前得分</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid 
                         strokeDasharray="3 3" 
                         stroke="#e2e8f0" 
                         strokeWidth={1}
                         opacity={0.8}
                       />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        domain={[6, 10]}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `${value}分`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                        }}
                        formatter={(value: any, name: string) => [
                          `${value}分`,
                          '面试得分'
                        ]}
                        labelFormatter={(label) => `日期: ${label}`}
                      />
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        fill="url(#areaGradient)"
                        fillOpacity={1}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={4}
                        dot={{ 
                          fill: "hsl(var(--background))", 
                          strokeWidth: 3, 
                          r: 6,
                          stroke: "hsl(var(--primary))"
                        }}
                        activeDot={{ 
                          r: 12, 
                          stroke: "hsl(var(--primary))", 
                          strokeWidth: 4,
                          fill: "hsl(var(--background))",
                          filter: "drop-shadow(0 6px 12px rgba(59, 130, 246, 0.4))"
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Trend Analysis */}
                {progressData.length >= 2 && (
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {progressData[progressData.length - 1].score > progressData[progressData.length - 2].score ? (
                          <ArrowUp className="h-4 w-4 text-success" />
                        ) : progressData[progressData.length - 1].score < progressData[progressData.length - 2].score ? (
                          <ArrowDown className="h-4 w-4 text-error" />
                        ) : (
                          <div className="h-4 w-4 rounded-full bg-muted" />
                        )}
                        <span className="text-sm font-medium">
                          {progressData[progressData.length - 1].score > progressData[progressData.length - 2].score
                            ? '持续进步中！'
                            : progressData[progressData.length - 1].score < progressData[progressData.length - 2].score
                            ? '需要加强练习'
                            : '保持稳定水平'
                          }
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        变化: {(progressData[progressData.length - 1].score - progressData[progressData.length - 2].score).toFixed(1)}分
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills Radar */}
            <Card className="animate-slide-up" style={{ animationDelay: "500ms" }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-primary" />
                      <span>能力雷达图</span>
                    </CardTitle>
                    <CardDescription>
                      各维度能力对比分析 • 当前水平 vs 历史平均
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-xs text-muted-foreground">当前水平</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full border-2 border-muted-foreground border-dashed"></div>
                      <span className="text-xs text-muted-foreground">历史平均</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                      <defs>
                         <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                           <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6}/>
                           <stop offset="70%" stopColor="#3b82f6" stopOpacity={0.3}/>
                           <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1}/>
                         </radialGradient>
                         <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                           <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                           <feMerge> 
                             <feMergeNode in="coloredBlur"/>
                             <feMergeNode in="SourceGraphic"/>
                           </feMerge>
                         </filter>
                       </defs>
                      <PolarGrid 
                         stroke="#d1d5db" 
                         strokeWidth={1.5}
                         opacity={0.7}
                         radialLines={true}
                       />
                      <PolarAngleAxis 
                        dataKey="skill" 
                        tick={{ 
                          fontSize: 13, 
                          fill: "hsl(var(--foreground))",
                          fontWeight: 500
                        }}
                        className="font-medium"
                      />
                      <PolarRadiusAxis 
                        domain={[0, 100]} 
                        tick={{ 
                          fontSize: 10, 
                          fill: "hsl(var(--muted-foreground))"
                        }}
                        tickCount={6}
                        angle={90}
                      />
                      <Radar
                         name="历史平均"
                         dataKey="previous"
                         stroke="#94a3b8"
                         fill="#94a3b8"
                         fillOpacity={0.1}
                         strokeWidth={2}
                         strokeDasharray="6 3"
                         dot={{ fill: "#94a3b8", strokeWidth: 2, r: 3 }}
                       />
                       <Radar
                         name="当前水平"
                         dataKey="current"
                         stroke="#3b82f6"
                         fill="url(#radarGradient)"
                         fillOpacity={0.4}
                         strokeWidth={4}
                         dot={{ 
                           fill: "#ffffff", 
                           strokeWidth: 3, 
                           r: 7,
                           stroke: "#3b82f6",
                           filter: "url(#glow)"
                         }}
                       />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                        }}
                        formatter={(value: any, name: string) => [
                          `${value}分`,
                          name === 'current' ? '当前水平' : '历史平均'
                        ]}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Skills Analysis */}
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-medium flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <span>能力分析</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {skillsData.map((skill, index) => {
                      const improvement = skill.current - skill.previous;
                      const improvementPercent = ((improvement / skill.previous) * 100).toFixed(1);
                      
                      return (
                        <div key={skill.skill} className="p-3 rounded-lg bg-muted/30 border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{skill.skill}</span>
                            <div className="flex items-center space-x-1">
                              {improvement > 0 ? (
                                <ArrowUp className="h-3 w-3 text-success" />
                              ) : improvement < 0 ? (
                                <ArrowDown className="h-3 w-3 text-error" />
                              ) : (
                                <div className="h-3 w-3 rounded-full bg-muted" />
                              )}
                              <span className={`text-xs font-medium ${
                                improvement > 0 ? 'text-success' : 
                                improvement < 0 ? 'text-error' : 'text-muted-foreground'
                              }`}>
                                {improvement > 0 ? '+' : ''}{improvementPercent}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>当前: {skill.current}分</span>
                            <span>平均: {skill.previous}分</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Practice Frequency */}
            <Card className="animate-slide-up" style={{ animationDelay: "600ms" }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span>练习频率</span>
                    </CardTitle>
                    <CardDescription>
                      本周的练习活跃度分布 • 总计{weeklyInterviews}次练习
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {Math.max(...practiceFrequency.map(d => d.count))}
                    </div>
                    <div className="text-xs text-muted-foreground">单日最高</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={practiceFrequency} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid 
                         strokeDasharray="3 3" 
                         stroke="#e2e8f0" 
                         strokeWidth={1}
                         opacity={0.6}
                         vertical={false}
                       />
                      <XAxis 
                        dataKey="day" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `${value}次`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                        }}
                        formatter={(value: any, name: string) => [
                          `${value}次练习`,
                          '练习次数'
                        ]}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="url(#barGradient)"
                        radius={[6, 6, 0, 0]}
                        stroke="hsl(var(--primary))"
                        strokeWidth={1}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Weekly Summary */}
                <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-primary">{weeklyInterviews}</div>
                      <div className="text-xs text-muted-foreground">本周总计</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-success">
                        {(weeklyInterviews / 7).toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">日均练习</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-warning">
                        {practiceFrequency.filter(d => d.count > 0).length}
                      </div>
                      <div className="text-xs text-muted-foreground">活跃天数</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Achievements */}
            <Card className="animate-slide-up" style={{ animationDelay: "700ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>成就徽章</span>
                </CardTitle>
                <CardDescription>
                  你的学习里程碑
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Unlocked Achievements */}
                  {unlockedAchievements.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-success flex items-center space-x-2">
                        <Trophy className="h-4 w-4" />
                        <span>已获得成就 ({unlockedAchievements.length})</span>
                      </h4>
                      {unlockedAchievements.map((achievement) => (
                        <div 
                          key={achievement.id}
                          className="p-4 rounded-xl border border-success/20 bg-success/5 hover:bg-success/10 transition-all duration-200"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">
                                {achievement.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                {achievement.description}
                              </p>
                              <div className="flex items-center space-x-2">
                                <Badge variant="default" className="bg-success/10 text-success border-success/20">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  已获得
                                </Badge>
                                {achievement.unlockedAt && (
                                  <span className="text-xs text-muted-foreground">
                                    {achievement.unlockedAt.toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Locked Achievements */}
                  {lockedAchievements.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>待解锁成就 ({lockedAchievements.length})</span>
                      </h4>
                      {lockedAchievements.slice(0, 3).map((achievement) => {
                        // Calculate progress for certain achievements
                        let progress = 0;
                        let maxProgress = achievement.condition.value;
                        
                        switch (achievement.condition.type) {
                          case 'total_interviews':
                            progress = userProgress.totalInterviews;
                            break;
                          case 'single_score':
                            progress = userProgress.bestScore;
                            maxProgress = achievement.condition.value;
                            break;
                          default:
                            progress = 0;
                        }
                        
                        const progressPercentage = Math.min((progress / maxProgress) * 100, 100);
                        
                        return (
                          <div 
                            key={achievement.id}
                            className="p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-all duration-200 opacity-80"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="text-2xl grayscale">{achievement.icon}</div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-muted-foreground">
                                  {achievement.title}
                                </h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {achievement.description}
                                </p>
                                
                                {achievement.condition.type === 'total_interviews' || achievement.condition.type === 'single_score' ? (
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-muted-foreground">
                                        进度: {progress.toFixed(achievement.condition.type === 'single_score' ? 1 : 0)} / {maxProgress}
                                      </span>
                                      <span className="font-medium">{Math.round(progressPercentage)}%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-1.5">
                                      <div 
                                        className="bg-primary h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${progressPercentage}%` }}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <Badge variant="outline">
                                    <Clock className="h-3 w-3 mr-1" />
                                    待解锁
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {lockedAchievements.length > 3 && (
                        <div className="text-center">
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            查看更多成就 ({lockedAchievements.length - 3})
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {achievements.length === 0 && (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">暂无成就数据</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Insights */}
            <Card className="animate-slide-up" style={{ animationDelay: "800ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>进步洞察</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">持续进步</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    过去一周平均得分提升了0.5分
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center space-x-2 mb-1">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">优势领域</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    逻辑清晰度是你的强项，继续保持
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-center space-x-2 mb-1">
                    <Trophy className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium text-warning">提升空间</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    压力应对力还有提升空间，多练习可以改善
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Next Goal */}
            <Card className="animate-slide-up" style={{ animationDelay: "900ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>下个目标</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="font-semibold mb-2">冲击9分大关</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    距离单次得分9分还差0.5分
                  </p>
                  <div className="w-full bg-muted rounded-full h-2 mb-3">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: '85%' }}
                    />
                  </div>
                  <Button size="sm" className="w-full">
                    开始练习
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}