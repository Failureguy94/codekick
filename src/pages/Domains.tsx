import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Code, Brain, Blocks, Globe2 } from "lucide-react";

interface Domain {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  salary: string;
  timeToMaster: string;
}

const domains: Domain[] = [
  {
    id: "cp",
    name: "CP/DSA",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    description: "Competitive Programming & Data Structures and Algorithms",
    advantages: [
      "Strong problem-solving skills",
      "Excellent for tech interviews",
      "High-paying job opportunities",
      "Logical thinking development",
    ],
    disadvantages: [
      "Steep learning curve",
      "Time-intensive practice needed",
      "Can be frustrating initially",
    ],
    salary: "$80K - $200K+ annually",
    timeToMaster: "12-18 months with consistent practice",
  },
  {
    id: "aiml",
    name: "AI/ML",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    description: "Artificial Intelligence & Machine Learning",
    advantages: [
      "Cutting-edge technology field",
      "High demand in the market",
      "Diverse applications",
      "Research opportunities",
    ],
    disadvantages: [
      "Requires strong math background",
      "Hardware-intensive",
      "Constantly evolving field",
    ],
    salary: "$90K - $250K+ annually",
    timeToMaster: "18-24 months including prerequisites",
  },
  {
    id: "web3",
    name: "Web3",
    icon: Blocks,
    color: "from-emerald-500 to-teal-500",
    description: "Blockchain & Decentralized Applications",
    advantages: [
      "Emerging technology",
      "High earning potential",
      "Remote work opportunities",
      "Innovation-driven",
    ],
    disadvantages: [
      "Market volatility",
      "Requires web2 foundation",
      "Security concerns",
    ],
    salary: "$70K - $180K+ annually",
    timeToMaster: "6-12 months with web2 background",
  },
  {
    id: "web2",
    name: "Web2",
    icon: Globe2,
    color: "from-orange-500 to-red-500",
    description: "Traditional Web Development",
    advantages: [
      "Wide job market",
      "Immediate practical applications",
      "Large community support",
      "Versatile skill set",
    ],
    disadvantages: [
      "Highly competitive",
      "Rapidly changing frameworks",
      "Can feel saturated",
    ],
    salary: "$60K - $150K+ annually",
    timeToMaster: "6-12 months for proficiency",
  },
];

const DomainCard = ({ domain }: { domain: Domain }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();
  const Icon = domain.icon;

  return (
    <motion.div
      className="perspective-1000 h-96"
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        className="relative w-full h-full preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => navigate(`/${domain.id}`)}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden">
          <div className={`h-full rounded-2xl bg-gradient-to-br ${domain.color} p-8 flex flex-col items-center justify-center text-white shadow-elegant`}>
            <Icon className="w-20 h-20 mb-6" strokeWidth={1.5} />
            <h3 className="text-3xl font-bold mb-4">{domain.name}</h3>
            <p className="text-center text-white/90">{domain.description}</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden" style={{ transform: "rotateY(180deg)" }}>
          <div className="h-full rounded-2xl bg-card border-2 border-primary/20 p-6 overflow-y-auto shadow-elegant">
            <h4 className="text-xl font-bold text-foreground mb-4">{domain.name} Overview</h4>
            
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-success mb-2">Advantages:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {domain.advantages.map((adv, i) => (
                    <li key={i}>• {adv}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-destructive mb-2">Disadvantages:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {domain.disadvantages.map((dis, i) => (
                    <li key={i}>• {dis}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-foreground">💰 Salary Range:</h5>
                <p className="text-sm text-muted-foreground">{domain.salary}</p>
              </div>

              <div>
                <h5 className="font-semibold text-foreground">⏱️ Time to Master:</h5>
                <p className="text-sm text-muted-foreground">{domain.timeToMaster}</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-primary font-medium">Click to explore →</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Domains = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Choose Your Domain
        </h1>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Hover over each card to see detailed information
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {domains.map((domain, index) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DomainCard domain={domain} />
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

export default Domains;
