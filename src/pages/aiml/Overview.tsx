import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { aimlSteps } from "@/data/aimlResources";

const Overview = () => {
  const navigate = useNavigate();
  const completedSteps = JSON.parse(localStorage.getItem("completedSteps") || "[]");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-primary bg-clip-text text-transparent">
            AI/ML Learning Roadmap
          </h1>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            A structured 5-step journey to master Artificial Intelligence and Machine Learning
          </p>

          <div className="space-y-8">
            {aimlSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connecting Line */}
                {index < aimlSteps.length - 1 && (
                  <div className="absolute left-8 top-24 w-0.5 h-16 bg-gradient-to-b from-primary to-accent -z-10" />
                )}

                <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border hover:border-primary/50 transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                        {step.step}
                      </div>
                      {completedSteps.includes(step.step) && (
                        <div className="flex items-center justify-center mt-2">
                          <CheckCircle2 className="w-6 h-6 text-success" />
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold mb-2 text-foreground">{step.title}</h2>
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      
                      <div className="mb-4">
                        <h3 className="font-semibold text-foreground mb-2">Topics:</h3>
                        <div className="flex flex-wrap gap-2">
                          {step.keyTopics.slice(0, 3).map((topic, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                            >
                              {topic}
                            </span>
                          ))}
                          {step.keyTopics.length > 3 && (
                            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                              +{step.keyTopics.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/aiml/step-${step.step}`)}
                        disabled={index > 0 && !completedSteps.includes(index)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          index > 0 && !completedSteps.includes(index)
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-gradient-primary text-white hover:shadow-glow hover:scale-105"
                        }`}
                      >
                        {completedSteps.includes(step.step) ? "Review" : "Start"} Step {step.step}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <button
              onClick={() => navigate("/aiml/papers")}
              className="px-8 py-4 bg-accent text-white rounded-xl font-semibold shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              View Research Papers
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;
