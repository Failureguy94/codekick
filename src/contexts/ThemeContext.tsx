import { createContext, useContext, useEffect, ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ThemeContextType {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

// Inner component that has access to next-themes
const ThemeSync = ({ children }: { children: ReactNode }) => {
  const { theme, setTheme } = useNextTheme();
  const { user, session } = useAuth();

  // Load theme from Supabase user_metadata on mount/login
  useEffect(() => {
    if (user?.user_metadata?.theme) {
      setTheme(user.user_metadata.theme);
    }
  }, [user, setTheme]);

  // Save theme to Supabase when it changes (with deadlock prevention)
  useEffect(() => {
    if (user && theme && session) {
      // Defer to avoid auth state change deadlock
      setTimeout(async () => {
        const currentTheme = user.user_metadata?.theme;
        if (currentTheme !== theme) {
          await supabase.auth.updateUser({
            data: { theme }
          });
        }
      }, 0);
    }
  }, [theme, user, session]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Main provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <ThemeSync>{children}</ThemeSync>
    </NextThemesProvider>
  );
};

export const useTheme = () => useContext(ThemeContext);
