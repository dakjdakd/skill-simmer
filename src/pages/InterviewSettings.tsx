import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/ui/navigation";
import { LoadingScreen } from "@/components/ui/loading";
import { ConfirmDialog, useConfirm } from "@/components/ui/confirm-dialog";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Settings,
  HelpCircle,
  Clock,
  Target,
  Zap
} from "lucide-react";

export default function InterviewSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const { confirm, ConfirmDialog } = useConfirm();

  const handleResetSettings = async () => {
    const confirmed = await confirm({
      title: "重置设置",
      description: "确定要重置所有面试设置为默认值吗？此操作不可撤销。",
      confirmText: "重置",
      variant: "destructive",
      onConfirm: () => {
        console.log("Settings reset confirmed");
      }
    });

    if (confirmed) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setAudioEnabled(true);
        setAutoAdvance(false);
        setDifficulty("medium");
        setIsLoading(false);
      }, 1000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <LoadingScreen title="正在重置设置..." description="请稍等片刻" />
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
            面试设置
          </h1>
          <p className="text-muted-foreground text-lg">
            个性化你的面试体验，获得最佳练习效果
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Settings Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Settings */}
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <span>基础设置</span>
                  </CardTitle>
                  <CardDescription>
                    配置面试的基本参数
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">音频反馈</h4>
                      <p className="text-sm text-muted-foreground">
                        启用语音提示和背景音效
                      </p>
                    </div>
                    <Button
                      variant={audioEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAudioEnabled(!audioEnabled)}
                    >
                      {audioEnabled ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">自动推进</h4>
                      <p className="text-sm text-muted-foreground">
                        回答完成后自动进入下一题
                      </p>
                    </div>
                    <Button
                      variant={autoAdvance ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAutoAdvance(!autoAdvance)}
                    >
                      {autoAdvance ? (
                        <Play className="h-4 w-4" />
                      ) : (
                        <Pause className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">面试难度</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "easy", label: "简单", icon: "😊", desc: "基础问题为主" },
                        { value: "medium", label: "中等", icon: "🤔", desc: "平衡基础与进阶" },
                        { value: "hard", label: "困难", icon: "🔥", desc: "深度技术挑战" }
                      ].map((option) => (
                        <div
                          key={option.value}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            difficulty === option.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/30'
                          }`}
                          onClick={() => setDifficulty(option.value)}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{option.icon}</div>
                            <h5 className="font-medium">{option.label}</h5>
                            <p className="text-xs text-muted-foreground mt-1">
                              {option.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Settings */}
              <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>高级设置</span>
                  </CardTitle>
                  <CardDescription>
                    更精细的面试体验控制
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">思考时间</h4>
                      <Badge variant="outline">30秒</Badge>
                    </div>
                    <Progress value={50} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>15秒</span>
                      <span>60秒</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">回答时长限制</h4>
                      <Badge variant="outline">3分钟</Badge>
                    </div>
                    <Progress value={60} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1分钟</span>
                      <span>5分钟</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">面试风格权重</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">技术深度</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={70} className="w-24 h-2" />
                          <span className="text-xs text-muted-foreground">70%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">沟通能力</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={80} className="w-24 h-2" />
                          <span className="text-xs text-muted-foreground">80%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">解决问题</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={90} className="w-24 h-2" />
                          <span className="text-xs text-muted-foreground">90%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                <CardHeader>
                  <CardTitle>快速操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    保存设置
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" onClick={handleResetSettings}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    重置默认
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    设置帮助
                  </Button>
                </CardContent>
              </Card>

              {/* Current Configuration */}
              <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>当前配置</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">音频</span>
                    <Badge variant={audioEnabled ? "default" : "outline"}>
                      {audioEnabled ? "开启" : "关闭"}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">难度</span>
                    <Badge variant="outline">
                      {difficulty === "easy" ? "简单" : difficulty === "medium" ? "中等" : "困难"}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">自动推进</span>
                    <Badge variant={autoAdvance ? "default" : "outline"}>
                      {autoAdvance ? "开启" : "关闭"}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">思考时间</span>
                    <Badge variant="outline">30秒</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Presets */}
              <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
                <CardHeader>
                  <CardTitle>预设方案</CardTitle>
                  <CardDescription>
                    一键应用常用配置
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start text-left">
                    <div>
                      <div className="font-medium">初学者模式</div>
                      <div className="text-xs text-muted-foreground">
                        简单难度，充足时间
                      </div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-left">
                    <div>
                      <div className="font-medium">标准面试</div>
                      <div className="text-xs text-muted-foreground">
                        中等难度，真实体验
                      </div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-left">
                    <div>
                      <div className="font-medium">高强度训练</div>
                      <div className="text-xs text-muted-foreground">
                        困难模式，时间紧迫
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog />
    </div>
  );
}