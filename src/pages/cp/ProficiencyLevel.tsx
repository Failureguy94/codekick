import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { GraduationCap, TrendingUp, Zap } from "lucide-react";

const levels = [
  {
    id: "beginner",
    name: "Beginner",
    icon: GraduationCap,
    description: "Just starting your CP journey",
    recommendation: "Focus on learning the basics and fundamental concepts",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    icon: TrendingUp,
    description: "Comfortable with basics, ready to level up",
    recommendation: "Time to dive into algorithms and data structures",
  },
  {
    id: "advanced",
    name: "Advanced",
    icon: Zap,
    description: "Strong foundation, aiming for the top",
    recommendation: "Master advanced concepts and challenging problems",
  },
];

const ProficiencyLevel = () => {
  const navigate = useNavigate();
  const { language } = useParams();

  const handleSelect = (levelId: string) => {
    navigate(`/cp/${language}/${levelId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Select Your Level
        </h1>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Choose your current proficiency level in {language?.toUpperCase()}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {levels.map((level, index) => {
            const Icon = level.icon;
            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSelect(level.id)}
                className="cursor-pointer"
              >
                <div className="bg-card rounded-2xl p-8 shadow-elegant hover:shadow-glow transition-all duration-300 border-2 border-transparent hover:border-primary/50">
                  <Icon className="w-16 h-16 text-primary mb-4 mx-auto" />
                  <h3 className="text-2xl font-bold text-center mb-2 text-foreground">
                    {level.name}
                  </h3>
                  <p className="text-center text-muted-foreground mb-4">
                    {level.description}
                  </p>
                  <div className="bg-primary/10 rounded-lg p-4">
                    <p className="text-sm text-center text-foreground">
                      {level.recommendation}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ProficiencyLevel;
