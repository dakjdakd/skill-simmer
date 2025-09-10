import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/ui/navigation";
import { 
  Upload, 
  FileText, 
  Clock, 
  User, 
  Briefcase,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

export default function InterviewPrepare() {
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    interviewerStyle: "",
    duration: "",
    resumeUploaded: false
  });

  const interviewerStyles = [
    {
      id: "strict",
      name: "严格型",
      description: "追问细节，施加适度压力",
      icon: "🎯",
      color: "bg-error/10 text-error border-error/20"
    },
    {
      id: "friendly",
      name: "友好型", 
      description: "鼓励为主，营造轻松氛围",
      icon: "😊",
      color: "bg-success/10 text-success border-success/20"
    },
    {
      id: "open",
      name: "开放型",
      description: "探索式提问，鼓励创新思维",
      icon: "💡",
      color: "bg-primary/10 text-primary border-primary/20"
    }
  ];

  const durations = [
    { value: "15", label: "15分钟", description: "快速练习" },
    { value: "30", label: "30分钟", description: "标准面试" },
    { value: "45", label: "45分钟", description: "深度面试" }
  ];

  const isFormComplete = () => {
    return formData.jobTitle && 
           formData.jobDescription && 
           formData.interviewerStyle && 
           formData.duration && 
           formData.resumeUploaded;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            准备你的AI面试
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            上传简历，输入职位信息，选择面试官风格，开始你的专业面试练习
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Resume Upload */}
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5 text-primary" />
                    <span>上传简历</span>
                  </CardTitle>
                  <CardDescription>
                    支持PDF、Word格式，AI将分析你的背景信息
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                        <FileText className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="font-medium">点击上传或拖拽文件</p>
                        <p className="text-sm text-muted-foreground">
                          支持 PDF, DOC, DOCX 格式，最大 10MB
                        </p>
                      </div>
                      {formData.resumeUploaded && (
                        <Badge variant="default" className="mt-2">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          简历已上传
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Information */}
              <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <span>职位信息</span>
                  </CardTitle>
                  <CardDescription>
                    详细的职位信息有助于AI生成更精准的面试问题
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="jobTitle">目标职位</Label>
                    <Input
                      id="jobTitle"
                      placeholder="例如：前端工程师、产品经理、UI设计师"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="jobDescription">职位描述 (JD)</Label>
                    <Textarea
                      id="jobDescription"
                      placeholder="请粘贴完整的职位描述，包括岗位职责、任职要求等..."
                      value={formData.jobDescription}
                      onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                      rows={6}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Interviewer Style */}
              <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>面试官风格</span>
                  </CardTitle>
                  <CardDescription>
                    选择适合的面试官风格，体验不同的面试氛围
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {interviewerStyles.map((style) => (
                      <div
                        key={style.id}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                          formData.interviewerStyle === style.id
                            ? style.color
                            : 'border-border hover:border-primary/30'
                        }`}
                        onClick={() => setFormData({...formData, interviewerStyle: style.id})}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{style.icon}</div>
                          <h3 className="font-semibold mb-1">{style.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {style.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Duration */}
              <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>面试时长</span>
                  </CardTitle>
                  <CardDescription>
                    根据你的时间安排选择合适的面试时长
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {durations.map((duration) => (
                      <div
                        key={duration.value}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                          formData.duration === duration.value
                            ? 'bg-primary/10 text-primary border-primary/20'
                            : 'border-border hover:border-primary/30'
                        }`}
                        onClick={() => setFormData({...formData, duration: duration.value})}
                      >
                        <div className="text-center">
                          <h3 className="font-semibold text-lg mb-1">{duration.label}</h3>
                          <p className="text-sm text-muted-foreground">
                            {duration.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary & Action */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 animate-slide-up" style={{ animationDelay: "400ms" }}>
                <CardHeader>
                  <CardTitle>面试配置概览</CardTitle>
                  <CardDescription>
                    确认你的面试设置，准备开始
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">简历</span>
                      {formData.resumeUploaded ? (
                        <Badge variant="default">已上传</Badge>
                      ) : (
                        <Badge variant="outline">待上传</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">职位</span>
                      <span className="text-sm font-medium truncate max-w-24">
                        {formData.jobTitle || "未设置"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">面试官风格</span>
                      <span className="text-sm font-medium">
                        {interviewerStyles.find(s => s.id === formData.interviewerStyle)?.name || "未选择"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">时长</span>
                      <span className="text-sm font-medium">
                        {formData.duration ? `${formData.duration}分钟` : "未选择"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Link to={isFormComplete() ? "/interview/session" : "#"}>
                      <Button 
                        className="w-full" 
                        disabled={!isFormComplete()}
                        size="lg"
                      >
                        {isFormComplete() ? (
                          <>
                            开始面试
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        ) : (
                          "请完成所有配置"
                        )}
                      </Button>
                    </Link>
                    
                    {isFormComplete() && (
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        面试过程将被记录用于后续分析
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}