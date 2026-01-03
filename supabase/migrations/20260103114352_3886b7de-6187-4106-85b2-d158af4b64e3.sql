-- Allow service role to manage rate_limits (edge functions use service role)
-- No user-facing policies needed since this table is only accessed by edge functions
CREATE POLICY "Allow all for service role" 
ON public.rate_limits 
FOR ALL 
USING (true) 
WITH CHECK (true);