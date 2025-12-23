import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Chrome } from 'lucide-react';
import { Navigation } from '@/components/Navigation';

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      if (data.user) {
        // Check if phone is verified
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
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if phone is verified
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
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/verify-phone`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
      setLoading(false);
    }
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
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-secondary/50 hover:bg-secondary border-border/50"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <Chrome className="w-5 h-5 mr-2" />
                    Sign in with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card/80 px-2 text-muted-foreground">
                        Or continue with email
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="bg-secondary/30 border-border/50 focus:border-primary/50"
                    />
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
                  <Button
                    type="submit"
                    variant="glow"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-secondary/50 hover:bg-secondary border-border/50"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <Chrome className="w-5 h-5 mr-2" />
                    Sign up with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card/80 px-2 text-muted-foreground">
                        Or create account with email
                      </span>
                    </div>
                  </div>
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
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="johndoe"
                      className="bg-secondary/30 border-border/50 focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="bg-secondary/30 border-border/50 focus:border-primary/50"
                    />
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
                  <Button
                    type="submit"
                    variant="glow"
                    className="w-full"
                    disabled={loading}
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
