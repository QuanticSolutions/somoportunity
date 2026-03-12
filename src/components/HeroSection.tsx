import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-8 pb-20 md:pt-16 md:pb-32">
      {/* Background mesh */}
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute top-20 left-[10%] h-[500px] w-[500px] rounded-full bg-primary/[0.06] blur-[100px]" />
      <div className="absolute bottom-0 right-[5%] h-[400px] w-[400px] rounded-full bg-secondary/[0.05] blur-[120px]" />

      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent/60 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <Sparkles size={14} />
              Your gateway to global opportunities
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl xl:text-7xl"
          >
            Find Opportunities That{" "}
            <span className="text-gradient">Change Your Future</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            Access jobs, scholarships, grants, and fellowships from around the world.
            Built for Somali youth and communities ready to reach their full potential.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="btn-gradient font-bold text-base px-8 gap-2 rounded-xl h-12 shadow-sm"
              onClick={() => navigate("/opportunities")}
            >
              Explore Opportunities <ArrowRight size={18} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-accent font-semibold px-8 rounded-xl h-12"
              onClick={() => navigate("/services/hire-talent")}
            >
              Hire Talent
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 grid grid-cols-3 gap-8"
          >
            {[
              { value: "100+", label: "Active Opportunities" },
              { value: "2,500+", label: "Registered Users" },
              { value: "50+", label: "Countries Covered" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold text-foreground md:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
