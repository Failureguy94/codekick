-- Create web3_insights table
CREATE TABLE public.web3_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.web3_insights ENABLE ROW LEVEL SECURITY;

-- Everyone can read insights
CREATE POLICY "Insights are viewable by everyone"
ON public.web3_insights FOR SELECT
USING (true);

-- Authenticated users can insert/update/delete insights
CREATE POLICY "Authenticated users can insert insights"
ON public.web3_insights FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update insights"
ON public.web3_insights FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete insights"
ON public.web3_insights FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Create trigger for updated_at
CREATE TRIGGER update_web3_insights_updated_at
BEFORE UPDATE ON public.web3_insights
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();