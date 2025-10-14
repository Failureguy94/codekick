import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Edit, Save, X, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

const ADMIN_PASSWORD = "Maddy-Folks";

interface Paper {
  id: number;
  title: string;
  date: string;
  summary: string;
  link: string;
}

const ResearchPapers = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [papers, setPapers] = useState<Paper[]>([
    {
      id: 1,
      title: "Attention Is All You Need",
      date: "2025-01-15",
      summary: "Revolutionary paper introducing the Transformer architecture, the foundation of modern LLMs like GPT and BERT.",
      link: "https://arxiv.org/abs/1706.03762",
    },
    {
      id: 2,
      title: "Deep Residual Learning for Image Recognition",
      date: "2025-01-14",
      summary: "ResNet architecture that solved the vanishing gradient problem with skip connections, enabling very deep networks.",
      link: "https://arxiv.org/abs/1512.03385",
    },
    {
      id: 3,
      title: "BERT: Pre-training of Deep Bidirectional Transformers",
      date: "2025-01-13",
      summary: "Bidirectional transformer pre-training method that revolutionized NLP tasks and understanding of language models.",
      link: "https://arxiv.org/abs/1810.04805",
    },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Paper | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPaper, setNewPaper] = useState<Omit<Paper, "id">>({
    title: "",
    date: new Date().toISOString().split("T")[0],
    summary: "",
    link: "",
  });

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

  const startEdit = (paper: Paper) => {
    setEditingId(paper.id);
    setEditForm({ ...paper });
  };

  const saveEdit = () => {
    if (editForm) {
      setPapers(papers.map((p) => (p.id === editingId ? editForm : p)));
      setEditingId(null);
      setEditForm(null);
      toast.success("Paper updated successfully!");
    }
  };

  const addPaper = () => {
    if (newPaper.title && newPaper.summary && newPaper.link) {
      setPapers([...papers, { ...newPaper, id: Date.now() }]);
      setNewPaper({
        title: "",
        date: new Date().toISOString().split("T")[0],
        summary: "",
        link: "",
      });
      setShowAddModal(false);
      toast.success("Paper added successfully!");
    } else {
      toast.error("Please fill all fields!");
    }
  };

  const deletePaper = (id: number) => {
    setPapers(papers.filter((p) => p.id !== id));
    toast.success("Paper deleted!");
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
              Daily Research Papers
            </h1>
            <p className="text-muted-foreground">Stay updated with cutting-edge AI/ML research</p>
          </div>

          <div className="flex gap-2">
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Add Paper
              </button>
            )}
            {!isAdmin && (
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:shadow-glow transition-all"
              >
                <Lock className="w-4 h-4" />
                Admin
              </button>
            )}
          </div>
        </motion.div>

        <div className="space-y-6">
          {papers.map((paper, index) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-elegant border border-border"
            >
              {editingId === paper.id && editForm ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={editForm.link}
                    onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                    placeholder="Paper URL"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <textarea
                    value={editForm.summary}
                    onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                    rows={4}
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
                      onClick={() => {
                        setEditingId(null);
                        setEditForm(null);
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
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold text-foreground mb-1">{paper.title}</h2>
                      <p className="text-sm text-muted-foreground">{paper.date}</p>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(paper)}
                          className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePaper(paper.id)}
                          className="flex items-center gap-2 px-3 py-1 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">{paper.summary}</p>
                  <a
                    href={paper.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Read Paper →
                  </a>
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
            <p className="text-muted-foreground mb-6">Enter the admin password to manage content</p>
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

      {/* Add Paper Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-8 max-w-2xl w-full shadow-glow"
          >
            <h2 className="text-2xl font-bold mb-6 text-foreground">Add New Paper</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={newPaper.title}
                onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
                placeholder="Paper Title"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                value={newPaper.link}
                onChange={(e) => setNewPaper({ ...newPaper, link: e.target.value })}
                placeholder="Paper URL (e.g., arXiv link)"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                value={newPaper.summary}
                onChange={(e) => setNewPaper({ ...newPaper, summary: e.target.value })}
                rows={6}
                placeholder="Paper Summary"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={addPaper}
                  className="flex-1 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-glow transition-all"
                >
                  Add Paper
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-secondary text-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ResearchPapers;
