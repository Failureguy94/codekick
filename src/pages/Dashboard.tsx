import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Flame, 
  Plus, 
  Trash2, 
  ArrowRight,
  FileText,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';

interface RecentTopic {
  id: string;
  topic: string;
  created_at: string;
}

interface DailyActivity {
  topics_count: number;
  notes_generated: number;
}

interface Stats {
  totalTopics: number;
  totalNotes: number;
  currentStreak: number;
  memberSince: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentTopics, setRecentTopics] = useState<RecentTopic[]>([]);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity>({ topics_count: 0, notes_generated: 0 });
  const [stats, setStats] = useState<Stats>({ totalTopics: 0, totalNotes: 0, currentStreak: 0, memberSince: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Load recent topics
      const { data: topics } = await supabase
        .from('learning_topics')
        .select('id, topic, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentTopics(topics || []);

      // Load today's activity
      const today = new Date().toISOString().split('T')[0];
      const { data: activity } = await supabase
        .from('learning_activity')
        .select('topics_count, notes_generated')
        .eq('user_id', user.id)
        .eq('activity_date', today)
        .maybeSingle();

      setDailyActivity(activity || { topics_count: 0, notes_generated: 0 });

      // Load total stats
      const { count: totalTopics } = await supabase
        .from('learning_topics')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Calculate streak from activity
      const { data: activityHistory } = await supabase
        .from('learning_activity')
        .select('activity_date, topics_count')
        .eq('user_id', user.id)
        .order('activity_date', { ascending: false })
        .limit(30);

      let streak = 0;
      if (activityHistory && activityHistory.length > 0) {
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < activityHistory.length; i++) {
          const activityDate = new Date(activityHistory[i].activity_date);
          activityDate.setHours(0, 0, 0, 0);
          const daysDiff = differenceInDays(todayDate, activityDate);
          
          if (daysDiff === i && activityHistory[i].topics_count > 0) {
            streak++;
          } else if (daysDiff > i) {
            break;
          }
        }
      }

      // Get member since date
      const { data: profile } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('id', user.id)
        .single();

      setStats({
        totalTopics: totalTopics || 0,
        totalNotes: totalTopics || 0,
        currentStreak: streak,
        memberSince: profile?.created_at ? format(new Date(profile.created_at), 'MMM d, yyyy') : '',
      });

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    try {
      const { error } = await supabase
        .from('learning_topics')
        .delete()
        .eq('id', topicId);

      if (error) throw error;
      
      setRecentTopics(prev => prev.filter(t => t.id !== topicId));
      toast.success('Topic deleted');
    } catch (error) {
      toast.error('Failed to delete topic');
    }
  };

  const topicColors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];

  return (
    <>
      <Helmet>
        <title>Dashboard | CodeKick</title>
        <meta name="description" content="Track your learning progress and manage your topics on CodeKick." />
      </Helmet>

      <div className="min-h-screen bg-background bg-mesh">
        <Navigation />

        <main className="container mx-auto px-4 pt-24 pb-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, <span className="text-gradient">{user?.user_metadata?.username || 'Learner'}</span>!
            </h1>
            <p className="text-muted-foreground">
              Track your learning progress and manage topics
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Section - Recent Topics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Recent Topics Card */}
              <Card className="gradient-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Recent Topics
                  </CardTitle>
                  <Button 
                    variant="glow" 
                    size="sm"
                    onClick={() => navigate('/learn')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Topic
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : recentTopics.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No topics yet. Start learning!</p>
                      <Button variant="glow" onClick={() => navigate('/learn')}>
                        Learn Your First Topic
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentTopics.map((topic, index) => (
                        <motion.div
                          key={topic.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${topicColors[index % topicColors.length]}`} />
                            <div>
                              <p className="font-medium">{topic.topic}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(topic.created_at), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTopic(topic.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Card 
                  className="cursor-pointer hover:border-primary/50 transition-colors group"
                  onClick={() => navigate('/learn')}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Learn New Topic</p>
                      <p className="text-sm text-muted-foreground">Generate AI notes</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:border-primary/50 transition-colors group"
                  onClick={() => navigate('/track')}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <Flame className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">View Progress</p>
                      <p className="text-sm text-muted-foreground">Activity heatmap</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Right Sidebar - Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Daily Activity */}
              <Card className="gradient-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    Daily Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm text-muted-foreground">Topics Generated</span>
                    <span className="font-bold text-lg">{dailyActivity.topics_count}/10</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm text-muted-foreground">Notes Saved</span>
                    <span className="font-bold text-lg">{dailyActivity.notes_generated}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-accent" />
                      <span className="text-sm">Current Streak</span>
                    </div>
                    <span className="font-bold text-lg text-accent">{stats.currentStreak} days</span>
                  </div>
                </CardContent>
              </Card>

              {/* Total Statistics */}
              <Card className="gradient-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    Total Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <p className="text-2xl font-bold text-gradient">{stats.totalTopics}</p>
                      <p className="text-xs text-muted-foreground">Topics Learned</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <p className="text-2xl font-bold text-gradient">{stats.totalNotes}</p>
                      <p className="text-xs text-muted-foreground">Notes Saved</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Member since</span>
                    <span className="text-sm font-medium ml-auto">{stats.memberSince}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
