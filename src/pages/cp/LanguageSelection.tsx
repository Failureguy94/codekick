import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const languages = [
  {
    id: "cpp",
    name: "C++",
    advantages: [
      "Fastest execution speed",
      "Rich STL library",
      "Most popular in CP",
      "Extensive community support",
    ],
    disadvantages: [
      "Complex syntax",
      "Memory management challenges",
      "Steeper learning curve",
    ],
  },
  {
    id: "java",
    name: "Java",
    advantages: [
      "Strong OOP support",
      "Built-in BigInteger class",
      "Good error handling",
      "Platform independent",
    ],
    disadvantages: [
      "Slower than C++",
      "Verbose syntax",
      "Higher memory usage",
    ],
  },
  {
    id: "python",
    name: "Python",
    advantages: [
      "Easy to learn",
      "Clean syntax",
      "Fast prototyping",
      "Rich libraries",
    ],
    disadvantages: [
      "Slower execution",
      "Recursion depth limit",
      "Not ideal for time-critical problems",
    ],
  },
];

const LanguageCard = ({ language, onSelect }: any) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="perspective-1000 h-80"
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        className="relative w-full h-full preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => onSelect(language.id)}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="h-full rounded-2xl bg-gradient-primary p-8 flex flex-col items-center justify-center text-white shadow-elegant">
            <h3 className="text-4xl font-bold mb-4">{language.name}</h3>
            <p className="text-white/90 text-center">Click to select</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden" style={{ transform: "rotateY(180deg)" }}>
          <div className="h-full rounded-2xl bg-card border-2 border-primary/20 p-6 overflow-y-auto shadow-elegant">
            <h4 className="text-xl font-bold text-foreground mb-4">{language.name}</h4>
            
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-success mb-2">Advantages:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {language.advantages.map((adv, i) => (
                    <li key={i}>✓ {adv}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-destructive mb-2">Disadvantages:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {language.disadvantages.map((dis, i) => (
                    <li key={i}>✗ {dis}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LanguageSelection = () => {
  const navigate = useNavigate();

  const handleSelect = (langId: string) => {
    navigate(`/cp/${langId}/level`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Choose Your CP Language
        </h1>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Select the programming language you want to master for competitive programming
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {languages.map((language, index) => (
            <motion.div
              key={language.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <LanguageCard language={language} onSelect={handleSelect} />
            </motion.div>
          ))}
        </div>
      </motion.div>

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

export default LanguageSelection;
