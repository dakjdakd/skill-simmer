import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/ui/navigation";
import { useToast } from "@/hooks/use-toast";
import { authService, LoginCredentials, RegisterData } from "@/lib/auth-service";
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  LogIn,
  UserPlus,
  BrainCircuit,
  CheckCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type AuthMode = 'login' | 'register';

export default function Auth() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await authService.login(loginData);
      
      if (result.success) {
        toast({
          title: "登录成功",
          description: "欢迎回来！正在跳转到仪表板...",
        });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        toast({
          title: "登录失败",
          description: result.error || "登录过程中出现错误",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "登录失败",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await authService.register(registerData);
      
      if (result.success) {
        toast({
          title: "注册成功",
          description: "欢迎加入AI面试练习平台！正在跳转...",
        });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        toast({
          title: "注册失败",
          description: result.error || "注册过程中出现错误",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "注册失败",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDemoLogin = async () => {
    // Create sample users if they don't exist
    authService.createSampleUsers();
    
    setLoginData({
      email: 'demo@example.com',
      password: 'demo123'
    });
    
    toast({
      title: "演示账号",
      description: "已填入演示账号信息，点击登录即可体验",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary text-white mb-4">
              <BrainCircuit className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
              {mode === 'login' ? '欢迎回来' : '加入我们'}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'login' 
                ? '登录您的账号，继续AI面试练习之旅' 
                : '创建账号，开始您的AI面试练习之旅'
              }
            </p>
          </div>
          
          {/* Auth Card */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {mode === 'login' ? (
                  <><LogIn className="h-5 w-5 text-primary" /><span>用户登录</span></>
                ) : (
                  <><UserPlus className="h-5 w-5 text-primary" /><span>用户注册</span></>
                )}
              </CardTitle>
              <CardDescription>
                {mode === 'login' 
                  ? '请输入您的登录凭据' 
                  : '请填写注册信息创建新账号'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {mode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">邮箱地址</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="请输入邮箱地址"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="password">密码</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="请输入密码"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>登录中...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <LogIn className="h-4 w-4" />
                        <span>登录</span>
                      </div>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="name">姓名</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="请输入您的姓名"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="register-email">邮箱地址</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="请输入邮箱地址"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="register-password">密码</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="请输入密码（至少6位）"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        className="pl-10 pr-10"
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="confirm-password">确认密码</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="请再次输入密码"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>注册中...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <UserPlus className="h-4 w-4" />
                        <span>注册</span>
                      </div>
                    )}
                  </Button>
                </form>
              )}
              
              {/* Mode Switch */}
              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  {mode === 'login' ? '还没有账号？' : '已有账号？'}
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="w-full"
                >
                  {mode === 'login' ? '立即注册' : '立即登录'}
                </Button>
              </div>
              
              {/* Demo Login */}
              {mode === 'login' && (
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleDemoLogin}
                    className="w-full flex items-center space-x-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>使用演示账号</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="text-center p-4 rounded-lg bg-success/5 border border-success/20">
              <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
              <p className="text-sm font-medium text-success">AI智能面试</p>
              <p className="text-xs text-muted-foreground mt-1">专业AI面试官</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
              <CheckCircle className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-primary">个性化反馈</p>
              <p className="text-xs text-muted-foreground mt-1">详细分析报告</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-warning/5 border border-warning/20">
              <CheckCircle className="h-6 w-6 text-warning mx-auto mb-2" />
              <p className="text-sm font-medium text-warning">进步追踪</p>
              <p className="text-xs text-muted-foreground mt-1">能力提升轨迹</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}