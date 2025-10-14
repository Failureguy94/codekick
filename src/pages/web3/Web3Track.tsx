import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle, ArrowRight } from "lucide-react";

const web3Resources = [
  {
    step: 1,
    title: "React Fundamentals",
    description: "Master React before diving into Web3 development",
    url: "https://youtu.be/LuNPCSNr-nE",
    completed: false,
  },
  {
    step: 2,
    title: "Web3 Development Introduction",
    description: "Learn blockchain basics and Web3 concepts",
    url: "https://youtu.be/6aF6p2VUORE?si=jxUVT7Xd-2ZRmZqB",
    completed: false,
  },
  {
    step: 3,
    title: "Advanced Web3 Development",
    description: "Deep dive into smart contracts and dApps",
    url: "https://youtube.com/playlist?list=PLO5VPQH6OWdVQwpQfw9rZ67O6Pjfo6q-p&si=PFfrtJLrx_EeIoCG",
    completed: false,
  },
];

const Web3Track = () => {
  const [completedSteps, setCompletedSteps] = useState<number[]>(
    JSON.parse(localStorage.getItem("web3CompletedSteps") || "[]")
  );

  const handleComplete = (step: number) => {
    const updated = [...completedSteps, step];
    setCompletedSteps(updated);
    localStorage.setItem("web3CompletedSteps", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Web3 Development Track
          </h1>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Your pathway to becoming a blockchain developer
          </p>

          <div className="space-y-8">
            {web3Resources.map((resource, index) => (
              <motion.div
                key={resource.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connecting Line */}
                {index < web3Resources.length - 1 && (
                  <div className="absolute left-8 top-32 w-0.5 h-16 bg-gradient-to-b from-primary to-accent -z-10" />
                )}

                <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border hover:border-primary/50 transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                        {resource.step}
                      </div>
                      {completedSteps.includes(resource.step) && (
                        <div className="flex items-center justify-center mt-2">
                          <CheckCircle className="w-6 h-6 text-success" />
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold mb-2 text-foreground">{resource.title}</h2>
                      <p className="text-muted-foreground mb-6">{resource.description}</p>

                      <div className="flex flex-wrap gap-3">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                            index > 0 && !completedSteps.includes(index)
                              ? "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
                              : "bg-gradient-primary text-white hover:shadow-glow hover:scale-105"
                          }`}
                        >
                          Start Learning <ExternalLink className="w-4 h-4" />
                        </a>

                        {!completedSteps.includes(resource.step) && (
                          <button
                            onClick={() => handleComplete(resource.step)}
                            disabled={index > 0 && !completedSteps.includes(index)}
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                              index > 0 && !completedSteps.includes(index)
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : "bg-success text-white hover:opacity-90"
                            }`}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark as Complete
                          </button>
                        )}

                        {completedSteps.includes(resource.step) && (
                          <div className="inline-flex items-center gap-2 px-6 py-3 bg-success/10 text-success rounded-lg font-semibold">
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </div>
                        )}
                      </div>

                      {index > 0 && !completedSteps.includes(index) && (
                        <p className="text-sm text-muted-foreground mt-4">
                          Complete Step {index} to unlock this step
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-card rounded-2xl p-8 shadow-elegant border-2 border-accent/30"
          >
            <h2 className="text-2xl font-bold mb-4 text-foreground">Next Steps</h2>
            <p className="text-muted-foreground mb-4">
              After completing all three steps, you'll be ready to:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-success mt-1" />
                <span>Build decentralized applications (dApps)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-success mt-1" />
                <span>Work with smart contracts and Solidity</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-success mt-1" />
                <span>Integrate Web3 wallets like MetaMask</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-success mt-1" />
                <span>Deploy contracts on Ethereum and other blockchains</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Web3Track;
