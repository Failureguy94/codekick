import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { Turnstile } from '@marsidev/react-turnstile';
import { Shield } from 'lucide-react';

// Turnstile site key - this is public and safe to expose
const TURNSTILE_SITE_KEY = '0x4AAAAAAAgS7Pz7KlPJf9Em';

interface SecurityCheckResponse {
  allowed: boolean;
  requireCaptcha: boolean;
  reason?: string;
  lockoutMinutes?: number;
}

// Username validation helper
const validateUsername = (username: string): string | null => {
  if (username.length < 3) {
    return 'Username must be at least 3 characters';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  return null;
};

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Security states
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [securityMessage, setSecurityMessage] = useState<string | null>(null);

  // Reset captcha when username changes
  useEffect(() => {
    setShowCaptcha(false);
    setCaptchaToken(null);
    setSecurityMessage(null);
  }, [username]);

  const checkSecurity = async (endpoint: 'login' | 'register'): Promise<SecurityCheckResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke('auth-security', {
        body: { action: 'check', endpoint, username: endpoint === 'login' ? username.trim() : undefined }
      });
      
      if (error) throw error;
      return data as SecurityCheckResponse;
    } catch (error) {
      console.error('Security check failed:', error);
      // Allow the request if security check fails (fail-open for availability)
      return { allowed: true, requireCaptcha: false };
    }
  };

  const recordAttempt = async (endpoint: 'login' | 'register', success: boolean) => {
    try {
      await supabase.functions.invoke('auth-security', {
        body: { action: 'record', endpoint, username: username.trim(), success }
      });
    } catch (error) {
      console.error('Failed to record attempt:', error);
    }
  };

  const verifyCaptcha = async (token: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('auth-security', {
        body: { action: 'verify-captcha', captchaToken: token }
      });
      
      if (error) throw error;
      return data?.success === true;
    } catch (error) {
      console.error('CAPTCHA verification failed:', error);
      return false;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSecurityMessage(null);

    // Validate username
    const usernameError = validateUsername(username.trim());
    if (usernameError) {
      toast.error(usernameError);
      setLoading(false);
      return;
    }

    try {
      // Security check
      const security = await checkSecurity('register');
      
      if (!security.allowed) {
        setSecurityMessage(security.reason || 'Registration temporarily unavailable.');
        toast.error(security.reason || 'Registration temporarily unavailable.');
        setLoading(false);
        return;
      }

      if (security.requireCaptcha && !captchaToken) {
        setShowCaptcha(true);
        setSecurityMessage('Please complete the security verification.');
        setLoading(false);
        return;
      }

      // Verify CAPTCHA if required
      if (security.requireCaptcha && captchaToken) {
        const captchaValid = await verifyCaptcha(captchaToken);
        if (!captchaValid) {
          toast.error('Security verification failed. Please try again.');
          setCaptchaToken(null);
          setLoading(false);
          return;
        }
      }

      // Convert username to fake email for Supabase Auth (case-preserving)
      const fakeEmail = `${username.trim()}@codekick.local`;

      const { data, error } = await supabase.auth.signUp({
        email: fakeEmail,
        password,
        options: {
          data: {
            username: username.trim(),
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      // Record the attempt
      await recordAttempt('register', !error);

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('phone_verified')
          .eq('id', data.user.id)
          .single();

        toast.success('Account created successfully!');
        
        if (!profile?.phone_verified) {
          navigate('/verify-phone');
        } else {
          navigate('/');
        }
      }
    } catch (error: unknown) {
      // Generic error message to prevent user existence leaks
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      if (errorMessage.includes('already registered')) {
        toast.error('Username is already taken. Please choose another.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSecurityMessage(null);

    // Validate username
    const usernameError = validateUsername(username.trim());
    if (usernameError) {
      toast.error(usernameError);
      setLoading(false);
      return;
    }

    try {
      // Security check
      const security = await checkSecurity('login');
      
      if (!security.allowed) {
        setSecurityMessage(security.reason || 'Login temporarily unavailable.');
        toast.error(security.reason || 'Login temporarily unavailable.');
        setLoading(false);
        return;
      }

      if (security.requireCaptcha && !captchaToken) {
        setShowCaptcha(true);
        setSecurityMessage('Please complete the security verification.');
        setLoading(false);
        return;
      }

      // Verify CAPTCHA if required
      if (security.requireCaptcha && captchaToken) {
        const captchaValid = await verifyCaptcha(captchaToken);
        if (!captchaValid) {
          toast.error('Security verification failed. Please try again.');
          setCaptchaToken(null);
          setLoading(false);
          return;
        }
      }

      // Convert username to fake email for Supabase Auth (case-preserving)
      const fakeEmail = `${username.trim()}@codekick.local`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password,
      });

      // Record the attempt
      const success = !error;
      await recordAttempt('login', success);

      if (error) {
        // Increment local failed attempts counter for CAPTCHA trigger
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        
        if (newFailedAttempts >= 3) {
          setShowCaptcha(true);
        }
        
        // Generic error message - don't reveal if user exists or not
        throw new Error('Invalid credentials');
      }

      // Reset failed attempts on success
      setFailedAttempts(0);
      setShowCaptcha(false);
      setCaptchaToken(null);

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('phone_verified')
          .eq('id', data.user.id)
          .single();

        toast.success('Signed in successfully!');
        
        if (!profile?.phone_verified) {
          navigate('/verify-phone');
        } else {
          navigate('/');
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid credentials';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaSuccess = (token: string) => {
    setCaptchaToken(token);
    setSecurityMessage(null);
  };

  const handleCaptchaError = () => {
    setCaptchaToken(null);
    setSecurityMessage('Security verification failed. Please try again.');
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background bg-mesh flex items-center justify-center p-4 pt-20">
        {/* Ambient glow effects */}
        <div className="fixed top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-2">
              Welcome to CodeKick
            </h1>
            <p className="text-muted-foreground">Start your learning journey today</p>
          </div>

          <Card variant="glass" className="p-8">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-username">Username</Label>
                    <Input
                      id="signin-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="your_username"
                      className="bg-secondary/30 border-border/50 focus:border-primary/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Username is case-sensitive</p>
                  </div>
                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="bg-secondary/30 border-border/50 focus:border-primary/50"
                    />
                  </div>

                  {/* Security message */}
                  {securityMessage && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm">
                      <Shield className="w-4 h-4 flex-shrink-0" />
                      <span>{securityMessage}</span>
                    </div>
                  )}

                  {/* Conditional CAPTCHA */}
                  {showCaptcha && (
                    <div className="flex justify-center py-2">
                      <Turnstile
                        siteKey={TURNSTILE_SITE_KEY}
                        onSuccess={handleCaptchaSuccess}
                        onError={handleCaptchaError}
                        onExpire={() => setCaptchaToken(null)}
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="glow"
                    className="w-full"
                    disabled={loading || (showCaptcha && !captchaToken)}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="John Doe"
                      className="bg-secondary/30 border-border/50 focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="your_username"
                      className="bg-secondary/30 border-border/50 focus:border-primary/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Case-sensitive • Letters, numbers, underscores only</p>
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      minLength={6}
                      className="bg-secondary/30 border-border/50 focus:border-primary/50"
                    />
                  </div>

                  {/* Security message */}
                  {securityMessage && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm">
                      <Shield className="w-4 h-4 flex-shrink-0" />
                      <span>{securityMessage}</span>
                    </div>
                  )}

                  {/* Conditional CAPTCHA */}
                  {showCaptcha && (
                    <div className="flex justify-center py-2">
                      <Turnstile
                        siteKey={TURNSTILE_SITE_KEY}
                        onSuccess={handleCaptchaSuccess}
                        onError={handleCaptchaError}
                        onExpire={() => setCaptchaToken(null)}
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="glow"
                    className="w-full"
                    disabled={loading || (showCaptcha && !captchaToken)}
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Auth;