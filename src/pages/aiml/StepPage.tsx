import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ExternalLink, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { aimlSteps } from "@/data/aimlResources";
import { toast } from "sonner";

const StepPage = () => {
  const { step } = useParams();
  const navigate = useNavigate();
  const currentStep = aimlSteps[parseInt(step || "0") - 1];
  const stepNumber = parseInt(step || "0");

  const handleComplete = () => {
    const completedSteps = JSON.parse(localStorage.getItem("completedSteps") || "[]");
    if (!completedSteps.includes(stepNumber)) {
      completedSteps.push(stepNumber);
      localStorage.setItem("completedSteps", JSON.stringify(completedSteps));
      toast.success("Step marked as complete!");
    }

    if (stepNumber < 5) {
      navigate(`/aiml/step-${stepNumber + 1}`);
    } else {
      navigate("/aiml/papers");
    }
  };

  if (!currentStep) {
    return <div>Step not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => stepNumber === 1 ? navigate("/aiml") : navigate(`/aiml/step-${stepNumber - 1}`)}
          className="mb-6 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {stepNumber === 1 ? "Back to AI/ML" : "Previous Step"}
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
              {currentStep.step}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {currentStep.title}
              </h1>
              <p className="text-muted-foreground text-lg mt-2">{currentStep.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl p-8 shadow-elegant border border-border"
            >
              <h2 className="text-2xl font-bold mb-6 text-foreground">Learning Resources</h2>
              <div className="space-y-4">
                {currentStep.resources.map((resource, index) => (
                  <div key={index} className="bg-primary/5 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">{resource.title}</h3>
                    <p className="text-muted-foreground mb-4">{resource.description}</p>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-glow transition-all duration-300"
                    >
                      Start Learning <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Key Topics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-8 shadow-elegant border border-border"
            >
              <h2 className="text-2xl font-bold mb-6 text-foreground">Key Topics to Master</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentStep.keyTopics.map((topic, index) => (
                  <li key={index} className="flex items-start gap-3 bg-secondary/50 rounded-lg p-4">
                    <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                    <span className="text-foreground">{topic}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Complete Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <button
                onClick={handleComplete}
                className="px-8 py-4 bg-gradient-primary text-white rounded-xl font-semibold text-lg shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                {stepNumber < 5 ? (
                  <>
                    Complete & Continue <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Complete Course <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StepPage;
