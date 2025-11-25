'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { Award, Trophy, Star, Heart, TrendingUp } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

interface DonorStats {
  totalDonations: number;
  totalVolume: number;
  livesSaved: number;
  consecutiveYears: number;
  achievements: Achievement[];
}

export default function AchievementsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DonorStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role?.code !== 'donor') {
        router.push('/dashboard');
      } else {
        loadStats();
      }
    }
  }, [user, authLoading, router]);

  const loadStats = async () => {
    try {
      const res = await apiClient.get<DonorStats>('/donors/me/achievements');
      setStats(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (icon: string) => {
    const icons: Record<string, any> = {
      award: Award,
      trophy: Trophy,
      star: Star,
      heart: Heart,
    };
    return icons[icon] || Award;
  };

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl px-4 py-8">
          <p>Loading achievements...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !stats) {
    return (
      <MainLayout>
        <div className="container max-w-6xl px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || 'Failed to load achievements'}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const unlockedCount = stats.achievements.filter(a => a.unlocked).length;

  return (
    <MainLayout>
      <div className="container max-w-6xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Achievements & Impact</h1>
          <p className="text-muted-foreground mt-2">
            Track your progress and celebrate your life-saving contributions
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Donations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalDonations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalVolume}ml</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lives Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">~{stats.livesSaved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Consecutive Years
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.consecutiveYears}</div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Achievement Progress</CardTitle>
            <CardDescription>
              {unlockedCount} of {stats.achievements.length} achievements unlocked
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={(unlockedCount / stats.achievements.length) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.achievements.map((achievement) => {
            const IconComponent = getIconComponent(achievement.icon);
            return (
              <Card
                key={achievement.id}
                className={achievement.unlocked ? 'border-yellow-400 bg-yellow-50' : 'opacity-60'}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        achievement.unlocked ? 'bg-yellow-400' : 'bg-gray-200'
                      }`}>
                        <IconComponent className={`h-6 w-6 ${
                          achievement.unlocked ? 'text-white' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{achievement.title}</CardTitle>
                        {achievement.unlocked && achievement.unlockedAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    {achievement.unlocked && (
                      <Badge variant="default" className="bg-yellow-500">
                        <Trophy className="h-3 w-3 mr-1" />
                        Unlocked
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {achievement.description}
                  </p>
                  {!achievement.unlocked && achievement.progress !== undefined && achievement.target && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {achievement.progress} / {achievement.target}
                        </span>
                      </div>
                      <Progress
                        value={(achievement.progress / achievement.target) * 100}
                        className="h-2"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Motivational Message */}
        {unlockedCount === 0 && (
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Heart className="h-16 w-16 mx-auto text-red-600" />
                <div>
                  <h3 className="text-2xl font-bold">Start Your Achievement Journey!</h3>
                  <p className="text-muted-foreground mt-2">
                    Make your first donation to unlock achievements and track your impact
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

