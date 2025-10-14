import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";

const ADMIN_PASSWORD = "Maddy-Folks";

const DailyBlogs = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "Getting Started with Codeforces",
      date: "2025-01-15",
      content: "Learn how to create and optimize your Codeforces account. Understand the rating system and choose the right contests to participate in.",
    },
    {
      id: 2,
      title: "LeetCode Contest Strategies",
      date: "2025-01-14",
      content: "Master the art of participating in LeetCode weekly contests. Time management tips and common mistakes to avoid.",
    },
    {
      id: 3,
      title: "Understanding CodeChef Long Challenge",
      date: "2025-01-13",
      content: "Deep dive into CodeChef's monthly Long Challenge. Learn when to use which data structures and how to approach editorial problems.",
    },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");

  const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowPasswordModal(false);
      toast.success("Admin access granted!");
    } else {
      toast.error("Incorrect password!");
    }
    setPasswordInput("");
  };

  const startEdit = (blog: any) => {
    setEditingId(blog.id);
    setEditTitle(blog.title);
    setEditContent(blog.content);
  };

  const saveEdit = () => {
    setBlogs(blogs.map(blog =>
      blog.id === editingId
        ? { ...blog, title: editTitle, content: editContent }
        : blog
    ));
    setEditingId(null);
    toast.success("Blog updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Daily CP Blogs
            </h1>
            <p className="text-muted-foreground">Stay updated with the latest in competitive programming</p>
          </div>
          
          {!isAdmin && (
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:shadow-glow transition-all"
            >
              <Lock className="w-4 h-4" />
              Admin Access
            </button>
          )}
        </motion.div>

        <div className="space-y-6">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-elegant border border-border"
            >
              {editingId === blog.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-2 px-4 py-2 bg-destructive text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{blog.title}</h2>
                      <p className="text-sm text-muted-foreground mt-1">{blog.date}</p>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => startEdit(blog)}
                        className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{blog.content}</p>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-8 max-w-md w-full shadow-glow"
          >
            <h2 className="text-2xl font-bold mb-4 text-foreground">Admin Access</h2>
            <p className="text-muted-foreground mb-6">Enter the admin password to edit content</p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-glow transition-all"
              >
                Submit
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-3 bg-secondary text-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DailyBlogs;
