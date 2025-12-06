-- Add unique constraint for upsert to work
ALTER TABLE public.user_progress 
ADD CONSTRAINT user_progress_unique_user_domain_topic 
UNIQUE (user_id, domain, topic);