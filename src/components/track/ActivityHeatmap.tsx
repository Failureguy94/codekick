import { useMemo } from 'react';
import { format, subDays, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ActivityData {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  data: ActivityData[];
  isLoading: boolean;
}

const ActivityHeatmap = ({ data, isLoading }: ActivityHeatmapProps) => {
  const weeks = useMemo(() => {
    const today = new Date();
    const weeksCount = 52;
    const result: { date: Date; count: number }[][] = [];

    // Start from 52 weeks ago, aligned to start of week (Sunday)
    const startDate = startOfWeek(subDays(today, weeksCount * 7));

    for (let week = 0; week < weeksCount; week++) {
      const weekDays: { date: Date; count: number }[] = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = addDays(startDate, week * 7 + day);
        const activityItem = data.find(d => 
          isSameDay(new Date(d.date), currentDate)
        );
        weekDays.push({
          date: currentDate,
          count: activityItem?.count || 0,
        });
      }
      result.push(weekDays);
    }

    return result;
  }, [data]);

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-muted/50';
    if (count === 1) return 'bg-primary/30';
    if (count <= 3) return 'bg-primary/50';
    if (count <= 5) return 'bg-primary/70';
    return 'bg-primary';
  };

  const months = useMemo(() => {
    const result: { name: string; index: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const month = week[0].date.getMonth();
      if (month !== lastMonth) {
        result.push({
          name: format(week[0].date, 'MMM'),
          index: weekIndex,
        });
        lastMonth = month;
      }
    });

    return result;
  }, [weeks]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-muted/30 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Month labels */}
        <div className="flex mb-2 ml-8">
          {months.map((month, i) => (
            <div
              key={i}
              className="text-xs text-muted-foreground"
              style={{ marginLeft: i === 0 ? 0 : `${(month.index - (months[i - 1]?.index || 0)) * 14 - 24}px` }}
            >
              {month.name}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-2 text-xs text-muted-foreground">
            {dayLabels.map((day, i) => (
              <div key={i} className="h-[11px] flex items-center">
                {i % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dayIndex) => (
                  <Tooltip key={dayIndex}>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-[11px] h-[11px] rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 ${getIntensityClass(day.count)}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">
                        {day.count} topic{day.count !== 1 ? 's' : ''} on {format(day.date, 'MMM d, yyyy')}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-[11px] h-[11px] rounded-sm bg-muted/50" />
            <div className="w-[11px] h-[11px] rounded-sm bg-primary/30" />
            <div className="w-[11px] h-[11px] rounded-sm bg-primary/50" />
            <div className="w-[11px] h-[11px] rounded-sm bg-primary/70" />
            <div className="w-[11px] h-[11px] rounded-sm bg-primary" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
