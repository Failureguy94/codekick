import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Flame, Trophy, Target, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import ActivityHeatmap from '@/components/track/ActivityHeatmap';
import StatsCards from '@/components/track/StatsCards';
import MilestonesList from '@/components/track/MilestonesList';

export interface ActivityData {
  date: string;
  count: number;
}

export interface TrackStats {
  currentStreak: number;
  longestStreak: number;
  totalTopics: number;
  totalDaysActive: number;
}

const Track = () => {
  const { user } = useAuth();
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [stats, setStats] = useState<TrackStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalTopics: 0,
    totalDaysActive: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTrackingData();
    }
  }, [user]);

  const loadTrackingData = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Load activity data for the past year
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const { data: activities } = await supabase
        .from('learning_activity')
        .select('activity_date, topics_count')
        .eq('user_id', user.id)
        .gte('activity_date', oneYearAgo.toISOString().split('T')[0])
        .order('activity_date', { ascending: true });

      const formattedActivity: ActivityData[] = (activities || []).map(a => ({
        date: a.activity_date,
        count: a.topics_count || 0,
      }));

      setActivityData(formattedActivity);

      // Calculate stats
      const { count: totalTopics } = await supabase
        .from('learning_topics')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Calculate streaks
      const { data: allActivities } = await supabase
        .from('learning_activity')
        .select('activity_date, topics_count')
        .eq('user_id', user.id)
        .gt('topics_count', 0)
        .order('activity_date', { ascending: false });

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      if (allActivities && allActivities.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Calculate current streak
        for (let i = 0; i < allActivities.length; i++) {
          const activityDate = new Date(allActivities[i].activity_date);
          activityDate.setHours(0, 0, 0, 0);
          const expectedDate = new Date(today);
          expectedDate.setDate(expectedDate.getDate() - i);
          
          if (activityDate.getTime() === expectedDate.getTime()) {
            currentStreak++;
          } else {
            break;
          }
        }

        // Calculate longest streak
        const sortedDates = allActivities
          .map(a => new Date(a.activity_date).getTime())
          .sort((a, b) => a - b);

        tempStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const diff = (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);
          if (diff === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      }

      setStats({
        currentStreak,
        longestStreak,
        totalTopics: totalTopics || 0,
        totalDaysActive: allActivities?.length || 0,
      });

    } catch (error) {
      console.error('Error loading tracking data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Learning Progress | CodeKick</title>
        <meta name="description" content="Track your learning journey with an activity heatmap and progress statistics." />
      </Helmet>

      <div className="min-h-screen bg-background bg-mesh">
        <Navigation />

        <main className="container mx-auto px-4 pt-24 pb-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Flame className="h-4 w-4 text-accent" />
              <span className="text-sm text-accent font-medium">Your Learning Journey</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Progress <span className="text-gradient">Tracker</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Visualize your learning activity and track your consistency over time.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatsCards stats={stats} isLoading={isLoading} />
          </motion.div>

          {/* Activity Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Activity Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityHeatmap data={activityData} isLoading={isLoading} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Milestones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Milestones & Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MilestonesList stats={stats} />
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default Track;
