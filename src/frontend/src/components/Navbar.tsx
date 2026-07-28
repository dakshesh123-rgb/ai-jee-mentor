import { Button } from "@/components/ui/button";
import { Brain, Menu, X, LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Subjects", href: "#subjects" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Solver", href: "#solver" },
  { label: "Practice", href: "#practice" },
  { label: "Future", href: "#future" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { identity, login, clear } = useInternetIdentity();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const isAuthenticated = identity && !identity.getPrincipal().isAnonymous();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "nav-blur" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2 flex-shrink-0"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="w-8 h-8 rounded-sm bg-white/8 border border-white/10 flex items-center justify-center">
            <Brain className="w-4 h-4 text-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight">
            AI JEE Mentor
          </span>
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, i) => (
            <button
              type="button"
              key={link.href}
              data-ocid={`nav.link.${i + 1}`}
              onClick={() => handleNavClick(link.href)}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-white/5"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right side: status pill + login button + mobile toggle */}
        <div className="flex items-center gap-3">
          <div className="status-pill hidden sm:flex">
            <span className="status-dot" />
            AI · Online
          </div>

          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono max-w-[120px] truncate border border-border/60 bg-muted/40 px-2 py-1 rounded">
                {identity.getPrincipal().toString()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                className="h-8 border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-xs flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={login}
              className="hidden sm:flex h-8 bg-primary hover:bg-primary/90 text-xs text-primary-foreground font-medium items-center gap-1 shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              Login
            </Button>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden nav-blur border-t border-border/50 px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link, i) => (
            <button
              type="button"
              key={link.href}
              data-ocid={`nav.link.${i + 1}`}
              onClick={() => handleNavClick(link.href)}
              className="text-left px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-white/5"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 px-3 flex flex-col gap-3">
            <div className="status-pill inline-flex self-start">
              <span className="status-dot" />
              AI · Online
            </div>

            {isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-border/30">
                <span className="text-xs text-muted-foreground font-mono truncate bg-muted/40 px-2 py-1 rounded">
                  Principal: {identity.getPrincipal().toString()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clear();
                    setMobileOpen(false);
                  }}
                  className="w-full h-9 justify-center text-xs flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="pt-2 border-t border-border/30">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    login();
                    setMobileOpen(false);
                  }}
                  className="w-full h-9 justify-center text-xs bg-primary text-primary-foreground flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
