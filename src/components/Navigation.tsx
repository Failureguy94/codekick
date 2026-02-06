import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, User, Search, LogOut, Phone, CheckCircle, AlertCircle, BookOpen, Flame, Sparkles, Menu, X } from 'lucide-react';
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

const NavLink = ({
  onClick,
  children,
  isActive
}: {
  onClick: () => void;
  children: React.ReactNode;
  isActive?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${isActive
        ? 'text-foreground'
        : 'text-muted-foreground hover:text-foreground'
      }`}
  >
    <span className="relative z-10 flex items-center gap-2">{children}</span>
    {/* Hover/Active indicator */}
    <motion.span
      className="absolute bottom-0 left-0 right-0 h-px bg-foreground"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: isActive ? 1 : 0 }}
      whileHover={{ scaleX: 1 }}
      transition={{ duration: 0.2 }}
    />
  </button>
);

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [phoneVerified, setPhoneVerified] = useState<boolean | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadPhoneStatus();
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm'
          : 'bg-transparent'
        }`}
    >
      {/* Gradient accent line at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-9 h-9 bg-foreground rounded-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-lg">
              <span className="text-background font-bold text-lg">CK</span>
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">
              <span className="text-foreground">Code</span>
              <span className="text-muted-foreground">Kick</span>
            </span>
          </motion.button>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              <NavLink onClick={() => navigate('/dashboard')} isActive={isActive('/dashboard')}>
                <Home className="w-4 h-4" />
                Dashboard
              </NavLink>
              <NavLink onClick={() => navigate('/domains')} isActive={isActive('/domains')}>
                <BookOpen className="w-4 h-4" />
                Domains
              </NavLink>
              <NavLink onClick={() => navigate('/learn')} isActive={isActive('/learn')}>
                <Search className="w-4 h-4" />
                Learn
              </NavLink>
              <NavLink onClick={() => navigate('/track')} isActive={isActive('/track')}>
                <Flame className="w-4 h-4" />
                Track
              </NavLink>
              <NavLink onClick={() => navigate('/discover')} isActive={isActive('/discover')}>
                <Sparkles className="w-4 h-4" />
                Discover
              </NavLink>
            </div>
          )}

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user && (
              <>
                {/* Phone verification indicator */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/verify-phone')}
                        className="relative text-muted-foreground hover:text-foreground w-9 h-9"
                      >
                        <Phone className="w-4 h-4" />
                        {phoneVerified !== null && (
                          <span className="absolute -top-0.5 -right-0.5">
                            {phoneVerified ? (
                              <CheckCircle className="w-3 h-3 text-foreground" />
                            ) : (
                              <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <AlertCircle className="w-3 h-3 text-muted-foreground" />
                              </motion.span>
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

                {/* Profile button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/profile')}
                  className="text-muted-foreground hover:text-foreground w-9 h-9 hidden sm:flex"
                >
                  <User className="w-4 h-4" />
                </Button>

                {/* Sign out button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-muted-foreground hover:text-foreground hidden sm:flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Sign Out</span>
                </Button>

                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden text-muted-foreground hover:text-foreground w-9 h-9"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {user && (
        <motion.div
          initial={false}
          animate={{
            height: mobileMenuOpen ? 'auto' : 0,
            opacity: mobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
          className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b border-border/50"
        >
          <div className="px-4 py-4 space-y-1">
            {[
              { path: '/dashboard', icon: Home, label: 'Dashboard' },
              { path: '/domains', icon: BookOpen, label: 'Domains' },
              { path: '/learn', icon: Search, label: 'Learn' },
              { path: '/track', icon: Flame, label: 'Track' },
              { path: '/discover', icon: Sparkles, label: 'Discover' },
              { path: '/profile', icon: User, label: 'Profile' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.path)
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}

            <div className="pt-2 border-t border-border/50">
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};
