import { motion } from "framer-motion";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { GraduationCap, Briefcase, Building2, Award, Users, Globe, BookOpen, Calendar } from "lucide-react";

const categories = [
  { icon: GraduationCap, title: "Scholarships", desc: "Funding for academic excellence worldwide" },
  { icon: Briefcase, title: "Jobs", desc: "Career opportunities across industries" },
  { icon: Building2, title: "Internships", desc: "Hands-on professional experience" },
  { icon: Award, title: "Grants", desc: "Financial support for projects and research" },
  { icon: Users, title: "Fellowships", desc: "Leadership and development programs" },
  { icon: Globe, title: "Competitions", desc: "Showcase your talent globally" },
  { icon: Calendar, title: "Conferences", desc: "Networking and learning events" },
  { icon: BookOpen, title: "Training Programs", desc: "Skills development and workshops" },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }) };

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="hero-gradient py-20 md:py-28">
          <div className="container text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-extrabold text-primary-foreground mb-4">
              About Somopportunity
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
              Connecting global talent with life-changing opportunities around the world.
            </motion.p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 md:py-24">
          <div className="container max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6 text-muted-foreground leading-relaxed">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Our Story</h2>
              <p>
                Somopportunity was founded with a simple yet powerful mission: to democratize access to opportunities for talented individuals regardless of their background or location.
              </p>
              <p>
                We aggregate scholarships, jobs, internships, grants, fellowships, competitions, conferences, and training programs from around the globe into one easy-to-navigate platform. Whether you're a student looking for your first scholarship or a professional seeking your next career move, Somopportunity is here to help you discover what's possible.
              </p>
              <p>
                Our platform serves opportunity seekers who want to grow, and providers who want to reach the most qualified candidates worldwide.
              </p>
            </motion.div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
              What We Offer
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat, i) => (
                <motion.div key={cat.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="rounded-lg border border-border bg-card p-6 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-shadow duration-300 text-center"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-primary">
                    <cat.icon size={24} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground">{cat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="hero-gradient py-16 md:py-20">
          <div className="container text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">Ready to Discover Opportunities?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">Join thousands of users who are already finding scholarships, jobs, and more on Somopportunity.</p>
            <a href="/signup" className="btn-gradient inline-flex items-center px-8 py-3 rounded-lg font-semibold text-sm">
              Join Now
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
