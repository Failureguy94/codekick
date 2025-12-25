-- Create learning_activity table to track daily user activity for heatmap
CREATE TABLE public.learning_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  topics_count INTEGER DEFAULT 0,
  notes_generated INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

-- Enable Row Level Security
ALTER TABLE public.learning_activity ENABLE ROW LEVEL SECURITY;

-- RLS policies - users can only see/modify their own activity
CREATE POLICY "Users can view their own activity"
ON public.learning_activity
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
ON public.learning_activity
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity"
ON public.learning_activity
FOR UPDATE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_learning_activity_updated_at
BEFORE UPDATE ON public.learning_activity
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Function to increment activity (upsert pattern)
CREATE OR REPLACE FUNCTION public.increment_learning_activity(
  p_user_id UUID,
  p_topics_count INTEGER DEFAULT 0,
  p_notes_generated INTEGER DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.learning_activity (user_id, activity_date, topics_count, notes_generated)
  VALUES (p_user_id, CURRENT_DATE, p_topics_count, p_notes_generated)
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET
    topics_count = learning_activity.topics_count + EXCLUDED.topics_count,
    notes_generated = learning_activity.notes_generated + EXCLUDED.notes_generated,
    updated_at = now();
END;
$$;