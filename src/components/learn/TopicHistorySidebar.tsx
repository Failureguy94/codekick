import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface SavedTopic {
  id: string;
  topic: string;
  notes: string;
  videos: Array<{ title: string; searchQuery: string }>;
  created_at: string;
}

interface TopicHistorySidebarProps {
  onSelectTopic: (topic: SavedTopic) => void;
  refreshTrigger?: number;
}

const TopicHistorySidebar = ({ onSelectTopic, refreshTrigger }: TopicHistorySidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [topics, setTopics] = useState<SavedTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchTopics = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('learning_topics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setTopics((data || []).map(item => ({
        ...item,
        videos: (item.videos as Array<{ title: string; searchQuery: string }>) || []
      })));
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [user, refreshTrigger]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('learning_topics')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTopics(topics.filter(t => t.id !== id));
      toast.success('Topic deleted');
    } catch (error) {
      toast.error('Failed to delete topic');
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 h-12 w-8 rounded-r-lg rounded-l-none bg-card/80 backdrop-blur-sm border border-border/50 border-l-0 hover:bg-card"
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-card/95 backdrop-blur-xl border-r border-border/50 z-50 overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Saved Topics</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : topics.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">No saved topics yet</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Generate and save topics to see them here
                    </p>
                  </div>
                ) : (
                  topics.map((topic, index) => (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        onSelectTopic(topic);
                        setIsOpen(false);
                      }}
                      className="group p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors border border-transparent hover:border-border/50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{topic.topic}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:bg-destructive/20 hover:text-destructive"
                          onClick={(e) => handleDelete(e, topic.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopicHistorySidebar;
