import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Code2, Brain, Globe, Database, Cpu, Terminal, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";

// Floating geometric shapes for visual interest
const FloatingShape = ({ delay, x, y, size, rotation }: { delay: number; x: number; y: number; size: number; rotation: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.08, scale: 1 }}
    transition={{ delay, duration: 1, ease: [0.2, 0, 0, 1] }}
    className="absolute pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <motion.div
      animate={{
        rotate: [rotation, rotation + 90, rotation],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 20 + delay * 5,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{ width: size, height: size }}
      className="border border-foreground/20 dark:border-foreground/10"
    />
  </motion.div>
);

// Floating tech icons
const FloatingIcon = ({ icon: Icon, delay, x, y }: { icon: React.ElementType; delay: number; x: number; y: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, rotate: -10 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ delay, duration: 0.8, ease: [0.2, 0, 0, 1] }}
    className="absolute pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <motion.div
      animate={{
        y: [0, -15, 0],
        rotate: [0, 3, -3, 0],
      }}
      transition={{
        duration: 5 + delay * 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative"
    >
      <Icon
        className="w-10 h-10 md:w-14 md:h-14 text-foreground/15 dark:text-foreground/10"
        strokeWidth={1}
      />
    </motion.div>
  </motion.div>
);

// Animated line decoration
const AnimatedLine = ({ className }: { className?: string }) => (
  <motion.div
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{ duration: 1.2, ease: [0.2, 0, 0, 1], delay: 0.5 }}
    className={`h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent origin-left ${className}`}
  />
);

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const floatingIcons = [
    { icon: Code2, delay: 0.2, x: 8, y: 25 },
    { icon: Brain, delay: 0.4, x: 88, y: 18 },
    { icon: Globe, delay: 0.6, x: 12, y: 72 },
    { icon: Database, delay: 0.8, x: 85, y: 70 },
    { icon: Cpu, delay: 1.0, x: 50, y: 12 },
    { icon: Terminal, delay: 1.2, x: 45, y: 82 },
  ];

  const geometricShapes = [
    { delay: 0, x: 5, y: 15, size: 80, rotation: 45 },
    { delay: 0.2, x: 90, y: 25, size: 60, rotation: 0 },
    { delay: 0.4, x: 3, y: 75, size: 100, rotation: 15 },
    { delay: 0.6, x: 92, y: 80, size: 70, rotation: 30 },
    { delay: 0.8, x: 50, y: 5, size: 50, rotation: 60 },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden noise-overlay viewport-glow">
      <Navigation />

      {/* Dot grid background */}
      <div className="absolute inset-0 bg-dots opacity-50" />

      {/* Subtle gradient orbs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full blur-[120px] bg-foreground/[0.02] dark:bg-foreground/[0.01]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full blur-[100px] bg-foreground/[0.02] dark:bg-foreground/[0.01]"
      />

      {/* Geometric shapes */}
      {geometricShapes.map((shape, index) => (
        <FloatingShape key={index} {...shape} />
      ))}

      {/* Floating Icons */}
      {floatingIcons.map((item, index) => (
        <FloatingIcon key={index} {...item} />
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0, 0, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-border/60 bg-card/50 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-foreground/60" />
            <span className="text-sm text-muted-foreground font-medium tracking-wide">
              Start your tech journey
            </span>
          </motion.div>

          {/* Main heading with stagger animation */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0, 0, 1] }}
          >
            <span className="block">Welcome to</span>
            <motion.span
              className="block mt-2 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.2, 0, 0, 1] }}
            >
              <span className="relative">
                Code
                <motion.span
                  className="absolute -bottom-2 left-0 h-1 bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 1.2, ease: [0.2, 0, 0, 1] }}
                />
              </span>
              <span className="text-muted-foreground">Kick</span>
            </motion.span>
          </motion.h1>

          {/* Animated decorative line */}
          <AnimatedLine className="w-32 mx-auto my-8" />

          {/* Subheading */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.2, 0, 0, 1] }}
          >
            Your journey into tech starts here. Discover the perfect domain
            for your skills and passions with our guided learning paths.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            onClick={() => navigate(user ? "/domains" : "/auth")}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-glow hover:scale-[1.02]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.2, 0, 0, 1] }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Button shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <span className="relative z-10">
              {user ? "Go to Domains" : "Get Started"}
            </span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>

          {/* Secondary link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-6"
          >
            <button
              onClick={() => navigate('/discover')}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm link-underline"
            >
              Explore learning paths →
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-foreground/40 to-transparent" />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />
    </div>
  );
};

export default Home;
