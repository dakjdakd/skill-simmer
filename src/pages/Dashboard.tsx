import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/ui/navigation";
import { 
  BrainCircuit, 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  Award,
  PlayCircle,
  History
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const stats = [
    { label: "总练习次数", value: "12", icon: BrainCircuit, color: "text-primary" },
    { label: "平均得分", value: "8.2", icon: Trophy, color: "text-warning" },
    { label: "本周练习", value: "3", icon: Target, color: "text-success" },
    { label: "总时长", value: "4.5h", icon: Clock, color: "text-secondary" },
  ];

  const recentInterviews = [
    { 
      id: 1, 
      position: "前端工程师", 
      score: 8.5, 
      date: "2025-01-08", 
      status: "excellent" 
    },
    { 
      id: 2, 
      position: "产品经理", 
      score: 7.2, 
      date: "2025-01-06", 
      status: "good" 
    },
    { 
      id: 3, 
      position: "UI设计师", 
      score: 9.1, 
      date: "2025-01-04", 
      status: "excellent" 
    },
  ];

  const achievements = [
    { name: "初出茅庐", description: "完成首次面试", unlocked: true },
    { name: "持之以恒", description: "连续练习7天", unlocked: true },
    { name: "精益求精", description: "单次得分超过9分", unlocked: true },
    { name: "面试达人", description: "完成10次面试", unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            欢迎回来！继续你的面试之旅
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            通过AI智能模拟面试，提升你的面试技能，收获理想工作机会
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="hover:shadow-medium transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PlayCircle className="h-5 w-5 text-primary" />
                  <span>快速开始</span>
                </CardTitle>
                <CardDescription>
                  选择你想要的面试类型，立即开始练习
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to="/interview/prepare">
                    <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                            <BrainCircuit className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold">模拟面试</h3>
                            <p className="text-sm text-muted-foreground">
                              AI智能面试官，真实体验
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link to="/progress">
                    <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 rounded-xl bg-secondary/10 text-secondary group-hover:scale-110 transition-transform">
                            <TrendingUp className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold">能力分析</h3>
                            <p className="text-sm text-muted-foreground">
                              查看详细的能力提升报告
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Interviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5 text-primary" />
                  <span>最近面试</span>
                </CardTitle>
                <CardDescription>
                  查看你最近的面试记录和表现
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInterviews.map((interview) => (
                    <div key={interview.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <BrainCircuit className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{interview.position}</p>
                          <p className="text-sm text-muted-foreground">{interview.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={interview.status === "excellent" ? "default" : "secondary"}>
                          {interview.score}分
                        </Badge>
                        <Button variant="ghost" size="sm">
                          查看详情
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements & Progress */}
          <div className="space-y-8">
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>本周目标</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>面试练习</span>
                      <span>3/5</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>平均得分目标</span>
                      <span>8.2/8.5</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>成就徽章</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.name} 
                      className={`flex items-center space-x-3 p-3 rounded-lg border ${
                        achievement.unlocked 
                          ? 'border-primary/20 bg-primary/5' 
                          : 'border-border bg-muted/30'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        achievement.unlocked 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Trophy className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {achievement.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}