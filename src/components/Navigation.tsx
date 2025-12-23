import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, Search, LogOut, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const Navigation = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [phoneVerified, setPhoneVerified] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      loadPhoneStatus();
    }
  }, [user]);

  const loadPhoneStatus = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('phone_verified')
        .eq('id', user?.id)
        .maybeSingle();
      
      setPhoneVerified(data?.phone_verified ?? false);
    } catch (error) {
      console.error('Error loading phone status:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border/50">
      {/* Gradient accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 group"
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all duration-300 group-hover:scale-105">
              <span className="text-primary-foreground font-bold text-xl">CK</span>
            </div>
            <span className="text-xl font-bold text-gradient">
              CodeKick
            </span>
          </button>

          {user && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/domains')}
                className="text-muted-foreground hover:text-foreground"
              >
                <Home className="w-4 h-4 mr-2" />
                Domains
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/discover')}
                className="text-muted-foreground hover:text-foreground"
              >
                <Search className="w-4 h-4 mr-2" />
                Discover
              </Button>
              <ThemeToggle />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/verify-phone')}
                      className="relative text-muted-foreground hover:text-foreground"
                    >
                      <Phone className="w-4 h-4" />
                      {phoneVerified !== null && (
                        <span className="absolute -top-1 -right-1">
                          {phoneVerified ? (
                            <CheckCircle className="w-3 h-3 text-success" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-accent" />
                          )}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {phoneVerified ? 'Phone verified' : 'Verify phone number'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/profile')}
                className="text-muted-foreground hover:text-foreground"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
