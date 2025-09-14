import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/ui/navigation";
import { useToast } from "@/hooks/use-toast";
import { aiInterviewService, AIMessage, InterviewContext } from "@/lib/ai-service";
import { 
  Send, 
  Mic, 
  MicOff, 
  User, 
  Bot,
  Clock,
  CheckCircle,
  ArrowRight,
  Pause,
  Play,
  AlertCircle,
  Lightbulb,
  Brain
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Message {
  id: string;
  role: "interviewer" | "candidate";
  content: string;
  timestamp: Date;
  thinking?: boolean;
}

interface InterviewState {
  isActive: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  startTime: Date | null;
  endTime: Date | null;
}

export default function InterviewSession() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [interviewState, setInterviewState] = useState<InterviewState>({
    isActive: false,
    isPaused: false,
    isCompleted: false,
    startTime: null,
    endTime: null
  });
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes default
  const [currentPhase, setCurrentPhase] = useState("准备中");
  const [interviewProgress, setInterviewProgress] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showEndButton, setShowEndButton] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const phases = [
    "准备中",
    "自我介绍",
    "技术基础", 
    "项目经验",
    "深度探讨",
    "反向提问",
    "面试总结"
  ];
  
  // Get interview context from URL params or localStorage
  const getInterviewContext = (): InterviewContext => {
    try {
      // Try to get from localStorage first (from prepare page)
      const storedConfig = localStorage.getItem('interview_config');
      if (storedConfig) {
        const config = JSON.parse(storedConfig);
        return {
          jobTitle: config.jobTitle || "前端工程师",
          jobDescription: config.jobDescription || "负责前端开发工作",
          resumeContent: config.resumeContent || "待上传简历",
          interviewerStyle: config.interviewerStyle || "friendly",
          companyName: config.companyName || "目标公司",
          interviewType: config.interviewType || "technical",
          duration: parseInt(config.duration) || 30
        };
      }
    } catch (error) {
      console.error('Failed to parse interview config:', error);
    }
    
    // Fallback to default context
    return {
      jobTitle: "前端工程师",
      jobDescription: "负责前端架构设计和核心功能开发，要求熟练掌握React、TypeScript等技术栈",
      resumeContent: "请先在面试准备页面上传简历",
      interviewerStyle: "friendly",
      companyName: "目标公司",
      interviewType: "technical",
      duration: 30
    };
  };
  
  const interviewContext = getInterviewContext();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (interviewState.isActive && !interviewState.isPaused) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleInterviewComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [interviewState.isActive, interviewState.isPaused]);
  
  useEffect(() => {
    initializeInterview();
  }, []);
  
  const initializeInterview = async () => {
    try {
      // Initialize AI service with interview context
      aiInterviewService.setInterviewContext(interviewContext);
      
      setInterviewState(prev => ({
        ...prev,
        isActive: true,
        startTime: new Date()
      }));
      
      setCurrentPhase("自我介绍");
      setTimeRemaining(interviewContext.duration * 60);
      
      // Get initial greeting from AI
      setIsThinking(true);
      const response = await aiInterviewService.sendMessage("开始面试");
      
      setMessages([{
        id: "1",
        role: "interviewer",
        content: response.content,
        timestamp: new Date()
      }]);
      
      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }
      
      setIsThinking(false);
      setInterviewProgress(10);
      
    } catch (error) {
      console.error('Failed to initialize interview:', error);
      setError('面试初始化失败，请刷新页面重试');
      toast({
        title: "初始化失败",
        description: "面试系统遇到问题，请稍后重试",
        variant: "destructive"
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-advance interview phases based on conversation progress and duration
  const updateInterviewPhase = (messageCount: number) => {
    const currentPhaseIndex = phases.indexOf(currentPhase);
    let newPhaseIndex = currentPhaseIndex;
    
    // 根据面试时长动态调整阶段推进节奏
    const duration = interviewContext.duration;
    let phaseThresholds: number[];
    
    if (duration <= 15) {
      // 15分钟面试：快速推进
      phaseThresholds = [1, 2, 3, 4, 5, 6]; // 每1-2个问题推进一个阶段
    } else if (duration <= 30) {
      // 30分钟面试：适中推进
      phaseThresholds = [2, 4, 6, 8, 9, 10]; // 每2个问题推进一个阶段
    } else {
      // 45-60分钟面试：缓慢推进
      phaseThresholds = [3, 6, 10, 14, 17, 20]; // 每3-4个问题推进一个阶段
    }
    
    // Phase progression logic based on dynamic thresholds
    for (let i = 0; i < phaseThresholds.length; i++) {
      if (messageCount >= phaseThresholds[i] && currentPhaseIndex < i + 1) {
        newPhaseIndex = i + 1;
        break;
      }
    }
    
    if (newPhaseIndex > currentPhaseIndex) {
      const newPhase = phases[newPhaseIndex];
      setCurrentPhase(newPhase);
      setInterviewProgress(Math.min((newPhaseIndex / (phases.length - 1)) * 90, 90));
      
      // 使用setTimeout避免在渲染期间调用toast
      setTimeout(() => {
        toast({
          title: "面试阶段更新",
          description: `已进入「${newPhase}」阶段`,
        });
      }, 0);
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isThinking || !interviewState.isActive) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "candidate",
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      // Update phase based on message count (only count AI responses)
      const aiMessageCount = newMessages.filter(m => m.role === 'interviewer').length;
      updateInterviewPhase(aiMessageCount);
      return newMessages;
    });
    
    setCurrentInput("");
    setIsThinking(true);
    setError(null);

    try {
      const response = await aiInterviewService.sendMessage(currentInput);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "interviewer",
        content: response.content,
        timestamp: new Date()
      };

      setMessages(prev => {
        const newMessages = [...prev, aiResponse];
        // Update phase based on AI message count
        const aiMessageCount = newMessages.filter(m => m.role === 'interviewer').length;
        updateInterviewPhase(aiMessageCount);
        return newMessages;
      });
      
      // Update interview state based on AI response (fallback)
      if (response.nextPhase) {
        const phaseIndex = phases.indexOf(response.nextPhase);
        if (phaseIndex !== -1) {
          setCurrentPhase(response.nextPhase);
          setInterviewProgress(Math.min((phaseIndex / (phases.length - 1)) * 90, 90));
        }
      }
      
      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }
      
      if (response.shouldShowEndButton) {
        setShowEndButton(true);
      }
      
      if (response.isComplete) {
        handleInterviewComplete();
      }
      
      if (response.error) {
        setError(response.error);
        toast({
          title: "AI响应异常",
          description: response.error,
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('消息发送失败，请重试');
      toast({
        title: "发送失败",
        description: "消息发送遇到问题，请检查网络连接",
        variant: "destructive"
      });
    } finally {
      setIsThinking(false);
    }
  };
  
  const handleEndInterview = () => {
    // 调用AI服务的完成面试方法
    aiInterviewService.completeInterview();
    setShowEndButton(false);
    handleInterviewComplete();
  };
  
  const handleInterviewComplete = () => {
    setInterviewState(prev => ({
      ...prev,
      isActive: false,
      isCompleted: true,
      endTime: new Date()
    }));
    
    setCurrentPhase("面试完成");
    setInterviewProgress(100);
    
    toast({
      title: "面试完成",
      description: "恭喜完成面试！正在生成反馈报告...",
    });
    
    // Navigate to feedback page after a short delay
    setTimeout(() => {
      navigate('/interview/feedback');
    }, 2000);
  };
  
  const handlePauseResume = () => {
    setInterviewState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
    
    toast({
      title: interviewState.isPaused ? "面试已恢复" : "面试已暂停",
      description: interviewState.isPaused ? "继续你的面试" : "面试已暂停，点击恢复继续"
    });
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
                <p className="text-muted-foreground">
                  {interviewContext.jobTitle} • 
                  {interviewContext.interviewerStyle === 'strict' ? '严格型' : 
                   interviewContext.interviewerStyle === 'friendly' ? '友好型' : '开放型'}面试官
                  {interviewContext.companyName && ` • ${interviewContext.companyName}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">当前阶段</p>
                <Badge variant={interviewState.isActive ? "default" : "outline"}>
                  {currentPhase}
                </Badge>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">剩余时间</p>
                <div className="flex items-center space-x-2">
                  <Clock className={`h-4 w-4 ${
                    timeRemaining < 300 ? 'text-error' : 'text-muted-foreground'
                  }`} />
                  <span className={`font-mono font-bold ${
                    timeRemaining < 300 ? 'text-error' : 'text-foreground'
                  }`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
              
              <div className="text-center min-w-24">
                <p className="text-sm text-muted-foreground">进度</p>
                <div className="flex items-center space-x-2">
                  <Progress value={interviewProgress} className="w-16" />
                  <span className="text-sm font-medium">{interviewProgress}%</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePauseResume}
                  disabled={interviewState.isCompleted}
                >
                  {interviewState.isPaused ? (
                    <><Play className="h-4 w-4 mr-1" />恢复</>
                  ) : (
                    <><Pause className="h-4 w-4 mr-1" />暂停</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              {/* Messages */}
              <CardContent className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-background to-muted/20">
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'candidate' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`flex items-end space-x-3 max-w-[75%] ${
                        message.role === 'candidate' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        {/* Avatar */}
                        <div className={`relative flex-shrink-0 ${
                          message.role === 'candidate' ? 'ml-2' : 'mr-2'
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                            message.role === 'candidate' 
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                              : 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                          }`}>
                            {message.role === 'candidate' ? (
                              <User className="h-5 w-5" />
                            ) : (
                              <Bot className="h-5 w-5" />
                            )}
                          </div>
                          {/* Online indicator for AI */}
                          {message.role === 'interviewer' && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>
                        
                        {/* Message Bubble */}
                        <div className="relative group">
                          <div className={`px-5 py-4 rounded-3xl shadow-md transition-all duration-200 hover:shadow-lg ${
                            message.role === 'candidate'
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-lg'
                              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-lg'
                          }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            
                            {/* Timestamp */}
                            <div className={`flex items-center justify-end mt-2 space-x-1 ${
                              message.role === 'candidate' 
                                ? 'text-blue-100' 
                                : 'text-gray-500'
                            }`}>
                              <Clock className="h-3 w-3" />
                              <span className="text-xs font-medium">
                                {message.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                              {/* Read indicator for user messages */}
                              {message.role === 'candidate' && (
                                <CheckCircle className="h-3 w-3 text-blue-200" />
                              )}
                            </div>
                          </div>
                          
                          {/* Message tail */}
                          <div className={`absolute top-4 w-0 h-0 ${
                            message.role === 'candidate'
                              ? 'right-0 translate-x-1 border-l-8 border-l-blue-500 border-t-8 border-t-transparent border-b-8 border-b-transparent'
                              : 'left-0 -translate-x-1 border-r-8 border-r-white border-t-8 border-t-transparent border-b-8 border-b-transparent'
                          }`}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isThinking && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="flex items-end space-x-3 max-w-[75%] mr-2">
                        {/* AI Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                            <Bot className="h-5 w-5" />
                          </div>
                          {/* Thinking indicator */}
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                          </div>
                        </div>
                        
                        {/* Thinking Bubble */}
                        <div className="relative group">
                          <div className="px-5 py-4 rounded-3xl shadow-md bg-white border border-gray-200 text-gray-800 rounded-bl-lg">
                            <div className="flex items-center space-x-3">
                              <div className="flex space-x-1">
                                <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce"></div>
                                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-sm text-gray-600 font-medium">AI面试官正在思考...</span>
                              <Brain className="h-4 w-4 text-purple-500 animate-pulse" />
                            </div>
                          </div>
                          
                          {/* Message tail */}
                          <div className="absolute top-4 left-0 -translate-x-1 w-0 h-0 border-r-8 border-r-white border-t-8 border-t-transparent border-b-8 border-b-transparent"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              {/* Input Area */}
              <div className="p-6 border-t border-border bg-gradient-to-r from-background to-muted/10">
                {error && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl flex items-center space-x-3 shadow-sm">
                    <div className="p-1 rounded-full bg-red-500 text-white">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-red-700 flex-1">{error}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setError(null)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      ×
                    </Button>
                  </div>
                )}
                
                {interviewState.isPaused && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-100 border border-yellow-200 rounded-xl flex items-center justify-center space-x-3 shadow-sm">
                    <div className="p-1 rounded-full bg-yellow-500 text-white">
                      <Pause className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-yellow-700 font-medium">面试已暂停</p>
                  </div>
                )}
                
                <div className="flex items-end space-x-4">
                  <div className="flex-1 relative">
                    <div className="relative">
                      <Input
                        ref={inputRef}
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={interviewState.isPaused ? "面试已暂停..." : "输入你的回答，按Enter发送..."}
                        className="pr-14 pl-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm"
                        disabled={isThinking || interviewState.isPaused || interviewState.isCompleted}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0 transition-all duration-200 ${
                          isRecording 
                            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={toggleRecording}
                        disabled={interviewState.isPaused || interviewState.isCompleted}
                      >
                        {isRecording ? (
                          <MicOff className="h-4 w-4" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Character count */}
                    <div className="flex justify-between items-center mt-2 px-2">
                      <span className="text-xs text-gray-400">
                        {currentInput.length > 0 && `${currentInput.length} 字符`}
                      </span>
                      <span className="text-xs text-gray-400">
                        Shift + Enter 换行
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    {showEndButton && (
                      <Button 
                        onClick={handleEndInterview}
                        className="px-6 py-3 rounded-2xl shadow-lg transition-all duration-200 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-200 hover:shadow-green-300 hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">结束面试</span>
                        </div>
                      </Button>
                    )}
                    
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!currentInput.trim() || isThinking || interviewState.isPaused || interviewState.isCompleted || showEndButton}
                      className={`px-6 py-3 rounded-2xl shadow-lg transition-all duration-200 ${
                        !currentInput.trim() || isThinking || interviewState.isPaused || interviewState.isCompleted || showEndButton
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-blue-200 hover:shadow-blue-300 hover:shadow-lg transform hover:-translate-y-0.5'
                      }`}
                    >
                      {isThinking ? (
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4 animate-pulse" />
                          <span className="text-sm">处理中</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Send className="h-4 w-4" />
                          <span className="text-sm font-medium">{showEndButton ? '等待结束' : '发送'}</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
                
                {isRecording && (
                  <div className="mt-2 flex items-center justify-center">
                    <Badge variant="destructive" className="animate-pulse">
                      <div className="w-2 h-2 bg-current rounded-full mr-2"></div>
                      正在录音...
                    </Badge>
                  </div>
                )}
                
                {suggestions.length > 0 && !interviewState.isPaused && (
                  <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">回答建议</span>
                    </div>
                    <div className="space-y-1">
                      {suggestions.map((suggestion, index) => (
                        <p key={index} className="text-xs text-muted-foreground">• {suggestion}</p>
                      ))}
                    </div>
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

            {/* Interview Control */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-center">面试控制</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handlePauseResume}
                    disabled={interviewState.isCompleted}
                  >
                    {interviewState.isPaused ? (
                      <><Play className="h-4 w-4 mr-2" />恢复面试</>
                    ) : (
                      <><Pause className="h-4 w-4 mr-2" />暂停面试</>
                    )}
                  </Button>
                  
                  {(interviewProgress >= 70 || interviewState.isCompleted) && (
                    <Button 
                      className="w-full"
                      onClick={handleInterviewComplete}
                      disabled={interviewState.isCompleted}
                    >
                      {interviewState.isCompleted ? (
                        <>面试已完成</>
                      ) : (
                        <>结束面试<ArrowRight className="h-4 w-4 ml-2" /></>
                      )}
                    </Button>
                  )}
                  
                  <p className="text-xs text-muted-foreground text-center">
                    {interviewState.isCompleted 
                      ? "正在生成反馈报告..."
                      : "面试进度达到70%后可提前结束"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* AI Status */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-center flex items-center justify-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span>AI面试官状态</span>
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">连接状态</span>
                    <Badge variant="default" className="bg-success/10 text-success border-success/20">
                      <div className="w-2 h-2 bg-success rounded-full mr-1"></div>
                      在线
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">问题数量</span>
                    <span className="font-medium">{aiInterviewService.getQuestionCount()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                     <span className="text-muted-foreground">面试类型</span>
                     <span className="font-medium">
                       {interviewContext.interviewType === 'technical' ? '技术面试' : 
                        interviewContext.interviewType === 'behavioral' ? '行为面试' : '综合面试'}
                     </span>
                   </div>
                   
                   <div className="flex items-center justify-between">
                     <span className="text-muted-foreground">面试官风格</span>
                     <span className="font-medium">
                       {interviewContext.interviewerStyle === 'strict' ? '严格型' : 
                        interviewContext.interviewerStyle === 'friendly' ? '友好型' : '开放型'}
                     </span>
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