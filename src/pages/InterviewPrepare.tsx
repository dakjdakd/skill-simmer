import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/ui/navigation";
import { FileUpload } from "@/components/ui/file-upload";
import { 
  Upload, 
  FileText, 
  Clock, 
  User, 
  Briefcase,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Brain,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface InterviewConfig {
  jobTitle: string;
  jobDescription: string;
  interviewerStyle: string;
  duration: string;
  resumeFile: File | null;
  resumeContent: string;
  companyName: string;
  interviewType: string;
}

export default function InterviewPrepare() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<InterviewConfig>({
    jobTitle: "",
    jobDescription: "",
    interviewerStyle: "",
    duration: "",
    resumeFile: null,
    resumeContent: "",
    companyName: "",
    interviewType: "technical"
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const interviewerStyles = [
    {
      id: "strict",
      name: "严格型",
      description: "追问细节，施加适度压力，深入考察",
      icon: "🎯",
      color: "bg-error/10 text-error border-error/20",
      traits: ["注重细节", "逻辑严密", "压力测试"]
    },
    {
      id: "friendly",
      name: "友好型", 
      description: "鼓励为主，营造轻松氛围，引导表达",
      icon: "😊",
      color: "bg-success/10 text-success border-success/20",
      traits: ["温和鼓励", "轻松氛围", "引导表达"]
    },
    {
      id: "open",
      name: "开放型",
      description: "探索式提问，注重思维过程，鼓励创新",
      icon: "💡",
      color: "bg-primary/10 text-primary border-primary/20",
      traits: ["开放思维", "创新导向", "过程关注"]
    }
  ];
  
  const interviewTypes = [
    { id: "technical", name: "技术面试", description: "专业技能考察" },
    { id: "behavioral", name: "行为面试", description: "软技能评估" },
    { id: "comprehensive", name: "综合面试", description: "全面能力测试" }
  ];

  const durations = [
    { value: "15", label: "15分钟", description: "快速练习" },
    { value: "30", label: "30分钟", description: "标准面试" },
    { value: "45", label: "45分钟", description: "深度面试" }
  ];

  const handleFileUpload = (file: File, content?: string) => {
    setFormData(prev => ({
      ...prev,
      resumeFile: file,
      resumeContent: content || ""
    }));
    
    toast({
      title: "简历上传成功",
      description: `已成功上传 ${file.name}`,
    });
    
    // 模拟AI分析简历
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "简历分析完成",
        description: "AI已分析您的简历，将为您生成个性化面试问题",
      });
    }, 2000);
  };
  
  const handleFileRemove = () => {
    setFormData(prev => ({
      ...prev,
      resumeFile: null,
      resumeContent: ""
    }));
  };
  
  const isFormComplete = () => {
    return formData.jobTitle && 
           formData.jobDescription && 
           formData.interviewerStyle && 
           formData.duration && 
           formData.resumeFile;
  };
  
  const getCompletionPercentage = () => {
    let completed = 0;
    const total = 5;
    
    if (formData.resumeFile) completed++;
    if (formData.jobTitle) completed++;
    if (formData.jobDescription) completed++;
    if (formData.interviewerStyle) completed++;
    if (formData.duration) completed++;
    
    return Math.round((completed / total) * 100);
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
                    {isAnalyzing && (
                      <div className="flex items-center space-x-1 text-primary">
                        <Brain className="h-4 w-4 animate-pulse" />
                        <span className="text-sm">AI分析中...</span>
                      </div>
                    )}
                  </CardTitle>
                  <CardDescription>
                    支持PDF、Word格式，AI将智能分析你的背景信息并生成个性化面试问题
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    onFileUpload={handleFileUpload}
                    onFileRemove={handleFileRemove}
                    acceptedTypes={['.pdf', '.doc', '.docx']}
                    maxSize={10}
                  />
                  
                  {formData.resumeContent && (
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">AI分析洞察</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        检测到您有丰富的前端开发经验，AI将重点考察React、性能优化和项目管理能力。
                      </p>
                    </div>
                  )}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jobTitle">目标职位</Label>
                      <Input
                        id="jobTitle"
                        placeholder="例如：高级前端工程师"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyName">公司名称</Label>
                      <Input
                        id="companyName"
                        placeholder="例如：字节跳动"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="interviewType">面试类型</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {interviewTypes.map((type) => (
                        <div
                          key={type.id}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center ${
                            formData.interviewType === type.id
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/30'
                          }`}
                          onClick={() => setFormData({...formData, interviewType: type.id})}
                        >
                          <h4 className="font-medium text-sm">{type.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="jobDescription">职位描述 (JD) *</Label>
                    <Textarea
                      id="jobDescription"
                      placeholder="请在此处粘贴职位描述(JD)"
                      value={formData.jobDescription}
                      onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                      rows={8}
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
                          <div className="text-3xl mb-3">{style.icon}</div>
                          <h3 className="font-semibold mb-2">{style.name}</h3>
                          <p className="text-xs text-muted-foreground mb-3">
                            {style.description}
                          </p>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {style.traits.map((trait) => (
                              <Badge key={trait} variant="outline" className="text-xs px-2 py-0">
                                {trait}
                              </Badge>
                            ))}
                          </div>
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
            <div className="lg:col-span-1 space-y-6">
              {/* Progress Card */}
              <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>配置进度</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">完成度</span>
                      <span className="text-sm font-bold text-primary">{getCompletionPercentage()}%</span>
                    </div>
                    <Progress value={getCompletionPercentage()} className="h-2" />
                    
                    <div className="space-y-2 text-xs">
                      <div className={`flex items-center space-x-2 ${
                        formData.resumeFile ? 'text-success' : 'text-muted-foreground'
                      }`}>
                        <CheckCircle className={`h-3 w-3 ${
                          formData.resumeFile ? 'text-success' : 'text-muted-foreground'
                        }`} />
                        <span>上传简历</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${
                        formData.jobTitle ? 'text-success' : 'text-muted-foreground'
                      }`}>
                        <CheckCircle className={`h-3 w-3 ${
                          formData.jobTitle ? 'text-success' : 'text-muted-foreground'
                        }`} />
                        <span>设置职位信息</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${
                        formData.interviewerStyle ? 'text-success' : 'text-muted-foreground'
                      }`}>
                        <CheckCircle className={`h-3 w-3 ${
                          formData.interviewerStyle ? 'text-success' : 'text-muted-foreground'
                        }`} />
                        <span>选择面试官风格</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${
                        formData.duration ? 'text-success' : 'text-muted-foreground'
                      }`}>
                        <CheckCircle className={`h-3 w-3 ${
                          formData.duration ? 'text-success' : 'text-muted-foreground'
                        }`} />
                        <span>设置面试时长</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Configuration Summary */}
              <Card className="sticky top-24 animate-slide-up" style={{ animationDelay: "500ms" }}>
                <CardHeader>
                  <CardTitle>面试配置概览</CardTitle>
                  <CardDescription>
                    确认你的面试设置，准备开始
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">简历文件</span>
                      {formData.resumeFile ? (
                        <Badge variant="default" className="bg-success/10 text-success border-success/20">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          已上传
                        </Badge>
                      ) : (
                        <Badge variant="outline">待上传</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">目标职位</span>
                      <span className="text-sm font-medium truncate max-w-32" title={formData.jobTitle}>
                        {formData.jobTitle || "未设置"}
                      </span>
                    </div>
                    
                    {formData.companyName && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">公司</span>
                        <span className="text-sm font-medium truncate max-w-32" title={formData.companyName}>
                          {formData.companyName}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">面试类型</span>
                      <span className="text-sm font-medium">
                        {interviewTypes.find(t => t.id === formData.interviewType)?.name || "技术面试"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">面试官风格</span>
                      <span className="text-sm font-medium">
                        {interviewerStyles.find(s => s.id === formData.interviewerStyle)?.name || "未选择"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">预计时长</span>
                      <span className="text-sm font-medium">
                        {formData.duration ? `${formData.duration}分钟` : "未选择"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border space-y-3">
                    {isFormComplete() ? (
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => {
                          // Save interview config to localStorage
                          const config = {
                            jobTitle: formData.jobTitle,
                            jobDescription: formData.jobDescription,
                            resumeContent: formData.resumeContent,
                            interviewerStyle: formData.interviewerStyle,
                            companyName: formData.companyName,
                            interviewType: formData.interviewType,
                            duration: formData.duration
                          };
                          localStorage.setItem('interview_config', JSON.stringify(config));
                          
                          // Navigate to interview session
                          window.location.href = '/interview/session';
                        }}
                      >
                        开始AI面试
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        disabled={true}
                        size="lg"
                      >
                        请完成配置 ({getCompletionPercentage()}%)
                      </Button>
                    )}
                    
                    {isFormComplete() && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground text-center">
                          面试过程将被记录用于后续分析
                        </p>
                        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-3 w-3 text-success" />
                            <span>AI智能提问</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-3 w-3 text-success" />
                            <span>实时反馈</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {!isFormComplete() && (
                      <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                        <p className="text-xs text-warning text-center">
                          完成所有配置后即可开始面试练习
                        </p>
                      </div>
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