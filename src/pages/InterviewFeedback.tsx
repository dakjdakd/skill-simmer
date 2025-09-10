import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/ui/navigation";
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
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

export default function InterviewFeedback() {
  const overallScore = 8.5;
  const scoreData = [
    { dimension: "逻辑清晰度", score: 9, maxScore: 10, description: "表达条理清晰，逻辑性强" },
    { dimension: "专业契合度", score: 8, maxScore: 10, description: "技能与岗位要求匹配度较高" },
    { dimension: "表达能力", score: 8, maxScore: 10, description: "语言表达流畅自然" },
    { dimension: "问题理解力", score: 9, maxScore: 10, description: "能准确理解面试官问题" },
    { dimension: "压力应对力", score: 7, maxScore: 10, description: "面对挑战性问题表现良好" }
  ];

  const strengths = [
    "技术基础扎实，对前端框架有深入理解",
    "项目经验丰富，能够详细描述技术方案",
    "学习能力强，展现了持续成长的心态",
    "团队协作意识良好，沟通表达清晰"
  ];

  const improvements = [
    "可以更多地使用具体数据来支撑你的成果",
    "在描述技术难点时，可以更深入地讲解解决思路",
    "建议准备一些行业前沿技术的相关话题",
    "可以提前准备一些有针对性的反向问题"
  ];

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary text-white text-3xl font-bold mb-4">
            {overallScore}
          </div>
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            面试反馈报告
          </h1>
          <p className="text-muted-foreground text-lg">
            前端工程师 • 2025年1月10日 • 30分钟面试
          </p>
          <Badge variant="default" className="mt-2">
            表现优秀
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overall Summary */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-warning" />
                  <span>整体表现总结</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  在本次面试中，你展现了扎实的前端技术基础和良好的表达能力。特别是在技术问题的回答上逻辑清晰，
                  项目经验描述详细，显示出了很强的实际开发能力。同时，你对新技术的学习态度和团队协作意识也给面试官
                  留下了深刻印象。建议在未来的面试中可以更多地用数据来量化你的成果，这将让你的回答更有说服力。
                </p>
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
                  本次面试中你的突出表现
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {strengths.map((strength, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-success/5 border border-success/20">
                      <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0" />
                      <p className="text-sm">{strength}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Improvements */}
            <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <span>改进建议</span>
                </CardTitle>
                <CardDescription>
                  帮助你在未来面试中表现更好的具体建议
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {improvements.map((improvement, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-warning/5 border border-warning/20">
                      <div className="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0" />
                      <p className="text-sm">{improvement}</p>
                    </div>
                  ))}
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