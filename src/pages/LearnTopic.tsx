import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Save, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import TopicSearchInput from '@/components/learn/TopicSearchInput';
import NotesDisplay from '@/components/learn/NotesDisplay';
import VideoCard from '@/components/learn/VideoCard';
import TopicHistorySidebar from '@/components/learn/TopicHistorySidebar';

interface GeneratedContent {
  notes: string;
  videos: Array<{ title: string; searchQuery: string }>;
}

interface SavedTopic {
  id: string;
  topic: string;
  notes: string;
  videos: any[];
  created_at: string;
}

const LearnTopic = () => {
  const [currentTopic, setCurrentTopic] = useState('');
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshSidebar, setRefreshSidebar] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGenerate = async (topic: string) => {
    setIsGenerating(true);
    setCurrentTopic(topic);
    setContent(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-topic-notes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ topic }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate notes');
      }

      const data = await response.json();
      setContent(data);
      toast.success('Notes generated successfully!');
    } catch (error) {
      console.error('Error generating notes:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate notes');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save topics');
      navigate('/auth');
      return;
    }

    if (!content || !currentTopic) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from('learning_topics').insert({
        user_id: user.id,
        topic: currentTopic,
        notes: content.notes,
        videos: content.videos,
      });

      if (error) throw error;
      toast.success('Topic saved to your library!');
      setRefreshSidebar(prev => prev + 1);
    } catch (error) {
      console.error('Error saving topic:', error);
      toast.error('Failed to save topic');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectSavedTopic = (savedTopic: SavedTopic) => {
    setCurrentTopic(savedTopic.topic);
    setContent({
      notes: savedTopic.notes,
      videos: savedTopic.videos,
    });
  };

  return (
    <>
      <Helmet>
        <title>Learn Any Topic | CodeKick</title>
        <meta name="description" content="Generate AI-powered learning notes on any programming topic with video recommendations." />
      </Helmet>

      <div className="min-h-screen bg-background bg-mesh">
        <Navigation />
        <TopicHistorySidebar onSelectTopic={handleSelectSavedTopic} refreshTrigger={refreshSidebar} />

        <main className="container mx-auto px-4 pt-24 pb-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI-Powered Learning</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Learn <span className="text-gradient">Any Topic</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter any programming or technology topic and get comprehensive notes with video recommendations powered by AI.
            </p>
          </motion.div>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <TopicSearchInput onGenerate={handleGenerate} isLoading={isGenerating} />
          </motion.div>

          {/* Loading State */}
          <AnimatePresence mode="wait">
            {isGenerating && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                  <Loader2 className="h-12 w-12 text-primary animate-spin relative z-10" />
                </div>
                <p className="mt-6 text-lg text-muted-foreground">
                  Generating comprehensive notes for <span className="text-foreground font-medium">"{currentTopic}"</span>
                </p>
                <p className="text-sm text-muted-foreground/60 mt-2">This may take a few seconds...</p>
              </motion.div>
            )}

            {/* Results */}
            {!isGenerating && content && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {/* Topic Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setContent(null);
                        setCurrentTopic('');
                      }}
                      className="shrink-0"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <h2 className="text-2xl font-bold text-gradient">{currentTopic}</h2>
                      <p className="text-sm text-muted-foreground">AI-generated learning notes</p>
                    </div>
                  </div>
                  <Button
                    variant="glow"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="shrink-0"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Topic
                      </>
                    )}
                  </Button>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Notes - 2 columns */}
                  <div className="lg:col-span-2">
                    <NotesDisplay notes={content.notes} />
                  </div>

                  {/* Videos - 1 column */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-gradient">Recommended Videos</span>
                    </h3>
                    <div className="space-y-4">
                      {content.videos.map((video, index) => (
                        <VideoCard
                          key={index}
                          title={video.title}
                          searchQuery={video.searchQuery}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
};

export default LearnTopic;
