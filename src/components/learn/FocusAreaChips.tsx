import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface FocusAreaChipsProps {
  topic: string;
}

const FocusAreaChips = ({ topic }: FocusAreaChipsProps) => {
  // Generate focus areas based on the topic
  const generateFocusAreas = (topic: string): string[] => {
    const topicLower = topic.toLowerCase();
    
    // Common programming concepts
    const baseAreas = ['Fundamentals', 'Best Practices', 'Examples'];
    
    // Add topic-specific focus areas
    if (topicLower.includes('react')) {
      return ['Components', 'Hooks', 'State Management', 'Props', ...baseAreas];
    }
    if (topicLower.includes('javascript') || topicLower.includes('js')) {
      return ['ES6+', 'Async/Await', 'DOM', 'Functions', ...baseAreas];
    }
    if (topicLower.includes('python')) {
      return ['Syntax', 'Data Types', 'OOP', 'Libraries', ...baseAreas];
    }
    if (topicLower.includes('node')) {
      return ['Modules', 'Express', 'APIs', 'NPM', ...baseAreas];
    }
    if (topicLower.includes('database') || topicLower.includes('sql')) {
      return ['Queries', 'Joins', 'Indexes', 'Optimization', ...baseAreas];
    }
    if (topicLower.includes('api')) {
      return ['REST', 'Endpoints', 'Authentication', 'CRUD', ...baseAreas];
    }
    if (topicLower.includes('algorithm') || topicLower.includes('data structure')) {
      return ['Time Complexity', 'Space Complexity', 'Implementation', 'Use Cases', ...baseAreas];
    }
    
    // Default areas for generic topics
    return ['Concepts', 'Implementation', 'Use Cases', ...baseAreas];
  };

  const focusAreas = generateFocusAreas(topic).slice(0, 6);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Focus Areas</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {focusAreas.map((area, index) => (
          <motion.span
            key={area}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="px-3 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors cursor-default"
          >
            {area}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default FocusAreaChips;
