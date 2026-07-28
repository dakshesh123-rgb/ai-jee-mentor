import { Brain, Heart } from "lucide-react";
import { SiDiscord, SiGithub, SiX } from "react-icons/si";

const platformLinks = [
  { label: "Features", href: "#features" },
  { label: "Solver", href: "#solver" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Practice", href: "#practice" },
];

const subjectLinks = [
  { label: "Physics", href: "#subjects" },
  { label: "Chemistry", href: "#subjects" },
  { label: "Mathematics", href: "#subjects" },
];

const socialLinks = [
  { label: "GitHub", href: "#", Icon: SiGithub },
  { label: "Discord", href: "#", Icon: SiDiscord },
  { label: "Twitter", href: "#", Icon: SiX },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const handleScroll = (href: string) => (e: React.MouseEvent) => {
    if (href.startsWith("#") && href !== "#") {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-border">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-sm bg-white/8 border border-white/10 flex items-center justify-center">
                <Brain className="w-4 h-4 text-foreground" />
              </div>
              <span className="font-display font-bold text-base text-foreground tracking-tight">
                AI JEE Mentor
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Empowering India's next generation of engineers with intelligent,
              personalised AI-powered preparation.
            </p>
          </div>

          {/* Platform */}
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
              Platform
            </p>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={handleScroll(link.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
              Subjects
            </p>
            <ul className="space-y-2.5">
              {subjectLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={handleScroll(link.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
              Social
            </p>
            <ul className="space-y-2.5">
              {socialLinks.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-xs text-muted-foreground font-mono">
              © {year} AI JEE Mentor. All rights reserved.
            </p>
            <a
              href="/privacy-policy"
              data-ocid="footer.privacy_policy.link"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-red-500 inline fill-current animate-pulse" /> for JEE Aspirants
          </p>
        </div>
      </div>
    </footer>
  );
}
