import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limit configurations
const RATE_LIMITS = {
  login: { maxAttempts: 5, windowMinutes: 1 },
  register: { maxAttempts: 2, windowMinutes: 60 },
};

// Account lockout configuration
const LOCKOUT_CONFIG = {
  maxFailedAttempts: 5,
  lockoutMinutes: 15,
};

// CAPTCHA trigger threshold
const CAPTCHA_THRESHOLD = 3;

interface SecurityCheckRequest {
  action: "check" | "record" | "verify-captcha";
  username?: string;
  endpoint?: "login" | "register";
  success?: boolean;
  captchaToken?: string;
}

interface SecurityCheckResponse {
  allowed: boolean;
  requireCaptcha: boolean;
  reason?: string;
  lockoutMinutes?: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const turnstileSecretKey = Deno.env.get("TURNSTILE_SECRET_KEY");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client IP from headers
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || 
                     "unknown";

    const body: SecurityCheckRequest = await req.json();
    const { action, username, endpoint, success, captchaToken } = body;

    console.log(`Auth security check: action=${action}, endpoint=${endpoint}, ip=${clientIP}`);

    // Action: Verify CAPTCHA token
    if (action === "verify-captcha" && captchaToken) {
      if (!turnstileSecretKey) {
        // If no secret key configured, skip CAPTCHA verification
        return new Response(
          JSON.stringify({ success: true, message: "CAPTCHA verification skipped (not configured)" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const formData = new FormData();
      formData.append("secret", turnstileSecretKey);
      formData.append("response", captchaToken);
      formData.append("remoteip", clientIP);

      const verifyResponse = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        { method: "POST", body: formData }
      );

      const verifyResult = await verifyResponse.json();
      console.log("Turnstile verification result:", verifyResult);

      return new Response(
        JSON.stringify({ success: verifyResult.success }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action: Check security status before login/register
    if (action === "check" && endpoint) {
      const response: SecurityCheckResponse = {
        allowed: true,
        requireCaptcha: false,
      };

      // Check IP-based rate limiting
      const rateLimit = RATE_LIMITS[endpoint];
      const windowStart = new Date(Date.now() - rateLimit.windowMinutes * 60 * 1000);

      const { data: rateLimitData } = await supabase
        .from("rate_limits")
        .select("attempts, window_start")
        .eq("ip_address", clientIP)
        .eq("endpoint", endpoint)
        .single();

      if (rateLimitData) {
        const windowStartTime = new Date(rateLimitData.window_start);
        if (windowStartTime > windowStart) {
          // Still within rate limit window
          if (rateLimitData.attempts >= rateLimit.maxAttempts) {
            response.allowed = false;
            response.reason = "Too many attempts. Please try again later.";
            return new Response(JSON.stringify(response), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          // Check if approaching limit (trigger CAPTCHA)
          if (rateLimitData.attempts >= CAPTCHA_THRESHOLD) {
            response.requireCaptcha = true;
            response.reason = "Security verification required";
          }
        }
      }

      // Check account-specific status for login using username
      if (endpoint === "login" && username) {
        // Convert username to fake email pattern (case-sensitive)
        const fakeEmail = `${username}@codekick.local`;
        
        const { data: users } = await supabase.auth.admin.listUsers();
        const user = users.users.find(u => u.email === fakeEmail);

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, failed_login_attempts, locked_until")
            .eq("id", user.id)
            .single();

          if (profile) {
            // Check if account is locked
            if (profile.locked_until && new Date(profile.locked_until) > new Date()) {
              const lockoutRemaining = Math.ceil(
                (new Date(profile.locked_until).getTime() - Date.now()) / 60000
              );
              response.allowed = false;
              response.reason = `Account temporarily locked. Try again in ${lockoutRemaining} minute(s).`;
              response.lockoutMinutes = lockoutRemaining;
              return new Response(JSON.stringify(response), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              });
            }

            // Check if approaching lockout (trigger CAPTCHA)
            if (profile.failed_login_attempts >= CAPTCHA_THRESHOLD) {
              response.requireCaptcha = true;
              response.reason = "Security verification required";
            }
          }
        }
      }

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Action: Record login attempt result
    if (action === "record" && endpoint) {
      // Update IP rate limit
      const { data: existingLimit } = await supabase
        .from("rate_limits")
        .select("id, attempts")
        .eq("ip_address", clientIP)
        .eq("endpoint", endpoint)
        .single();

      if (existingLimit) {
        await supabase
          .from("rate_limits")
          .update({ 
            attempts: existingLimit.attempts + 1,
            window_start: new Date().toISOString()
          })
          .eq("id", existingLimit.id);
      } else {
        await supabase
          .from("rate_limits")
          .insert({
            ip_address: clientIP,
            endpoint,
            attempts: 1,
            window_start: new Date().toISOString(),
          });
      }

      // Update account-specific failed attempts for login using username
      if (endpoint === "login" && username) {
        // Convert username to fake email pattern (case-sensitive)
        const fakeEmail = `${username}@codekick.local`;
        
        const { data: users } = await supabase.auth.admin.listUsers();
        const user = users.users.find(u => u.email === fakeEmail);

        if (user) {
          if (success) {
            // Reset failed attempts on successful login
            await supabase
              .from("profiles")
              .update({
                failed_login_attempts: 0,
                locked_until: null,
                last_failed_attempt: null,
              })
              .eq("id", user.id);
          } else {
            // Increment failed attempts
            const { data: profile } = await supabase
              .from("profiles")
              .select("failed_login_attempts")
              .eq("id", user.id)
              .single();

            const newFailedAttempts = (profile?.failed_login_attempts || 0) + 1;
            const updateData: Record<string, unknown> = {
              failed_login_attempts: newFailedAttempts,
              last_failed_attempt: new Date().toISOString(),
            };

            // Lock account if threshold reached
            if (newFailedAttempts >= LOCKOUT_CONFIG.maxFailedAttempts) {
              updateData.locked_until = new Date(
                Date.now() + LOCKOUT_CONFIG.lockoutMinutes * 60 * 1000
              ).toISOString();
              console.log(`Account locked for user ${user.id} after ${newFailedAttempts} failed attempts`);
            }

            await supabase
              .from("profiles")
              .update(updateData)
              .eq("id", user.id);
          }
        }
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Auth security error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});