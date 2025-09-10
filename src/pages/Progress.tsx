import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation } from "@/components/ui/navigation";
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
  ArrowDown
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

export default function Progress() {
  const [timeRange, setTimeRange] = useState("month");

  const progressData = [
    { date: "1/1", score: 7.2, interviews: 1 },
    { date: "1/3", score: 7.8, interviews: 1 },
    { date: "1/6", score: 8.1, interviews: 1 },
    { date: "1/8", score: 8.5, interviews: 1 },
    { date: "1/10", score: 8.5, interviews: 1 },
  ];

  const skillsData = [
    { skill: "逻辑清晰度", current: 90, previous: 75 },
    { skill: "专业契合度", current: 80, previous: 70 },
    { skill: "表达能力", current: 85, previous: 80 },
    { skill: "问题理解力", current: 90, previous: 85 },
    { skill: "压力应对力", current: 70, previous: 60 },
  ];

  const radarData = skillsData.map(skill => ({
    skill: skill.skill,
    current: skill.current,
    previous: skill.previous,
  }));

  const practiceFrequency = [
    { day: "周一", count: 2 },
    { day: "周二", count: 1 },
    { day: "周三", count: 3 },
    { day: "周四", count: 1 },
    { day: "周五", count: 2 },
    { day: "周六", count: 0 },
    { day: "周日", count: 1 },
  ];

  const achievements = [
    { 
      title: "初出茅庐", 
      description: "完成首次AI面试", 
      icon: "🎯", 
      unlocked: true, 
      date: "2025-01-01" 
    },
    { 
      title: "持之以恒", 
      description: "连续练习7天", 
      icon: "🔥", 
      unlocked: true, 
      date: "2025-01-08" 
    },
    { 
      title: "精益求精", 
      description: "单次得分超过9分", 
      icon: "⭐", 
      unlocked: false, 
      date: null 
    },
    { 
      title: "面试达人", 
      description: "完成20次面试练习", 
      icon: "🏆", 
      unlocked: false, 
      date: null 
    },
    { 
      title: "全能选手", 
      description: "所有维度得分超过8分", 
      icon: "💎", 
      unlocked: false, 
      date: null 
    },
    { 
      title: "压力克星", 
      description: "压力应对力达到9分", 
      icon: "🛡️", 
      unlocked: false, 
      date: null 
    },
  ];

  const stats = [
    { label: "总练习次数", value: "12", change: "+3", trend: "up" },
    { label: "平均得分", value: "8.2", change: "+0.5", trend: "up" },
    { label: "最高得分", value: "9.1", change: "+0.3", trend: "up" },
    { label: "本周练习", value: "3", change: "-1", trend: "down" },
  ];

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
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>得分趋势</span>
                </CardTitle>
                <CardDescription>
                  你的面试得分变化曲线
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        domain={[6, 10]}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Skills Radar */}
            <Card className="animate-slide-up" style={{ animationDelay: "500ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>能力雷达图</span>
                </CardTitle>
                <CardDescription>
                  各维度能力对比分析（当前 vs 历史平均）
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis 
                        dataKey="skill" 
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <PolarRadiusAxis 
                        domain={[0, 100]} 
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <Radar
                        name="当前水平"
                        dataKey="current"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                      <Radar
                        name="历史平均"
                        dataKey="previous"
                        stroke="hsl(var(--muted-foreground))"
                        fill="hsl(var(--muted))"
                        fillOpacity={0.1}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Practice Frequency */}
            <Card className="animate-slide-up" style={{ animationDelay: "600ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>练习频率</span>
                </CardTitle>
                <CardDescription>
                  本周的练习活跃度分布
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={practiceFrequency}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="day" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
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
                  {achievements.map((achievement, index) => (
                    <div 
                      key={achievement.title}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        achievement.unlocked 
                          ? 'border-primary/20 bg-primary/5 hover:bg-primary/10' 
                          : 'border-border bg-muted/30 opacity-60'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${
                            achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {achievement.description}
                          </p>
                          {achievement.unlocked ? (
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              已获得
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              待解锁
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
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