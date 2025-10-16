import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Code2, Brain, Globe, Database, Cpu, Terminal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";

const FloatingIcon = ({ icon: Icon, delay, x, y }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.15, scale: 1 }}
    transition={{ delay, duration: 0.8 }}
    className="absolute"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <motion.div
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 6 + delay * 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Icon className="w-12 h-12 md:w-16 md:h-16 text-primary" strokeWidth={1.5} />
    </motion.div>
  </motion.div>
);

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const floatingIcons = [
    { icon: Code2, delay: 0, x: 10, y: 20 },
    { icon: Brain, delay: 0.2, x: 85, y: 15 },
    { icon: Globe, delay: 0.4, x: 15, y: 70 },
    { icon: Database, delay: 0.6, x: 80, y: 75 },
    { icon: Cpu, delay: 0.8, x: 50, y: 10 },
    { icon: Terminal, delay: 1, x: 45, y: 85 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 relative overflow-hidden">
      <Navigation />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-gradient-hero opacity-50" />
      
      {/* Floating Icons */}
      {floatingIcons.map((item, index) => (
        <FloatingIcon key={index} {...item} />
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Welcome to CodeKick
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Your journey into tech starts here. Discover the perfect domain for your skills and passions.
          </motion.p>

          <motion.button
            onClick={() => navigate(user ? "/domains" : "/auth")}
            className="px-8 py-4 bg-gradient-primary text-white rounded-xl font-semibold text-lg shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {user ? "Go to Domains" : "Get Started"}
          </motion.button>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-muted-foreground text-sm"
          >
            Scroll to explore
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
