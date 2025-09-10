import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/ui/navigation";
import { 
  Send, 
  Mic, 
  MicOff, 
  User, 
  Bot,
  Clock,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  role: "interviewer" | "candidate";
  content: string;
  timestamp: Date;
  thinking?: boolean;
}

export default function InterviewSession() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "interviewer",
      content: "你好！欢迎来到今天的面试。我是你的AI面试官，很高兴见到你。请先做一个简短的自我介绍，包括你的姓名、工作经验和为什么对这个前端工程师职位感兴趣。",
      timestamp: new Date()
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [interviewProgress, setInterviewProgress] = useState(15);
  const [currentPhase, setCurrentPhase] = useState("自我介绍");
  const [isThinking, setIsThinking] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const phases = [
    "自我介绍",
    "技术基础", 
    "项目经验",
    "问题解决",
    "反向提问"
  ];

  // Mock interview questions for demo
  const mockQuestions = [
    "能详细介绍一下你最近做的一个项目吗？遇到了什么技术挑战，是如何解决的？",
    "在团队协作中，你是如何处理意见分歧的？能举个具体例子吗？",
    "说说你对前端性能优化的理解，你在项目中是如何实践的？",
    "如果让你设计一个大型前端应用的架构，你会考虑哪些因素？",
    "你有什么问题想要问我们的吗？"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "candidate",
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput("");
    setIsThinking(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const questionIndex = Math.floor(Math.random() * mockQuestions.length);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "interviewer",
        content: mockQuestions[questionIndex],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsThinking(false);
      
      // Update progress
      setInterviewProgress(prev => Math.min(prev + 15, 90));
      
      // Update phase
      if (messages.length >= 6) {
        const currentPhaseIndex = Math.min(Math.floor(messages.length / 4), phases.length - 1);
        setCurrentPhase(phases[currentPhaseIndex]);
      }
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, you would implement voice recording here
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Interview Header */}
        <div className="bg-card rounded-2xl shadow-soft p-6 mb-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI面试进行中</h1>
                <p className="text-muted-foreground">前端工程师 • 友好型面试官</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">当前阶段</p>
                <Badge variant="default">{currentPhase}</Badge>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">剩余时间</p>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
                </div>
              </div>
              
              <div className="text-center min-w-24">
                <p className="text-sm text-muted-foreground">进度</p>
                <div className="flex items-center space-x-2">
                  <Progress value={interviewProgress} className="w-16" />
                  <span className="text-sm font-medium">{interviewProgress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              {/* Messages */}
              <CardContent className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'candidate' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                    >
                      <div className={`flex items-start space-x-3 max-w-[80%] ${
                        message.role === 'candidate' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`p-2 rounded-xl ${
                          message.role === 'candidate' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-foreground'
                        }`}>
                          {message.role === 'candidate' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        
                        <div className={`px-4 py-3 rounded-2xl ${
                          message.role === 'candidate'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.role === 'candidate' 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isThinking && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="flex items-start space-x-3 max-w-[80%]">
                        <div className="p-2 rounded-xl bg-muted text-foreground">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-muted text-foreground">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm text-muted-foreground">面试官正在思考...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              {/* Input Area */}
              <div className="p-6 border-t border-border">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="输入你的回答..."
                      className="pr-12"
                      disabled={isThinking}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                      onClick={toggleRecording}
                    >
                      {isRecording ? (
                        <MicOff className="h-4 w-4 text-error" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!currentInput.trim() || isThinking}
                    className="px-6"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {isRecording && (
                  <div className="mt-2 flex items-center justify-center">
                    <Badge variant="destructive" className="animate-pulse">
                      <div className="w-2 h-2 bg-current rounded-full mr-2"></div>
                      正在录音...
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Interview Guide */}
          <div className="lg:col-span-1 space-y-6">
            {/* Phase Progress */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">面试阶段</h3>
                <div className="space-y-3">
                  {phases.map((phase, index) => (
                    <div 
                      key={phase}
                      className={`flex items-center space-x-3 p-2 rounded-lg ${
                        phase === currentPhase ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {index < phases.indexOf(currentPhase) ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          phase === currentPhase ? 'border-primary bg-primary' : 'border-muted-foreground'
                        }`} />
                      )}
                      <span className="text-sm font-medium">{phase}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">面试小贴士</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p>保持自信，清晰表达你的想法</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p>用具体例子支撑你的回答</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p>不确定时可以要求澄清问题</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p>展示你的学习能力和成长心态</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* End Interview */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-center">面试控制</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    暂停面试
                  </Button>
                  
                  {interviewProgress >= 80 && (
                    <Link to="/interview/feedback">
                      <Button className="w-full">
                        结束面试
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                  
                  <p className="text-xs text-muted-foreground text-center">
                    面试进度达到80%后可提前结束
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}