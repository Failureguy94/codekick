import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Edit, Save, X, Eye } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ADMIN_PASSWORD = "Maddy-Folks";

const Web3Insights = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const { data, error } = await supabase
        .from("web3_insights")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      console.error("Error fetching insights:", error);
      toast.error("Failed to load insights");
    } finally {
      setLoading(false);
    }
  };

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

  const startEdit = (insight: any) => {
    setEditingId(insight.id);
    setEditTitle(insight.title);
    setEditContent(insight.content);
  };

  const saveEdit = async () => {
    try {
      const { error } = await supabase
        .from("web3_insights")
        .update({ title: editTitle, content: editContent })
        .eq("id", editingId);

      if (error) throw error;

      setInsights(insights.map(insight =>
        insight.id === editingId
          ? { ...insight, title: editTitle, content: editContent }
          : insight
      ));
      setEditingId(null);
      setShowPreview(false);
      toast.success("Insight updated successfully!");
    } catch (error) {
      console.error("Error updating insight:", error);
      toast.error("Failed to update insight");
    }
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
              Web3 Insights & News
            </h1>
            <p className="text-muted-foreground">Stay updated with the latest in blockchain and Web3</p>
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

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading insights...</p>
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No insights available yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-elegant border border-border"
              >
                {editingId === insight.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-2 px-3 py-1 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        {showPreview ? "Edit" : "Preview"}
                      </button>
                    </div>
                    {showPreview ? (
                      <div className="w-full px-4 py-2 rounded-lg border border-border bg-background min-h-[150px] prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{editContent}</ReactMarkdown>
                      </div>
                    ) : (
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={6}
                        placeholder="Use Markdown for formatting: **bold**, *italic*, [links](url), etc."
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
                      />
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setShowPreview(false);
                        }}
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
                        <h2 className="text-2xl font-bold text-foreground">{insight.title}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{insight.date}</p>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => startEdit(insight)}
                          className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      )}
                    </div>
                    <div className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{insight.content}</ReactMarkdown>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
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

export default Web3Insights;
