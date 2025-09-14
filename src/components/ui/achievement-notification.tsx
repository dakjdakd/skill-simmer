import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Achievement } from "@/lib/data-service";
import { 
  Trophy, 
  X, 
  Sparkles,
  Star,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementNotificationProps {
  achievements: Achievement[];
  onClose: () => void;
  className?: string;
}

export function AchievementNotification({ 
  achievements, 
  onClose, 
  className 
}: AchievementNotificationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Auto-advance to next achievement after 4 seconds
    if (currentIndex < achievements.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      // Auto-close after showing the last achievement
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, achievements.length]);

  useEffect(() => {
    // Reset animation when achievement changes
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 100);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleNext = () => {
    if (currentIndex < achievements.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (achievements.length === 0) return null;

  const currentAchievement = achievements[currentIndex];

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm",
      "transition-all duration-300",
      isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
      className
    )}>
      <Card className={cn(
        "relative max-w-md w-full mx-auto",
        "transform transition-all duration-500",
        isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
        isAnimating && "animate-bounce"
      )}>
        {/* Celebration Effects */}
        <div className="absolute -top-4 -left-4 animate-pulse">
          <Sparkles className="h-8 w-8 text-warning" />
        </div>
        <div className="absolute -top-2 -right-2 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <Star className="h-6 w-6 text-primary" />
        </div>
        <div className="absolute -bottom-2 -left-2 animate-pulse" style={{ animationDelay: '1s' }}>
          <Zap className="h-6 w-6 text-secondary" />
        </div>
        
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="absolute top-2 right-2 z-10"
        >
          <X className="h-4 w-4" />
        </Button>

        <CardContent className="p-8 text-center">
          {/* Achievement Icon */}
          <div className="relative mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary text-white text-4xl font-bold mb-4 animate-pulse">
              {currentAchievement.icon}
            </div>
            <div className="absolute -top-2 -right-2">
              <Trophy className="h-8 w-8 text-warning animate-bounce" />
            </div>
          </div>

          {/* Achievement Info */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                🎉 成就解锁！
              </h2>
              <h3 className="text-xl font-semibold text-foreground">
                {currentAchievement.title}
              </h3>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              {currentAchievement.description}
            </p>
            
            <div className="flex items-center justify-center space-x-2">
              <Badge variant="default" className="bg-success/10 text-success border-success/20">
                <Trophy className="h-3 w-3 mr-1" />
                {currentAchievement.type === 'milestone' ? '里程碑' :
                 currentAchievement.type === 'streak' ? '连续成就' :
                 currentAchievement.type === 'score' ? '分数成就' : '特殊成就'}
              </Badge>
              
              {currentAchievement.unlockedAt && (
                <Badge variant="outline">
                  {currentAchievement.unlockedAt.toLocaleDateString()}
                </Badge>
              )}
            </div>
          </div>

          {/* Navigation */}
          {achievements.length > 1 && (
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                上一个
              </Button>
              
              <div className="flex items-center space-x-2">
                {achievements.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      index === currentIndex ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
              >
                {currentIndex === achievements.length - 1 ? '完成' : '下一个'}
              </Button>
            </div>
          )}

          {/* Single Achievement Action */}
          {achievements.length === 1 && (
            <div className="mt-8">
              <Button onClick={handleClose} className="w-full">
                太棒了！
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for managing achievement notifications
export function useAchievementNotifications() {
  const [pendingAchievements, setPendingAchievements] = useState<Achievement[]>([]);
  const [isShowing, setIsShowing] = useState(false);

  const showAchievements = (achievements: Achievement[]) => {
    if (achievements.length > 0) {
      setPendingAchievements(achievements);
      setIsShowing(true);
    }
  };

  const hideAchievements = () => {
    setIsShowing(false);
    setPendingAchievements([]);
  };

  const AchievementNotificationComponent = isShowing ? (
    <AchievementNotification
      achievements={pendingAchievements}
      onClose={hideAchievements}
    />
  ) : null;

  return {
    showAchievements,
    hideAchievements,
    AchievementNotificationComponent,
    isShowing
  };
}