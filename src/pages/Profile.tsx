import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Save, Phone, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    full_name: "",
    bio: "",
    coding_platform: "",
    telegram: "",
    linkedin: "",
    phone_number: "",
    country_code: "+1",
    phone_verified: false,
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfileData({
          username: data.username || "",
          full_name: data.full_name || "",
          bio: data.bio || "",
          coding_platform: data.coding_platform || "",
          telegram: data.telegram || "",
          linkedin: data.linkedin || "",
          phone_number: data.phone_number || "",
          country_code: data.country_code || "+1",
          phone_verified: data.phone_verified || false,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profileData.username,
          full_name: profileData.full_name,
          bio: profileData.bio,
          coding_platform: profileData.coding_platform,
          telegram: profileData.telegram,
          linkedin: profileData.linkedin,
        })
        .eq('id', user?.id);

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePhone = async () => {
    if (!profileData.phone_number) {
      toast.error("Please enter a phone number");
      return;
    }
    
    setLoading(true);
    try {
      // Reset phone_verified to false when updating phone number
      const { error } = await supabase
        .from('profiles')
        .update({
          phone_number: profileData.phone_number,
          country_code: profileData.country_code,
          phone_verified: false,
        })
        .eq('id', user?.id);

      if (error) throw error;
      
      toast.success("Phone number updated! Please verify it.");
      navigate('/verify-phone');
    } catch (error: any) {
      toast.error(error.message || "Failed to update phone number");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Your Profile
          </h1>
          <p className="text-muted-foreground">Manage your information and connect with others</p>
        </motion.div>

        <Card className="shadow-elegant w-full max-w-lg">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profileData.username}
                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                placeholder="johndoe"
              />
            </div>

            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="coding_platform">Coding Platform</Label>
              <Input
                id="coding_platform"
                value={profileData.coding_platform}
                onChange={(e) => setProfileData({ ...profileData, coding_platform: e.target.value })}
                placeholder="e.g., LeetCode: user123"
              />
            </div>

            <div>
              <Label htmlFor="telegram">Telegram</Label>
              <Input
                id="telegram"
                value={profileData.telegram}
                onChange={(e) => setProfileData({ ...profileData, telegram: e.target.value })}
                placeholder="@username"
              />
            </div>

            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={profileData.linkedin}
                onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/domains')}
              >
                Go to Domains
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Phone Verification Card */}
        <Card className="shadow-elegant w-full max-w-lg mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Phone Verification
                </CardTitle>
                <CardDescription>
                  Verify your phone number for enhanced security
                </CardDescription>
              </div>
              <Badge variant={profileData.phone_verified ? "default" : "secondary"} className="flex items-center gap-1">
                {profileData.phone_verified ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    Not Verified
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="w-24">
                <Label htmlFor="country_code">Code</Label>
                <Input
                  id="country_code"
                  value={profileData.country_code}
                  onChange={(e) => setProfileData({ ...profileData, country_code: e.target.value })}
                  placeholder="+1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={profileData.phone_number}
                  onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                  placeholder="1234567890"
                />
              </div>
            </div>

            {profileData.phone_verified ? (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleUpdatePhone}
                  disabled={loading}
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Update & Re-verify
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate('/verify-phone')}
                className="w-full"
              >
                <Phone className="w-4 h-4 mr-2" />
                {profileData.phone_number ? 'Verify Phone Number' : 'Add & Verify Phone'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
