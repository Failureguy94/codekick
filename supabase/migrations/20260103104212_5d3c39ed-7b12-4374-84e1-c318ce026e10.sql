-- Add failed login tracking columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS last_failed_attempt TIMESTAMPTZ DEFAULT NULL;

-- Create rate_limits table for IP-based tracking
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  attempts INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(ip_address, endpoint)
);

-- Enable RLS on rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create cleanup function for expired rate limits
CREATE OR REPLACE FUNCTION public.cleanup_expired_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete rate limit records older than 1 hour
  DELETE FROM public.rate_limits
  WHERE window_start < NOW() - INTERVAL '1 hour';
  
  -- Reset failed login attempts for unlocked accounts
  UPDATE public.profiles
  SET failed_login_attempts = 0, locked_until = NULL
  WHERE locked_until IS NOT NULL AND locked_until < NOW();
END;
$$;