import { motion } from "framer-motion";
import { Code2, Palette, Database, Rocket } from "lucide-react";

const web2Skills = [
  {
    title: "Frontend Development",
    icon: Code2,
    description: "HTML, CSS, JavaScript, React, Vue, Angular",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Backend Development",
    icon: Database,
    description: "Node.js, Python, Java, APIs, Databases",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "UI/UX Design",
    icon: Palette,
    description: "Figma, Adobe XD, Design Systems, Prototyping",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "DevOps & Deployment",
    icon: Rocket,
    description: "Docker, CI/CD, Cloud Platforms, Git",
    color: "from-orange-500 to-red-500",
  },
];

const Web2Track = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Web2 Development
          </h1>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Master traditional web development skills
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {web2Skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-8 shadow-elegant border border-border hover:border-primary/50 transition-all duration-300"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-foreground">{skill.title}</h2>
                  <p className="text-muted-foreground">{skill.description}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl p-8 shadow-elegant border border-border"
          >
            <h2 className="text-2xl font-bold mb-6 text-foreground">Recommended Learning Path</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Start with Frontend Basics</h3>
                  <p className="text-muted-foreground">
                    Master HTML, CSS, and JavaScript fundamentals before moving to frameworks
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Learn a Modern Framework</h3>
                  <p className="text-muted-foreground">
                    Pick React, Vue, or Angular and build real projects to solidify your understanding
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Backend Development</h3>
                  <p className="text-muted-foreground">
                    Learn server-side programming, APIs, and database management
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Full-Stack Projects</h3>
                  <p className="text-muted-foreground">
                    Combine frontend and backend skills to build complete web applications
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Deploy and Scale</h3>
                  <p className="text-muted-foreground">
                    Learn DevOps, deployment strategies, and how to scale your applications
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-gradient-primary rounded-2xl p-8 text-white"
          >
            <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
            <p className="mb-6">
              Web2 development offers a solid foundation and countless opportunities. The skills you learn here are
              applicable across the entire web development ecosystem.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://developer.mozilla.org/en-US/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                MDN Web Docs
              </a>
              <a
                href="https://www.freecodecamp.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                FreeCodeCamp
              </a>
              <a
                href="https://www.theodinproject.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                The Odin Project
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Web2Track;
