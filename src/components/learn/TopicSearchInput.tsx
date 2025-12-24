import { useState } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

interface TopicSearchInputProps {
  onGenerate: (topic: string) => void;
  isLoading: boolean;
}

const suggestedTopics = [
  'Binary Search Trees',
  'React Hooks',
  'Docker Containers',
  'GraphQL APIs',
  'Recursion',
  'REST vs GraphQL',
];

const TopicSearchInput = ({ onGenerate, isLoading }: TopicSearchInputProps) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onGenerate(topic.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTopic(suggestion);
    onGenerate(suggestion);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative gradient-border rounded-2xl">
          <div className="relative flex items-center bg-card rounded-2xl overflow-hidden">
            <Search className="absolute left-5 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter any programming topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1 pl-14 pr-36 py-7 text-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
              disabled={isLoading}
            />
            <div className="absolute right-3">
              <Button
                type="submit"
                variant="glow"
                size="lg"
                disabled={!topic.trim() || isLoading}
                className="rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-muted-foreground mr-2">Try:</span>
        {suggestedTopics.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={isLoading}
            className="px-3 py-1.5 text-sm rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 border border-border/50 hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TopicSearchInput;
