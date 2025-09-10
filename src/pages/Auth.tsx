import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/ui/navigation";
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Github,
  Chrome,
  Zap
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里将来会集成Supabase认证
    console.log("Auth submission:", formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary text-white text-2xl font-bold mb-4">
              AI
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? "欢迎回来" : "加入我们"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? "登录你的账户继续面试练习" : "创建账户开始你的面试之旅"}
            </p>
          </div>

          {/* Auth Card */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-center">
                {isLogin ? "登录账户" : "创建账户"}
              </CardTitle>
              <CardDescription className="text-center">
                {isLogin ? "使用你的邮箱和密码登录" : "填写信息创建新账户"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <Label htmlFor="name">姓名</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="请输入你的姓名"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1"
                      required
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="email">邮箱地址</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="请输入你的邮箱"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                      type={showPassword ? "text" : "password"}
                      placeholder="请输入密码"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <Label htmlFor="confirmPassword">确认密码</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="请再次输入密码"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className="text-right">
                    <Button variant="link" className="text-sm p-0 h-auto">
                      忘记密码？
                    </Button>
                  </div>
                )}

                <Button type="submit" className="w-full">
                  {isLogin ? (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      登录
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      注册
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">或者</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Github className="h-4 w-4 mr-2" />
                  使用 GitHub 登录
                </Button>
                <Button variant="outline" className="w-full">
                  <Chrome className="h-4 w-4 mr-2" />
                  使用 Google 登录
                </Button>
              </div>

              {/* Switch Mode */}
              <div className="text-center mt-6">
                <span className="text-sm text-muted-foreground">
                  {isLogin ? "还没有账户？" : "已有账户？"}
                </span>
                <Button
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm p-1 ml-1"
                >
                  {isLogin ? "立即注册" : "立即登录"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          {!isLogin && (
            <Card className="mt-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-center">加入后即可享受</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-1 rounded bg-primary/10 text-primary">
                      <Zap className="h-3 w-3" />
                    </div>
                    <span className="text-sm">AI智能面试官个性化练习</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-1 rounded bg-primary/10 text-primary">
                      <Zap className="h-3 w-3" />
                    </div>
                    <span className="text-sm">详细的能力分析和进步追踪</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-1 rounded bg-primary/10 text-primary">
                      <Zap className="h-3 w-3" />
                    </div>
                    <span className="text-sm">完整的面试历史记录管理</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Demo Access */}
          <div className="text-center mt-6">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                先体验demo版本
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}