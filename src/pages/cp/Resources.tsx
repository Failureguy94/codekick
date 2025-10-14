import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ExternalLink, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { beginnerResources, intermediateResources, advancedResources } from "@/data/cpResources";

const Resources = () => {
  const { language, level } = useParams();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);

  const getResources = () => {
    switch (level) {
      case "beginner":
        return beginnerResources;
      case "intermediate":
        return intermediateResources;
      case "advanced":
        return advancedResources;
      default:
        return beginnerResources;
    }
  };

  const resources = getResources();

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            {resources.title}
          </h1>
          <p className="text-muted-foreground mb-2 text-lg">{resources.description}</p>
          <p className="text-foreground font-medium mb-8">
            Language: <span className="text-primary">{language?.toUpperCase()}</span>
          </p>

          {level === "beginner" && "recommendation" in resources && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-2xl p-6 mb-8 shadow-elegant border-2 border-primary/20"
            >
              <h3 className="text-xl font-semibold mb-3 text-foreground">Our Recommendation</h3>
              <p className="text-muted-foreground mb-4">{resources.recommendation}</p>
              <a
                href={resources.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-glow transition-all duration-300"
              >
                Start Learning on YouTube <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          )}

          <div className="space-y-6">
            {resources.sections.map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="bg-card rounded-2xl shadow-elegant overflow-hidden border border-border"
              >
                <button
                  onClick={() => toggleSection(sectionIndex)}
                  className="w-full p-6 flex items-center justify-between hover:bg-primary/5 transition-colors"
                >
                  <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                  {expandedSections.includes(sectionIndex) ? (
                    <ChevronUp className="w-6 h-6 text-primary" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-primary" />
                  )}
                </button>

                {expandedSections.includes(sectionIndex) && (
                  <div className="px-6 pb-6 space-y-6">
                    {section.items ? (
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      section.contents?.map((content, contentIndex) => (
                        <div key={contentIndex} className="bg-secondary/50 rounded-lg p-4">
                          <h3 className="font-semibold text-foreground mb-3">{content.name}</h3>
                          <div className="space-y-2">
                            {content.links.map((link, linkIndex) => (
                              <a
                                key={linkIndex}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
                              >
                                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                <span>{link.title}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <button
              onClick={() => navigate("/cp/blogs")}
              className="px-8 py-4 bg-accent text-white rounded-xl font-semibold shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              View Daily CP Blogs
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Resources;
