import { CheckCircle2, Circle, Star, Flame, BookOpen, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import type { TrackStats } from '@/pages/Track';

interface MilestonesListProps {
  stats: TrackStats;
}

const MilestonesList = ({ stats }: MilestonesListProps) => {
  const milestones = [
    {
      icon: Star,
      title: 'First Topic',
      description: 'Learn your first topic',
      achieved: stats.totalTopics >= 1,
      color: 'text-yellow-500',
    },
    {
      icon: Flame,
      title: '3-Day Streak',
      description: 'Maintain a 3-day learning streak',
      achieved: stats.longestStreak >= 3,
      color: 'text-orange-500',
    },
    {
      icon: BookOpen,
      title: '5 Topics Milestone',
      description: 'Learn 5 different topics',
      achieved: stats.totalTopics >= 5,
      color: 'text-blue-500',
    },
    {
      icon: Flame,
      title: '7-Day Streak',
      description: 'Maintain a week-long streak',
      achieved: stats.longestStreak >= 7,
      color: 'text-accent',
    },
    {
      icon: Target,
      title: '10 Topics Mastered',
      description: 'Master 10 different topics',
      achieved: stats.totalTopics >= 10,
      color: 'text-green-500',
    },
    {
      icon: Award,
      title: 'Knowledge Seeker',
      description: 'Learn 25 topics',
      achieved: stats.totalTopics >= 25,
      color: 'text-purple-500',
    },
    {
      icon: Flame,
      title: '30-Day Streak',
      description: 'Maintain a month-long streak',
      achieved: stats.longestStreak >= 30,
      color: 'text-red-500',
    },
    {
      icon: Star,
      title: 'Century Club',
      description: 'Learn 100 topics',
      achieved: stats.totalTopics >= 100,
      color: 'text-primary',
    },
  ];

  const achievedCount = milestones.filter(m => m.achieved).length;

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-6">
        {achievedCount} of {milestones.length} milestones achieved
      </p>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-lg border transition-all ${
              milestone.achieved 
                ? 'bg-primary/5 border-primary/20' 
                : 'bg-muted/20 border-border/50 opacity-60'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${milestone.achieved ? 'bg-primary/10' : 'bg-muted/30'}`}>
                <milestone.icon className={`h-5 w-5 ${milestone.achieved ? milestone.color : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-medium text-sm truncate ${!milestone.achieved && 'text-muted-foreground'}`}>
                    {milestone.title}
                  </p>
                  {milestone.achieved ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {milestone.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MilestonesList;
