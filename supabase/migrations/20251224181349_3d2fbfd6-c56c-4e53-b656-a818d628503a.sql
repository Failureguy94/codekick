-- Create learning_topics table for storing user-generated topic notes
CREATE TABLE public.learning_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  topic TEXT NOT NULL,
  notes TEXT NOT NULL,
  videos JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.learning_topics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own topics" 
  ON public.learning_topics FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own topics"
  ON public.learning_topics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own topics"
  ON public.learning_topics FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own topics"
  ON public.learning_topics FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER handle_learning_topics_updated_at
  BEFORE UPDATE ON public.learning_topics
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();