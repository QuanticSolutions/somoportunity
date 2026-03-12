import { useNavigate } from "react-router-dom";

const footerLinks = {
  Opportunities: [
    { label: "Jobs", href: "/opportunities?category=job" },
    { label: "Scholarships", href: "/opportunities?category=scholarship" },
    { label: "Grants", href: "/opportunities?category=grant" },
    { label: "Fellowships", href: "/opportunities?category=fellowship" },
    { label: "Internships", href: "/opportunities?category=internship" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Articles", href: "/articles" },
  ],
  Services: [
    { label: "Hire Talent", href: "/services/hire-talent" },
    { label: "Post Opportunity", href: "/signup" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export default function SiteFooter() {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="/" className="text-xl font-extrabold tracking-tight">
              <span className="text-primary">Som</span>
              <span className="text-gradient">opportunity</span>
            </a>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Connecting Somali youth and communities with global opportunities.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-foreground mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.href)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 border-t border-border pt-8 text-center md:flex-row md:justify-between md:text-left">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Somopportunity. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
