import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, User, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  coding_platform: string;
  linkedin: string;
  telegram: string;
}

interface UserProgress {
  domain: string;
  topic: string;
  completed: boolean;
}

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [searchQuery]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (searchQuery) {
        query = query.or(`username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      setUserProgress(data || []);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleUserClick = (user: UserProfile) => {
    setSelectedUser(user);
    loadUserProgress(user.id);
  };

  const completedCount = userProgress.filter((p) => p.completed).length;
  const totalCount = userProgress.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Discover Learners
          </h1>
          <p className="text-muted-foreground mb-6">
            Find and connect with other learners on their coding journey
          </p>

          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username or name..."
              className="pl-10"
            />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Users</h2>
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleUserClick(user)}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">@{user.username}</h3>
                          <p className="text-sm text-muted-foreground">{user.full_name}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div>
            {selectedUser ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{selectedUser.full_name}</h3>
                        <p className="text-muted-foreground">@{selectedUser.username}</p>
                      </div>
                    </div>

                    {selectedUser.bio && (
                      <div>
                        <h4 className="font-semibold mb-2">About</h4>
                        <p className="text-sm text-muted-foreground">{selectedUser.bio}</p>
                      </div>
                    )}

                    {(selectedUser.linkedin || selectedUser.telegram || selectedUser.coding_platform) && (
                      <div>
                        <h4 className="font-semibold mb-2">Links</h4>
                        <div className="space-y-2">
                          {selectedUser.linkedin && (
                            <a
                              href={selectedUser.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                              <ExternalLink className="w-4 h-4" />
                              LinkedIn
                            </a>
                          )}
                          {selectedUser.telegram && (
                            <p className="text-sm">Telegram: {selectedUser.telegram}</p>
                          )}
                          {selectedUser.coding_platform && (
                            <p className="text-sm">Platform: {selectedUser.coding_platform}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-2">Learning Progress</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Completed</span>
                          <Badge variant="secondary">
                            {completedCount} / {totalCount}
                          </Badge>
                        </div>
                        {userProgress.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {Object.entries(
                              userProgress.reduce((acc, prog) => {
                                acc[prog.domain] = (acc[prog.domain] || 0) + (prog.completed ? 1 : 0);
                                return acc;
                              }, {} as Record<string, number>)
                            ).map(([domain, count]) => (
                              <div key={domain} className="flex items-center justify-between text-sm">
                                <span className="capitalize">{domain}</span>
                                <Badge>{count} completed</Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center text-muted-foreground p-8">
                  <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a user to view their profile and progress</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
