-- Create blogs table for CP section
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create research_papers table for AI/ML section
CREATE TABLE public.research_papers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  summary TEXT NOT NULL,
  link TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;

-- Everyone can read blogs
CREATE POLICY "Blogs are viewable by everyone"
ON public.blogs FOR SELECT
USING (true);

-- Authenticated users can insert/update/delete blogs
CREATE POLICY "Authenticated users can insert blogs"
ON public.blogs FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update blogs"
ON public.blogs FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete blogs"
ON public.blogs FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Everyone can read research papers
CREATE POLICY "Papers are viewable by everyone"
ON public.research_papers FOR SELECT
USING (true);

-- Authenticated users can insert/update/delete papers
CREATE POLICY "Authenticated users can insert papers"
ON public.research_papers FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update papers"
ON public.research_papers FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete papers"
ON public.research_papers FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Create trigger for updated_at on blogs
CREATE TRIGGER update_blogs_updated_at
BEFORE UPDATE ON public.blogs
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger for updated_at on research_papers
CREATE TRIGGER update_research_papers_updated_at
BEFORE UPDATE ON public.research_papers
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();