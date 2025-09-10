import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/ui/navigation";
import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  Palette, 
  Download,
  Upload,
  Settings,
  Target,
  Trophy,
  Calendar,
  Clock
} from "lucide-react";

export default function Profile() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    achievements: true
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: false,
    shareProgress: true,
    anonymousData: true
  });

  const userStats = [
    { label: "累计练习", value: "12次", icon: Target },
    { label: "最高得分", value: "9.1分", icon: Trophy },
    { label: "加入时间", value: "30天", icon: Calendar },
    { label: "总时长", value: "4.2小时", icon: Clock },
  ];

  const preferences = [
    { label: "默认面试时长", value: "30分钟" },
    { label: "偏好面试官风格", value: "友好型" },
    { label: "关注技术栈", value: "React, Vue, Node.js" },
    { label: "目标岗位", value: "高级前端工程师" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            个人设置
          </h1>
          <p className="text-muted-foreground text-lg">
            管理你的账户信息和个性化设置
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Information */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>个人信息</span>
                </CardTitle>
                <CardDescription>
                  更新你的个人资料信息
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center space-x-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="text-lg font-semibold bg-gradient-primary text-white">
                      李
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-3 w-3 mr-2" />
                      更换头像
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      支持 JPG, PNG 格式，最大 2MB
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">姓名</Label>
                    <Input id="name" defaultValue="李小明" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">邮箱</Label>
                    <Input id="email" type="email" defaultValue="lixiaoming@example.com" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">手机号</Label>
                    <Input id="phone" defaultValue="138****1234" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="location">所在城市</Label>
                    <Input id="location" defaultValue="北京" className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">个人简介</Label>
                  <textarea
                    id="bio"
                    className="w-full mt-1 p-3 rounded-lg border border-border bg-background resize-none"
                    rows={3}
                    placeholder="简单介绍一下自己..."
                    defaultValue="3年前端开发经验，擅长React和Vue框架，热爱学习新技术，希望通过AI面试练习提升自己的面试技能。"
                  />
                </div>

                <Button className="w-full md:w-auto">
                  保存个人信息
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <span>通知设置</span>
                </CardTitle>
                <CardDescription>
                  管理你希望接收的通知类型
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">邮件通知</p>
                      <p className="text-sm text-muted-foreground">
                        接收面试结果和重要更新的邮件
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">推送通知</p>
                      <p className="text-sm text-muted-foreground">
                        浏览器推送提醒和实时消息
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">周报总结</p>
                      <p className="text-sm text-muted-foreground">
                        每周练习进度和成长报告
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.weekly}
                      onCheckedChange={(checked) => setNotifications({...notifications, weekly: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">成就通知</p>
                      <p className="text-sm text-muted-foreground">
                        获得新徽章和里程碑提醒
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.achievements}
                      onCheckedChange={(checked) => setNotifications({...notifications, achievements: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>隐私设置</span>
                </CardTitle>
                <CardDescription>
                  控制你的信息可见性和数据使用
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">公开个人资料</p>
                      <p className="text-sm text-muted-foreground">
                        其他用户可以查看你的基本信息
                      </p>
                    </div>
                    <Switch 
                      checked={privacy.publicProfile}
                      onCheckedChange={(checked) => setPrivacy({...privacy, publicProfile: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">分享进度数据</p>
                      <p className="text-sm text-muted-foreground">
                        允许在排行榜中显示匿名进度
                      </p>
                    </div>
                    <Switch 
                      checked={privacy.shareProgress}
                      onCheckedChange={(checked) => setPrivacy({...privacy, shareProgress: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">匿名数据收集</p>
                      <p className="text-sm text-muted-foreground">
                        帮助改善产品体验（不包含个人信息）
                      </p>
                    </div>
                    <Switch 
                      checked={privacy.anonymousData}
                      onCheckedChange={(checked) => setPrivacy({...privacy, anonymousData: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-primary" />
                  <span>外观设置</span>
                </CardTitle>
                <CardDescription>
                  个性化你的界面体验
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">主题模式</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <div className="p-3 rounded-lg border border-primary bg-primary/5 cursor-pointer">
                      <div className="text-center">
                        <div className="w-8 h-8 rounded bg-gradient-primary mx-auto mb-2"></div>
                        <p className="text-xs font-medium">浅色</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-border cursor-pointer hover:border-primary/50">
                      <div className="text-center">
                        <div className="w-8 h-8 rounded bg-foreground mx-auto mb-2"></div>
                        <p className="text-xs font-medium">深色</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-border cursor-pointer hover:border-primary/50">
                      <div className="text-center">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary mx-auto mb-2"></div>
                        <p className="text-xs font-medium">自动</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">语言设置</Label>
                  <select className="w-full mt-2 p-3 rounded-lg border border-border bg-background">
                    <option value="zh-CN">简体中文</option>
                    <option value="en-US">English</option>
                    <option value="ja-JP">日本語</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Stats */}
            <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
              <CardHeader>
                <CardTitle>账户概览</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                      </div>
                      <span className="font-semibold">{stat.value}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Current Preferences */}
            <Card className="animate-slide-up" style={{ animationDelay: "500ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <span>当前偏好</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {preferences.map((pref) => (
                  <div key={pref.label} className="space-y-1">
                    <p className="text-sm text-muted-foreground">{pref.label}</p>
                    <p className="text-sm font-medium">{pref.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="animate-slide-up" style={{ animationDelay: "600ms" }}>
              <CardHeader>
                <CardTitle>账户操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  导出数据
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  修改密码
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-error hover:text-error">
                  <Shield className="h-4 w-4 mr-2" />
                  删除账户
                </Button>
              </CardContent>
            </Card>

            {/* Premium Upgrade */}
            <Card className="animate-slide-up bg-gradient-primary text-white" style={{ animationDelay: "700ms" }}>
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">升级到高级版</h3>
                <p className="text-sm opacity-90 mb-4">
                  解锁更多面试官风格、详细分析报告和专属功能
                </p>
                <Button variant="secondary" className="w-full">
                  立即升级
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}