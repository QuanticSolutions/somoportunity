import { useNavigate } from "react-router-dom";

const footerColumns = {
  Platform: [
    { label: "Home", href: "/" },
    { label: "Jobs", href: "/opportunities?category=job" },
    { label: "Opportunities", href: "/opportunities" },
    { label: "Articles", href: "/articles" },
  ],
  Services: [
    { label: "Hire Talent", href: "/services/hire-talent" },
    { label: "Technical Writing", href: "/services/technical-writing" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Articles", href: "/articles" },
    { label: "Submit Content", href: "/signup" },
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
          {Object.entries(footerColumns).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-foreground mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label + link.href}>
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
          <div className="flex items-center gap-6">
            <button onClick={() => navigate("#")} className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => navigate("#")} className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
