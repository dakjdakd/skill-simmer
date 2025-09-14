import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation } from "@/components/ui/navigation";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/auth-service";
import { dataService, InterviewRecord } from "@/lib/data-service";
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
  MoreHorizontal,
  Brain,
  AlertCircle,
  Zap,
  BookmarkPlus,
  Trash2,
  Share
} from "lucide-react";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";

export default function History() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [selectedInterview, setSelectedInterview] = useState<InterviewRecord | null>(null);
  
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setCurrentUser(user);
      if (user) {
        loadInterviews(user.id);
      } else {
        navigate('/auth');
      }
    });
    
    if (currentUser) {
      loadInterviews(currentUser.id);
    } else {
      navigate('/auth');
    }
    
    return unsubscribe;
  }, [navigate]);
  
  const loadInterviews = async (userId: string) => {
    try {
      setIsLoading(true);
      const userInterviews = dataService.getInterviewRecords(userId);
      setInterviews(userInterviews);
    } catch (error) {
      console.error('Failed to load interviews:', error);
      toast({
        title: "加载失败",
        description: "无法加载面试记录，请刷新页面重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBookmarkToggle = async (recordId: string, isBookmarked: boolean) => {
    try {
      await dataService.updateInterviewBookmark(recordId, !isBookmarked);
      setInterviews(prev => prev.map(interview => 
        interview.id === recordId 
          ? { ...interview, isBookmarked: !isBookmarked }
          : interview
      ));
      
      toast({
        title: isBookmarked ? "取消收藏" : "已收藏",
        description: isBookmarked ? "已从收藏中移除" : "已添加到收藏",
      });
    } catch (error) {
      toast({
        title: "操作失败",
        description: "收藏状态更新失败，请重试",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteInterview = async (recordId: string) => {
    try {
      await dataService.deleteInterviewRecord(recordId);
      setInterviews(prev => prev.filter(interview => interview.id !== recordId));
      
      toast({
        title: "删除成功",
        description: "面试记录已删除",
      });
    } catch (error) {
      toast({
        title: "删除失败",
        description: "无法删除面试记录，请重试",
        variant: "destructive"
      });
    }
  };
  
  const handleExportData = async () => {
    try {
      if (!currentUser) return;
      
      const exportData = await dataService.exportUserData(currentUser.id);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-records-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "导出成功",
        description: "面试记录已导出到本地文件",
      });
    } catch (error) {
      toast({
        title: "导出失败",
        description: "无法导出数据，请重试",
        variant: "destructive"
      });
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
              <h2 className="text-2xl font-bold">加载面试记录中...</h2>
              <p className="text-muted-foreground">请稍候</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper functions
  const getStatusFromScore = (score?: number): "excellent" | "good" | "average" | "poor" => {
    if (!score) return "average";
    if (score >= 8.5) return "excellent";
    if (score >= 7.5) return "good";
    if (score >= 6.5) return "average";
    return "poor";
  };
  
  const getScoreFromFeedback = (interview: InterviewRecord): number => {
    if (!interview.feedback) return 0;
    const scores = Object.values(interview.feedback.dimensionScores);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

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

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (interview.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterBy === "all") return matchesSearch;
    if (filterBy === "bookmarked") return matchesSearch && interview.isBookmarked;
    if (filterBy === "completed") return matchesSearch && interview.status === "completed";
    if (filterBy === "excellent") {
      const score = getScoreFromFeedback(interview);
      return matchesSearch && getStatusFromScore(score) === "excellent";
    }
    if (filterBy === "recent") {
      const isRecent = (Date.now() - interview.startTime.getTime()) < 7 * 24 * 60 * 60 * 1000;
      return matchesSearch && isRecent;
    }
    
    return matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case "date":
        return b.startTime.getTime() - a.startTime.getTime();
      case "score":
        return getScoreFromFeedback(b) - getScoreFromFeedback(a);
      case "duration":
        const aDuration = a.endTime ? (a.endTime.getTime() - a.startTime.getTime()) / (1000 * 60) : 0;
        const bDuration = b.endTime ? (b.endTime.getTime() - b.startTime.getTime()) / (1000 * 60) : 0;
        return bDuration - aDuration;
      default:
        return 0;
    }
  });

  const stats = [
    { label: "总面试次数", value: interviews.length.toString(), icon: MessageSquare },
    { 
      label: "平均得分", 
      value: interviews.length > 0 
        ? (interviews.reduce((sum, interview) => sum + getScoreFromFeedback(interview), 0) / interviews.length).toFixed(1)
        : "0", 
      icon: Star 
    },
    { 
      label: "最高得分", 
      value: interviews.length > 0 
        ? Math.max(...interviews.map(interview => getScoreFromFeedback(interview))).toFixed(1)
        : "0", 
      icon: TrendingUp 
    },
    { 
      label: "总练习时长", 
      value: interviews.reduce((total, interview) => {
        if (interview.endTime) {
          const duration = (interview.endTime.getTime() - interview.startTime.getTime()) / (1000 * 60);
          return total + duration;
        }
        return total;
      }, 0).toFixed(0) + "分钟", 
      icon: Clock 
    },
  ];
  
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="p-6 rounded-full bg-warning/10 text-warning">
              <AlertCircle className="h-12 w-12" />
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">请先登录</h2>
              <p className="text-muted-foreground">登录后查看您的面试历史记录</p>
              <Link to="/auth">
                <Button className="mt-4">
                  <Zap className="h-4 w-4 mr-2" />
                  立即登录
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                    <SelectItem value="completed">已完成</SelectItem>
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

                <Button variant="outline" onClick={handleExportData}>
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
            {filteredInterviews.map((interview, index) => {
              const score = getScoreFromFeedback(interview);
              const status = getStatusFromScore(score);
              const duration = interview.endTime 
                ? Math.round((interview.endTime.getTime() - interview.startTime.getTime()) / (1000 * 60))
                : interview.duration;
              
              return (
                <Card 
                  key={interview.id} 
                  className="hover:shadow-medium transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${(index + 5) * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{interview.jobTitle}</h3>
                          {interview.isBookmarked && (
                            <Bookmark className="h-4 w-4 text-warning fill-current" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {interview.status === 'completed' ? '已完成' : 
                             interview.status === 'in_progress' ? '进行中' : '已放弃'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {interview.companyName || '未指定公司'}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(interview.startTime, "yyyy-MM-dd")}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{duration}分钟</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{interview.conversation.filter(msg => msg.role === 'assistant').length}个问题</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          {interview.feedback ? (
                            <>
                              <div className="text-2xl font-bold text-primary mb-1">
                                {score.toFixed(1)}
                              </div>
                              <Badge variant="outline" className={getStatusColor(status)}>
                                {getStatusText(status)}
                              </Badge>
                            </>
                          ) : (
                            <>
                              <div className="text-lg text-muted-foreground mb-1">
                                未评分
                              </div>
                              <Badge variant="outline">
                                待分析
                              </Badge>
                            </>
                          )}
                        </div>
                        
                        <div className="flex flex-col space-y-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleBookmarkToggle(interview.id, interview.isBookmarked)}
                          >
                            {interview.isBookmarked ? (
                              <Bookmark className="h-4 w-4 text-warning fill-current" />
                            ) : (
                              <BookmarkPlus className="h-4 w-4" />
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteInterview(interview.id)}
                          >
                            <Trash2 className="h-4 w-4 text-error" />
                          </Button>
                        </div>
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
                        <span>{interview.interviewerStyle === 'strict' ? '严格型' : 
                               interview.interviewerStyle === 'friendly' ? '友好型' : '开放型'}面试官</span>
                        <span>•</span>
                        <span>{interview.interviewType === 'technical' ? '技术面试' : 
                               interview.interviewType === 'behavioral' ? '行为面试' : '综合面试'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedInterview(interview)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          查看详情
                        </Button>
                        {interview.feedback && (
                          <Link to={`/interview/feedback?id=${interview.id}`}>
                            <Button variant="outline" size="sm">
                              <BarChart3 className="h-3 w-3 mr-1" />
                              分析报告
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

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