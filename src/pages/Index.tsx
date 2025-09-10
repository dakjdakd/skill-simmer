import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/ui/navigation";
import { 
  BrainCircuit, 
  Target, 
  TrendingUp, 
  Users, 
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Shield
} from "lucide-react";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";
import aiMascot from "@/assets/ai-interviewer-mascot.jpg";

const Index = () => {
  const features = [
    {
      icon: BrainCircuit,
      title: "AI智能面试官",
      description: "基于GPT技术的智能面试官，模拟真实面试场景，提供专业的面试体验"
    },
    {
      icon: Target,
      title: "个性化定制",
      description: "根据你的简历和目标岗位，生成针对性的面试问题和反馈建议"
    },
    {
      icon: TrendingUp,
      title: "能力追踪",
      description: "多维度评估你的面试表现，追踪能力提升轨迹，助你不断进步"
    },
    {
      icon: Users,
      title: "多种面试官风格",
      description: "严格型、友好型、开放型三种面试官风格，适应不同面试场景"
    }
  ];

  const stats = [
    { number: "10,000+", label: "用户信赖" },
    { number: "50,000+", label: "面试练习" },
    { number: "95%", label: "用户满意度" },
    { number: "4.8", label: "平均评分" }
  ];

  const testimonials = [
    {
      name: "李小明",
      role: "前端工程师",
      company: "字节跳动",
      content: "通过AI面试练习，我的面试技能得到了显著提升，成功拿到了理想的offer！"
    },
    {
      name: "王小美",
      role: "产品经理", 
      company: "腾讯",
      content: "平台的反馈非常详细和专业，帮我发现了很多面试中的盲点。"
    },
    {
      name: "张小华",
      role: "UI设计师",
      company: "阿里巴巴",
      content: "友好的界面设计和智能的AI面试官让练习过程变得轻松愉快。"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left animate-fade-in">
            <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
              <Zap className="h-3 w-3 mr-1" />
              AI驱动的面试练习平台
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              让AI助你<br />
              <span className="bg-gradient-hero bg-clip-text text-transparent">面试无忧</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              通过智能AI面试官模拟真实面试场景，获得个性化反馈，提升面试技能，收获理想工作机会
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-primary hover:scale-105 transition-transform px-8 py-4 text-lg">
                  立即开始练习
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              
              <Link to="/auth">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  免费注册
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="relative rounded-2xl overflow-hidden shadow-large">
              <img 
                src={heroBanner} 
                alt="AI面试练习平台" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating Mascot */}
            <div className="absolute -bottom-4 -left-4 animate-float">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-large bg-white">
                <img 
                  src={aiMascot} 
                  alt="AI助手" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">为什么选择我们</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              专业的AI技术结合人性化设计，打造最佳的面试练习体验
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.title} 
                  className="text-center hover:shadow-medium transition-all duration-300 hover:-translate-y-2 animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-8">
                    <div className="p-4 rounded-2xl bg-primary/10 text-primary inline-flex mb-6">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">简单三步，开始练习</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              从准备到反馈，完整的面试练习流程
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center animate-slide-up">
              <div className="w-16 h-16 rounded-full bg-gradient-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">上传简历设置</h3>
              <p className="text-muted-foreground">
                上传简历，设置目标岗位和面试官风格，AI将为你量身定制面试内容
              </p>
            </div>

            <div className="text-center animate-slide-up" style={{ animationDelay: "200ms" }}>
              <div className="w-16 h-16 rounded-full bg-gradient-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">模拟面试对话</h3>
              <p className="text-muted-foreground">
                与AI面试官进行真实对话，体验专业的面试流程和深度提问
              </p>
            </div>

            <div className="text-center animate-slide-up" style={{ animationDelay: "400ms" }}>
              <div className="w-16 h-16 rounded-full bg-gradient-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">获得详细反馈</h3>
              <p className="text-muted-foreground">
                收到多维度的专业评价和改进建议，持续提升面试表现
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">用户好评如潮</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              看看其他用户是如何通过我们的平台获得成功的
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.name} 
                className="hover:shadow-medium transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} @ {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-primary/10 text-primary inline-flex mb-8 animate-float">
              <Shield className="h-8 w-8" />
            </div>
            
            <h2 className="text-4xl font-bold mb-6">
              准备好开始你的<span className="text-primary">面试之旅</span>了吗？
            </h2>
            
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              加入我们，让AI助你在面试中脱颖而出，收获理想的工作机会
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-primary hover:scale-105 transition-transform px-8 py-4 text-lg">
                  立即免费开始
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>完全免费</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>无需安装</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>即时反馈</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-xl font-bold mb-4">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <span className="bg-gradient-primary bg-clip-text text-transparent">AI面试练习</span>
            </div>
            <p className="text-muted-foreground mb-4">
              让每一次面试都成为成长的机会
            </p>
            <p className="text-sm text-muted-foreground">
              © 2025 AI面试练习平台. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
