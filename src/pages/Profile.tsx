import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FlipHorizontal, Upload, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);
  const [profileData, setProfileData] = useState({
    codingPlatforms: "",
    telegram: "",
    linkedin: "",
    about: "",
    profilePic: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileData({ ...profileData, profilePic: e.target.files[0] });
      toast.success("Profile picture uploaded!");
    }
  };

  const handleFlip = () => {
    if (!isFlipped) {
      // Save data when flipping to back
      localStorage.setItem("profileData", JSON.stringify(profileData));
      toast.success("Profile information saved!");
    }
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-primary bg-clip-text text-transparent"
        >
          Create Your Profile
        </motion.h1>

        <div className="perspective-1000">
          <motion.div
            className="relative w-full h-[600px] preserve-3d"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Front of Card */}
            <div className={`absolute w-full h-full backface-hidden ${isFlipped ? "invisible" : "visible"}`}>
              <div className="bg-card rounded-2xl shadow-elegant p-8 h-full relative">
                <button
                  onClick={handleFlip}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <FlipHorizontal className="w-5 h-5 text-primary" />
                </button>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Coding Platform Handles & URLs
                    </label>
                    <input
                      type="text"
                      name="codingPlatforms"
                      value={profileData.codingPlatforms}
                      onChange={handleInputChange}
                      placeholder="e.g., LeetCode: user123, GitHub: github.com/user"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Telegram Handle
                    </label>
                    <input
                      type="text"
                      name="telegram"
                      value={profileData.telegram}
                      onChange={handleInputChange}
                      placeholder="@username"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      LinkedIn Profile
                    </label>
                    <input
                      type="text"
                      name="linkedin"
                      value={profileData.linkedin}
                      onChange={handleInputChange}
                      placeholder="linkedin.com/in/username"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      About Yourself
                    </label>
                    <textarea
                      name="about"
                      value={profileData.about}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Tell us about yourself, your interests, and goals..."
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Back of Card */}
            <div
              className={`absolute w-full h-full backface-hidden ${isFlipped ? "visible" : "invisible"}`}
              style={{ transform: "rotateY(180deg)" }}
            >
              <div className="bg-card rounded-2xl shadow-elegant p-8 h-full relative">
                <button
                  onClick={handleFlip}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <FlipHorizontal className="w-5 h-5 text-primary" />
                </button>

                <div className="flex flex-col items-center justify-center h-full space-y-6">
                  <h3 className="text-2xl font-semibold text-foreground">Upload Profile Picture</h3>
                  
                  <div className="relative">
                    <input
                      type="file"
                      id="profilePic"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="profilePic"
                      className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-primary/50 rounded-xl cursor-pointer hover:border-primary transition-colors bg-primary/5"
                    >
                      {profileData.profilePic ? (
                        <div className="text-center">
                          <div className="text-success text-lg font-medium mb-2">File Selected</div>
                          <div className="text-sm text-muted-foreground">{profileData.profilePic.name}</div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-primary mb-4" />
                          <span className="text-primary font-medium">Click to upload</span>
                          <span className="text-sm text-muted-foreground mt-2">PNG, JPG up to 10MB</span>
                        </>
                      )}
                    </label>
                  </div>

                  <button
                    onClick={() => navigate("/domains")}
                    className="px-8 py-4 bg-gradient-primary text-white rounded-xl font-semibold shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  >
                    Let's Upskill <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default Profile;
