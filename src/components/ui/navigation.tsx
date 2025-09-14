import { Button } from "@/components/ui/button";
import { BrainCircuit, User, History, TrendingUp, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { href: "/", label: "首页", icon: BrainCircuit },
    { href: "/dashboard", label: "仪表板", icon: User },
    { href: "/interview/prepare", label: "开始面试", icon: BrainCircuit },
    { href: "/progress", label: "进步追踪", icon: TrendingUp },
    { href: "/history", label: "历史记录", icon: History },
    { href: "/profile", label: "个人设置", icon: Settings },
  ];

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold bg-gradient-primary bg-clip-text text-transparent"
          >
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span>AI面试练习</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground hidden md:block">
              欢迎使用AI面试练习平台
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}