import { Flame, Trophy, BookOpen, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { TrackStats } from '@/pages/Track';

interface StatsCardsProps {
  stats: TrackStats;
  isLoading: boolean;
}

const StatsCards = ({ stats, isLoading }: StatsCardsProps) => {
  const cards = [
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: Trophy,
      label: 'Longest Streak',
      value: `${stats.longestStreak} days`,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: BookOpen,
      label: 'Total Topics',
      value: stats.totalTopics.toString(),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Calendar,
      label: 'Days Active',
      value: stats.totalDaysActive.toString(),
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="gradient-border">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-10 w-10 bg-muted/50 rounded-lg" />
                <div className="h-4 w-16 bg-muted/50 rounded" />
                <div className="h-6 w-12 bg-muted/50 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="gradient-border">
          <CardContent className="p-6">
            <div className={`p-3 rounded-lg ${card.bgColor} w-fit mb-3`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
