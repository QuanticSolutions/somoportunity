import { useNavigate } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const opportunities = [
  { label: "Scholarships", href: "/opportunities?category=scholarship" },
  { label: "Internships", href: "/opportunities?category=internship" },
  { label: "Fellowships", href: "/opportunities?category=fellowship" },
  { label: "Grants", href: "/opportunities?category=grant" },
  { label: "Jobs", href: "/opportunities?category=job" },
];

const company = [
  { label: "About Us", href: "/about" },
  { label: "Our Team", href: "/about#team" },
  { label: "Careers", href: "/opportunities?category=job" },
  { label: "Press", href: "/about#press" },
  { label: "Blog", href: "/articles" },
];

const support = [
  { label: "Help Center", href: "/contact" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const socials = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const contacts = [
  { icon: Mail, label: "Email", value: "contact@somopportunity.com", href: "mailto:contact@somopportunity.com" },
  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567", href: "tel:+15551234567" },
  { icon: MapPin, label: "Address", value: "San Francisco, CA 94102", href: "#" },
];

function FooterLinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const navigate = useNavigate();
  return (
    <div>
      <h4 className="text-base font-bold text-white mb-5">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <button
              onClick={() => navigate(link.href)}
              className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-blue-950">
      {/* Main columns */}
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-extrabold text-sm">S</span>
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white uppercase">
                Somopportunity
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Your trusted platform for discovering scholarships, internships, and career opportunities worldwide. Join 2M+ members advancing their careers.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-white hover:-translate-y-0.5"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterLinkColumn title="Opportunities" links={opportunities} />
          <FooterLinkColumn title="Company" links={company} />
          <FooterLinkColumn title="Support" links={support} />
        </div>
      </div>

      {/* Divider */}
      <div className="container">
        <div className="border-t border-slate-800" />
      </div>

      {/* Contact row */}
      <div className="container py-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="flex items-center gap-3 group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary transition-colors group-hover:bg-primary/30">
                <c.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{c.label}</p>
                <p className="text-sm text-slate-300 group-hover:text-white transition-colors">{c.value}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="container">
        <div className="border-t border-slate-800" />
      </div>

      {/* Copyright */}
      <div className="container py-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} SomOpportunity. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((t) => (
              <button
                key={t}
                onClick={() => navigate("#")}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
