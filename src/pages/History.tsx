import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation } from "@/components/ui/navigation";
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Star, 
  Download,
  Eye,
  MessageSquare,
  TrendingUp,
  BarChart3,
  FileText,
  Bookmark,
  MoreHorizontal
} from "lucide-react";
import { format } from "date-fns";

interface InterviewRecord {
  id: string;
  position: string;
  company: string;
  date: Date;
  duration: number;
  score: number;
  status: "excellent" | "good" | "average" | "poor";
  interviewerStyle: string;
  questionsCount: number;
  isBookmarked: boolean;
  tags: string[];
}

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const mockInterviews: InterviewRecord[] = [
    {
      id: "1",
      position: "高级前端工程师",
      company: "字节跳动",
      date: new Date("2025-01-10"),
      duration: 28,
      score: 8.5,
      status: "excellent",
      interviewerStyle: "友好型",
      questionsCount: 12,
      isBookmarked: true,
      tags: ["React", "性能优化", "项目经验"]
    },
    {
      id: "2", 
      position: "前端开发工程师",
      company: "腾讯",
      date: new Date("2025-01-08"),
      duration: 25,
      score: 8.1,
      status: "good",
      interviewerStyle: "严格型",
      questionsCount: 10,
      isBookmarked: false,
      tags: ["Vue", "组件设计", "团队协作"]
    },
    {
      id: "3",
      position: "Web前端工程师", 
      company: "阿里巴巴",
      date: new Date("2025-01-06"),
      duration: 32,
      score: 7.8,
      status: "good",
      interviewerStyle: "开放型",
      questionsCount: 14,
      isBookmarked: true,
      tags: ["JavaScript", "算法", "系统设计"]
    },
    {
      id: "4",
      position: "前端技术专家",
      company: "美团",
      date: new Date("2025-01-04"),
      duration: 35,
      score: 9.1,
      status: "excellent", 
      interviewerStyle: "友好型",
      questionsCount: 15,
      isBookmarked: true,
      tags: ["Node.js", "微前端", "技术架构"]
    },
    {
      id: "5",
      position: "前端工程师",
      company: "滴滴",
      date: new Date("2025-01-02"),
      duration: 22,
      score: 6.9,
      status: "average",
      interviewerStyle: "严格型",
      questionsCount: 8,
      isBookmarked: false,
      tags: ["React", "状态管理", "性能优化"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "bg-success/10 text-success border-success/20";
      case "good": return "bg-primary/10 text-primary border-primary/20";
      case "average": return "bg-warning/10 text-warning border-warning/20";
      case "poor": return "bg-error/10 text-error border-error/20";
      default: return "bg-muted/10 text-muted-foreground border-border";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "excellent": return "优秀";
      case "good": return "良好";
      case "average": return "一般";
      case "poor": return "待改进";
      default: return "未知";
    }
  };

  const filteredInterviews = mockInterviews.filter(interview => {
    const matchesSearch = interview.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === "all") return matchesSearch;
    if (filterBy === "bookmarked") return matchesSearch && interview.isBookmarked;
    if (filterBy === "excellent") return matchesSearch && interview.status === "excellent";
    if (filterBy === "recent") {
      const isRecent = (Date.now() - interview.date.getTime()) < 7 * 24 * 60 * 60 * 1000;
      return matchesSearch && isRecent;
    }
    
    return matchesSearch;
  });

  const stats = [
    { label: "总面试次数", value: mockInterviews.length.toString(), icon: MessageSquare },
    { label: "平均得分", value: "8.1", icon: Star },
    { label: "最高得分", value: "9.1", icon: TrendingUp },
    { label: "总练习时长", value: "142分钟", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            面试历史记录
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            回顾你的面试历程，分析每次表现，持续改进提升
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 animate-slide-up" style={{ animationDelay: "400ms" }}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索职位、公司..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="recent">最近一周</SelectItem>
                    <SelectItem value="excellent">优秀表现</SelectItem>
                    <SelectItem value="bookmarked">已收藏</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">按日期</SelectItem>
                    <SelectItem value="score">按得分</SelectItem>
                    <SelectItem value="duration">按时长</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  导出
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interview Records */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Records List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredInterviews.map((interview, index) => (
              <Card 
                key={interview.id} 
                className="hover:shadow-medium transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${(index + 5) * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{interview.position}</h3>
                        {interview.isBookmarked && (
                          <Bookmark className="h-4 w-4 text-warning fill-current" />
                        )}
                      </div>
                      <p className="text-muted-foreground mb-2">{interview.company}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(interview.date, "yyyy-MM-dd")}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{interview.duration}分钟</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{interview.questionsCount}个问题</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {interview.score}
                        </div>
                        <Badge variant="outline" className={getStatusColor(interview.status)}>
                          {getStatusText(interview.status)}
                        </Badge>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {interview.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{interview.interviewerStyle}面试官</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        查看详情
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        分析报告
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredInterviews.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">暂无匹配记录</h3>
                  <p className="text-muted-foreground">
                    尝试调整搜索条件或开始新的面试练习
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="animate-slide-up" style={{ animationDelay: "600ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>表现统计</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">优秀表现</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-muted rounded-full">
                      <div className="w-2/3 h-2 bg-success rounded-full" />
                    </div>
                    <span className="text-sm font-medium">67%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">良好表现</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-muted rounded-full">
                      <div className="w-1/3 h-2 bg-primary rounded-full" />
                    </div>
                    <span className="text-sm font-medium">33%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">平均时长</span>
                  <span className="text-sm font-medium">28分钟</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">最常练习岗位</span>
                  <span className="text-sm font-medium">前端工程师</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Insights */}
            <Card className="animate-slide-up" style={{ animationDelay: "700ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>最近洞察</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <p className="text-sm font-medium text-success mb-1">进步明显</p>
                  <p className="text-xs text-muted-foreground">
                    最近3次面试平均得分提升了0.6分
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm font-medium text-primary mb-1">技能突出</p>
                  <p className="text-xs text-muted-foreground">
                    在React相关技术问题上表现优秀
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <p className="text-sm font-medium text-warning mb-1">建议练习</p>
                  <p className="text-xs text-muted-foreground">
                    可以多练习算法和系统设计相关题目
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card className="animate-slide-up" style={{ animationDelay: "800ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5 text-primary" />
                  <span>导出选项</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  导出为PDF
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  导出分析报告
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  导出对话记录
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}