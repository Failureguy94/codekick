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
import { Shield, ArrowRight, User, Lock, Sparkles } from 'lucide-react';

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

// Floating geometric decoration
const FloatingSquare = ({ delay, x, y, size, rotation }: { delay: number; x: number; y: number; size: number; rotation: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, rotate: rotation - 20 }}
    animate={{ opacity: 0.06, scale: 1, rotate: rotation }}
    transition={{ delay, duration: 1.2, ease: [0.2, 0, 0, 1] }}
    className="absolute pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <motion.div
      animate={{ rotate: [rotation, rotation + 180, rotation] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      style={{ width: size, height: size }}
      className="border border-foreground/20 dark:border-foreground/10"
    />
  </motion.div>
);

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [activeTab, setActiveTab] = useState('signin');

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

    const usernameError = validateUsername(username.trim());
    if (usernameError) {
      toast.error(usernameError);
      setLoading(false);
      return;
    }

    try {
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

      if (security.requireCaptcha && captchaToken) {
        const captchaValid = await verifyCaptcha(captchaToken);
        if (!captchaValid) {
          toast.error('Security verification failed. Please try again.');
          setCaptchaToken(null);
          setLoading(false);
          return;
        }
      }

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
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      if (errorMessage.includes('already registered') ||
        errorMessage.includes('Database error saving new user') ||
        errorMessage.includes('duplicate key') ||
        errorMessage.includes('unique constraint')) {
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

    const usernameError = validateUsername(username.trim());
    if (usernameError) {
      toast.error(usernameError);
      setLoading(false);
      return;
    }

    try {
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

      if (security.requireCaptcha && captchaToken) {
        const captchaValid = await verifyCaptcha(captchaToken);
        if (!captchaValid) {
          toast.error('Security verification failed. Please try again.');
          setCaptchaToken(null);
          setLoading(false);
          return;
        }
      }

      const fakeEmail = `${username.trim()}@codekick.local`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password,
      });

      const success = !error;
      await recordAttempt('login', success);

      if (error) {
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);

        if (newFailedAttempts >= 3) {
          setShowCaptcha(true);
        }

        throw new Error('Invalid credentials');
      }

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

  const geometricShapes = [
    { delay: 0, x: 5, y: 20, size: 60, rotation: 45 },
    { delay: 0.2, x: 90, y: 15, size: 40, rotation: 0 },
    { delay: 0.4, x: 8, y: 75, size: 80, rotation: 15 },
    { delay: 0.6, x: 88, y: 70, size: 50, rotation: 30 },
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background relative overflow-hidden noise-overlay">
        {/* Dot grid background */}
        <div className="absolute inset-0 bg-dots opacity-30" />

        {/* Geometric decorations */}
        {geometricShapes.map((shape, index) => (
          <FloatingSquare key={index} {...shape} />
        ))}

        {/* Subtle gradient orb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[150px] bg-foreground/[0.02] dark:bg-foreground/[0.01] pointer-events-none"
        />

        <div className="min-h-screen flex items-center justify-center p-4 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
            className="w-full max-w-md relative z-10"
          >
            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0, 0, 1] }}
                className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-border/60 bg-card/50 backdrop-blur-sm"
              >
                <Sparkles className="w-3 h-3 text-foreground/60" />
                <span className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
                  {activeTab === 'signin' ? 'Welcome back' : 'Join us'}
                </span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl font-bold tracking-tight mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.2, 0, 0, 1] }}
              >
                <span>Code</span>
                <span className="text-muted-foreground">Kick</span>
              </motion.h1>

              <motion.p
                className="text-muted-foreground font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Start your learning journey today
              </motion.p>
            </div>

            {/* Auth Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.2, 0, 0, 1] }}
            >
              <Card variant="glass" className="p-8 border border-border/60 bg-card/80 backdrop-blur-xl">
                <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-lg">
                    <TabsTrigger
                      value="signin"
                      className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all duration-300"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all duration-300"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin">
                    <form onSubmit={handleSignIn} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="signin-username" className="text-sm font-medium flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                          Username
                        </Label>
                        <Input
                          id="signin-username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          placeholder="your_username"
                          className="h-12 bg-muted/30 border-border/50 focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 transition-all duration-300"
                        />
                        <p className="text-xs text-muted-foreground">Username is case-sensitive</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-sm font-medium flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                          Password
                        </Label>
                        <Input
                          id="signin-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          className="h-12 bg-muted/30 border-border/50 focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 transition-all duration-300"
                        />
                      </div>

                      {securityMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border text-foreground/80 text-sm"
                        >
                          <Shield className="w-4 h-4 flex-shrink-0" />
                          <span>{securityMessage}</span>
                        </motion.div>
                      )}

                      {showCaptcha && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex justify-center py-2"
                        >
                          <Turnstile
                            siteKey={TURNSTILE_SITE_KEY}
                            onSuccess={handleCaptchaSuccess}
                            onError={handleCaptchaError}
                            onExpire={() => setCaptchaToken(null)}
                          />
                        </motion.div>
                      )}

                      <Button
                        type="submit"
                        className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-medium group transition-all duration-300"
                        disabled={loading || (showCaptcha && !captchaToken)}
                      >
                        <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                        {!loading && (
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="fullname" className="text-sm font-medium">Full Name</Label>
                        <Input
                          id="fullname"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          placeholder="John Doe"
                          className="h-12 bg-muted/30 border-border/50 focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 transition-all duration-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-username" className="text-sm font-medium flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                          Username
                        </Label>
                        <Input
                          id="signup-username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          placeholder="your_username"
                          className="h-12 bg-muted/30 border-border/50 focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 transition-all duration-300"
                        />
                        <p className="text-xs text-muted-foreground">Case-sensitive • Letters, numbers, underscores only</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-sm font-medium flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                          Password
                        </Label>
                        <Input
                          id="signup-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          minLength={6}
                          className="h-12 bg-muted/30 border-border/50 focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 transition-all duration-300"
                        />
                      </div>

                      {securityMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border text-foreground/80 text-sm"
                        >
                          <Shield className="w-4 h-4 flex-shrink-0" />
                          <span>{securityMessage}</span>
                        </motion.div>
                      )}

                      {showCaptcha && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex justify-center py-2"
                        >
                          <Turnstile
                            siteKey={TURNSTILE_SITE_KEY}
                            onSuccess={handleCaptchaSuccess}
                            onError={handleCaptchaError}
                            onExpire={() => setCaptchaToken(null)}
                          />
                        </motion.div>
                      )}

                      <Button
                        type="submit"
                        className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-medium group transition-all duration-300"
                        disabled={loading || (showCaptcha && !captchaToken)}
                      >
                        <span>{loading ? 'Creating account...' : 'Create Account'}</span>
                        {!loading && (
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </Card>
            </motion.div>

            {/* Bottom decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.2, 0, 0, 1] }}
              className="mt-8 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Auth;