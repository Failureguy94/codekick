import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { BookOpen, Search, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { formatDistanceToNow } from 'date-fns';

interface SavedTopic {
  id: string;
  topic: string;
  notes: string;
  videos: Array<{ title: string; searchQuery: string }>;
  created_at: string;
}

const MyTopics = () => {
  const [topics, setTopics] = useState<SavedTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchTopics();
    }
  }, [user]);

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_topics')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTopics((data || []).map(item => ({
        ...item,
        videos: (item.videos as Array<{ title: string; searchQuery: string }>) || []
      })));
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
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
    } finally {
      setDeletingId(null);
    }
  };

  const filteredTopics = topics.filter(topic =>
    topic.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>My Topics | CodeKick</title>
        <meta name="description" content="View and manage your saved learning topics." />
      </Helmet>

      <div className="min-h-screen bg-background bg-mesh">
        <Navigation />

        <main className="container mx-auto px-4 pt-24 pb-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                My <span className="text-gradient">Topics</span>
              </h1>
              <p className="text-muted-foreground">
                Your saved learning topics and notes
              </p>
            </div>
            <Link to="/learn">
              <Button variant="glow">
                <BookOpen className="mr-2 h-4 w-4" />
                Learn New Topic
              </Button>
            </Link>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Topics Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-muted/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredTopics.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? 'No topics found' : 'No saved topics yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Start learning and save topics to build your library'}
              </p>
              {!searchQuery && (
                <Link to="/learn">
                  <Button variant="glow">
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card variant="glass" className="group cursor-pointer hover:border-primary/30 transition-all h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                          {topic.topic}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(topic.id);
                          }}
                          disabled={deletingId === topic.id}
                        >
                          {deletingId === topic.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                        {topic.notes.slice(0, 150)}...
                      </p>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {topic.videos?.length || 0} videos
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default MyTopics;
