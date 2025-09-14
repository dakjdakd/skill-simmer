import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/ui/navigation";
import { useToast } from "@/hooks/use-toast";
import { aiInterviewService } from "@/lib/ai-service";
import { 
  Trophy, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  RotateCcw,
  Download,
  Share,
  Star,
  Target,
  Brain,
  MessageSquare,
  Users,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface FeedbackData {
  overallScore: number;
  dimensionScores: Record<string, number>;
  strengths: string[];
  improvements: string[];
  summary: string;
}

export default function InterviewFeedback() {
  const { toast } = useToast();
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    generateFeedback();
  }, []);
  
  const generateFeedback = async () => {
    try {
      setIsLoading(true);
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const feedback = await aiInterviewService.generateFeedback();
      setFeedbackData(feedback);
      
      toast({
        title: "反馈生成完成",
        description: "AI已完成面试分析，为您生成详细反馈报告",
      });
    } catch (err) {
      console.error('Failed to generate feedback:', err);
      setError('反馈生成失败，请刷新页面重试');
      toast({
        title: "生成失败",
        description: "反馈报告生成遇到问题，请稍后重试",
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
              <h2 className="text-2xl font-bold">AI正在分析你的面试表现</h2>
              <p className="text-muted-foreground">请稍候，这可能需要几秒钟...</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span className="ml-2">分析中...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !feedbackData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="p-6 rounded-full bg-error/10 text-error">
              <AlertTriangle className="h-12 w-12" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">反馈生成失败</h2>
              <p className="text-muted-foreground">{error || '未知错误'}</p>
            </div>
            <Button onClick={generateFeedback}>
              <RotateCcw className="h-4 w-4 mr-2" />
              重新生成
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const scoreData = Object.entries(feedbackData.dimensionScores).map(([dimension, score]) => ({
    dimension,
    score,
    maxScore: 10,
    description: getScoreDescription(dimension, score)
  }));
  
  const radarData = Object.entries(feedbackData.dimensionScores).map(([dimension, score]) => ({
    dimension: dimension.replace('力', ''),
    score: score * 10,
    fullMark: 100
  }));
  
  function getScoreDescription(dimension: string, score: number): string {
    const descriptions: Record<string, Record<string, string>> = {
      '逻辑清晰度': {
        high: '表达条理清晰，逻辑性强',
        medium: '逻辑基本清晰，偶有跳跃',
        low: '逻辑性有待加强'
      },
      '专业契合度': {
        high: '技能与岗位要求匹配度很高',
        medium: '基本符合岗位要求',
        low: '需要进一步提升专业技能'
      },
      '表达能力': {
        high: '语言表达流畅自然',
        medium: '表达基本清楚',
        low: '表达能力需要改进'
      },
      '问题理解力': {
        high: '能准确理解面试官问题',
        medium: '理解能力良好',
        low: '对问题理解需要加强'
      },
      '压力应对力': {
        high: '在压力下表现出色',
        medium: '面对挑战性问题表现良好',
        low: '压力应对能力有待提升'
      }
    };
    
    const level = score >= 8.5 ? 'high' : score >= 7 ? 'medium' : 'low';
    return descriptions[dimension]?.[level] || '表现良好';
  }

  const keyMoments = [
    {
      time: "03:24",
      type: "highlight",
      content: "关于React性能优化的回答非常专业，展现了深厚的技术功底"
    },
    {
      time: "08:15", 
      type: "good",
      content: "项目经验描述详细，逻辑清晰，很好地展现了解决问题的能力"
    },
    {
      time: "12:45",
      type: "improvement",
      content: "回答职业规划问题时可以更具体一些，增加时间节点"
    }
  ];
  
  const improvementTrend = [
    { session: '第1次', score: 7.2 },
    { session: '第2次', score: 7.8 },
    { session: '第3次', score: 8.1 },
    { session: '第4次', score: 8.3 },
    { session: '本次', score: feedbackData.overallScore }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-primary text-white text-4xl font-bold mb-6 shadow-large">
            {feedbackData.overallScore}
          </div>
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            AI面试反馈报告
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            高级前端工程师 • {new Date().toLocaleDateString()} • 30分钟技术面试
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="default" className={`${
              feedbackData.overallScore >= 8.5 ? 'bg-success/10 text-success border-success/20' :
              feedbackData.overallScore >= 7.5 ? 'bg-primary/10 text-primary border-primary/20' :
              'bg-warning/10 text-warning border-warning/20'
            }`}>
              {feedbackData.overallScore >= 8.5 ? '表现优秀' :
               feedbackData.overallScore >= 7.5 ? '表现良好' : '有待提升'}
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>AI智能分析</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overall Summary */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-warning" />
                  <span>AI智能分析总结</span>
                </CardTitle>
                <CardDescription>
                  基于对话内容的深度分析和多维度评估
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {feedbackData.summary}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div className="text-center p-4 rounded-lg bg-success/5 border border-success/20">
                      <Award className="h-6 w-6 text-success mx-auto mb-2" />
                      <p className="text-sm font-medium text-success">核心优势</p>
                      <p className="text-xs text-muted-foreground mt-1">{feedbackData.strengths.length}个亮点</p>
                    </div>
                    
                    <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <Target className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium text-primary">综合得分</p>
                      <p className="text-xs text-muted-foreground mt-1">{feedbackData.overallScore}/10分</p>
                    </div>
                    
                    <div className="text-center p-4 rounded-lg bg-warning/5 border border-warning/20">
                      <BookOpen className="h-6 w-6 text-warning mx-auto mb-2" />
                      <p className="text-sm font-medium text-warning">提升建议</p>
                      <p className="text-xs text-muted-foreground mt-1">{feedbackData.improvements.length}条建议</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Radar Chart */}
            <Card className="animate-slide-up" style={{ animationDelay: "50ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span>能力雷达图</span>
                </CardTitle>
                <CardDescription>
                  多维度能力评估可视化分析
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis 
                        dataKey="dimension" 
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <PolarRadiusAxis 
                        domain={[0, 100]} 
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        tickCount={6}
                      />
                      <Radar
                        name="当前能力"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.2}
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Score Breakdown */}
            <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>能力维度评分</span>
                </CardTitle>
                <CardDescription>
                  基于面试表现的多维度专业评估
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {scoreData.map((item, index) => (
                    <div key={item.dimension} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.dimension}</span>
                        <span className="text-2xl font-bold text-primary">
                          {item.score}/{item.maxScore}
                        </span>
                      </div>
                      <Progress value={item.score * 10} className="h-3" />
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Strengths */}
            <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>表现亮点</span>
                </CardTitle>
                <CardDescription>
                  AI识别出的你在本次面试中的突出表现
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedbackData.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-success/5 border border-success/20 hover:bg-success/10 transition-colors">
                      <div className="p-1 rounded-full bg-success/20 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-success" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">优势表现 #{index + 1}</p>
                        <p className="text-sm text-muted-foreground">{strength}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Improvements */}
            <Card className="animate-slide-up" style={{ animationDelay: "250ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <span>提升建议</span>
                </CardTitle>
                <CardDescription>
                  AI为你量身定制的具体改进建议
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedbackData.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-warning/5 border border-warning/20 hover:bg-warning/10 transition-colors">
                      <div className="p-1 rounded-full bg-warning/20 mt-0.5">
                        <AlertTriangle className="w-3 h-3 text-warning" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">改进建议 #{index + 1}</p>
                        <p className="text-sm text-muted-foreground">{improvement}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Progress Trend */}
            <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>进步趋势</span>
                </CardTitle>
                <CardDescription>
                  你的面试能力提升轨迹
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={improvementTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="session" 
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
                <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-primary font-medium mb-1">进步洞察</p>
                  <p className="text-xs text-muted-foreground">
                    相比首次面试，你的综合能力提升了 {(feedbackData.overallScore - 7.2).toFixed(1)} 分，
                    展现出了持续学习和改进的能力。
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Key Moments */}
            <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>关键时刻回顾</span>
                </CardTitle>
                <CardDescription>
                  面试过程中的重要节点分析
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {keyMoments.map((moment, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-center w-12 h-8 rounded-md bg-muted text-sm font-mono">
                        {moment.time}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {moment.type === 'highlight' && <Trophy className="h-4 w-4 text-warning" />}
                          {moment.type === 'good' && <CheckCircle className="h-4 w-4 text-success" />}
                          {moment.type === 'improvement' && <AlertTriangle className="h-4 w-4 text-warning" />}
                          <Badge variant={
                            moment.type === 'highlight' ? 'default' : 
                            moment.type === 'good' ? 'default' : 'outline'
                          }>
                            {moment.type === 'highlight' ? '精彩表现' : 
                             moment.type === 'good' ? '表现良好' : '可以改进'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {moment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="animate-slide-up" style={{ animationDelay: "500ms" }}>
              <CardHeader>
                <CardTitle>后续行动</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/interview/prepare">
                  <Button className="w-full">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    再练一次
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  下载报告
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Share className="h-4 w-4 mr-2" />
                  分享结果
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="animate-slide-up" style={{ animationDelay: "600ms" }}>
              <CardHeader>
                <CardTitle>本次面试数据</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">面试时长</span>
                  </div>
                  <span className="font-semibold">28分32秒</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">问答轮次</span>
                  </div>
                  <span className="font-semibold">12轮</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">平均回答时长</span>
                  </div>
                  <span className="font-semibold">1分45秒</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">面试官风格</span>
                  </div>
                  <span className="font-semibold">友好型</span>
                </div>
              </CardContent>
            </Card>

            {/* Historical Comparison */}
            <Card className="animate-slide-up" style={{ animationDelay: "700ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>进步对比</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">与上次相比</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3 text-success" />
                      <span className="text-success text-sm font-medium">+0.8分</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">历史最高</span>
                    <span className="text-sm font-medium">9.1分</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">平均得分</span>
                    <span className="text-sm font-medium">8.2分</span>
                  </div>
                  
                  <div className="pt-3 border-t border-border">
                    <Link to="/progress">
                      <Button variant="outline" size="sm" className="w-full">
                        查看详细进步分析
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}