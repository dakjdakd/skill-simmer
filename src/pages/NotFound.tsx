import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";
import { Home, Search, ArrowLeft, BrainCircuit } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          {/* 404 Animation */}
          <div className="relative mb-8 animate-fade-in">
            <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="p-4 rounded-full bg-gradient-primary text-white animate-float">
                <BrainCircuit className="h-12 w-12" />
              </div>
            </div>
          </div>

          <Card className="animate-slide-up">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold mb-4">页面不存在</h1>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                抱歉，你访问的页面不存在或已被移动。不如回到主页重新开始你的面试练习之旅？
              </p>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/">
                    <Button className="w-full sm:w-auto">
                      <Home className="h-4 w-4 mr-2" />
                      返回首页
                    </Button>
                  </Link>
                  
                  <Button variant="outline" onClick={() => window.history.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    返回上页
                  </Button>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    或者尝试这些热门页面：
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Link to="/dashboard">
                      <Button variant="outline" size="sm">仪表板</Button>
                    </Link>
                    <Link to="/interview/prepare">
                      <Button variant="outline" size="sm">开始面试</Button>
                    </Link>
                    <Link to="/progress">
                      <Button variant="outline" size="sm">进步追踪</Button>
                    </Link>
                    <Link to="/history">
                      <Button variant="outline" size="sm">历史记录</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Debug Info (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="mt-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-2">开发调试信息</h3>
                <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
                  尝试访问: {location.pathname}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
