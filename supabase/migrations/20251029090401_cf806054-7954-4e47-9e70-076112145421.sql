-- Add phone_number and phone_verified fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT '+1';

-- Create OTP verification table
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on otp_verifications
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Users can only view their own OTP records
CREATE POLICY "Users can view own OTP records"
ON public.otp_verifications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own OTP records
CREATE POLICY "Users can insert own OTP records"
ON public.otp_verifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own OTP records
CREATE POLICY "Users can update own OTP records"
ON public.otp_verifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_otp_user_phone ON public.otp_verifications(user_id, phone_number);

-- Function to clean up expired OTPs (optional, for maintenance)
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.otp_verifications
  WHERE expires_at < NOW() AND verified = FALSE;
END;
$$;