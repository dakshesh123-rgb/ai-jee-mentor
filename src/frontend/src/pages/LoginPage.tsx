import { useState } from "react";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Brain,
  ArrowLeft,
  LogIn,
  LogOut,
  Shield,
  KeyRound,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Zap,
  Sparkles,
  Lock,
  HardDrive,
  Cpu,
  UserCheck,
  Fingerprint,
} from "lucide-react";

export default function LoginPage() {
  const {
    identity,
    login,
    loginAsStudent,
    studentName,
    clear,
    isLoggingIn,
    loginError,
  } = useInternetIdentity();

  const [inputName, setInputName] = useState("");
  const [copied, setCopied] = useState(false);

  const isAuthenticated = identity && !identity.getPrincipal().isAnonymous();
  const principalStr = identity ? identity.getPrincipal().toString() : "";

  const handleCopyPrincipal = () => {
    if (principalStr) {
      navigator.clipboard.writeText(principalStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStudentSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsStudent(inputName);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 flex-1 flex flex-col justify-center items-center">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          {/* Back button */}
          <div className="flex items-center justify-between">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </a>

            <div className="status-pill flex">
              <span className="status-dot" />
              Status: {isAuthenticated ? "Authenticated (50 Queries/Day)" : "Guest Mode (10 Queries)"}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Primary Login Card */}
            <div className="lg:col-span-6 bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-2xl tracking-tight text-foreground">
                    Student Login
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    IIT-JEE AI Mentor Access Portal
                  </p>
                </div>
              </div>

              {loginError && (
                <div className="mb-6 p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Notice</p>
                    <p className="text-xs mt-0.5 opacity-90">{loginError.message}</p>
                  </div>
                </div>
              )}

              {isAuthenticated ? (
                /* Authenticated State */
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        {studentName ? `Welcome, ${studentName}!` : "Successfully Authenticated!"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Your session is active. You have full access to 50 daily AI queries, problem history, and streak sync.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      Your Unique Cryptographic Principal ID
                    </label>
                    <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg p-2.5 font-mono text-xs text-foreground break-all select-all">
                      <span className="truncate flex-1">{principalStr}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyPrincipal}
                        className="h-7 px-2 hover:bg-white/10 text-xs shrink-0"
                        title="Copy Principal ID"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                      <p className="text-xs text-muted-foreground">Daily Allowance</p>
                      <p className="text-base font-bold text-foreground mt-0.5">
                        50 Queries / Day
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                      <p className="text-xs text-muted-foreground">Account Status</p>
                      <p className="text-base font-bold text-emerald-400 mt-0.5">
                        Active &amp; Ready
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a href="/#solver" className="flex-1">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                        Launch AI Solver
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      onClick={clear}
                      className="border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                /* Unauthenticated State */
                <div className="space-y-6">
                  {/* Instant Student Login Form */}
                  <form onSubmit={handleStudentSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-foreground">
                        Your Name or Aspirant Handle (Optional)
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. Dakshesh / JEE 2027 Aspirant"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        className="h-10 bg-background/50 border-border"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow flex items-center justify-center gap-2 text-sm"
                    >
                      <UserCheck className="w-4 h-4" />
                      Instant Student Sign In (1-Click)
                    </Button>
                  </form>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="flex-shrink mx-3 text-muted-foreground text-xs uppercase tracking-wider">
                      Or Sign in via Passkey
                    </span>
                    <div className="flex-grow border-t border-border"></div>
                  </div>

                  {/* Internet Identity Passkey Button */}
                  <div>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => login()}
                      disabled={isLoggingIn}
                      className="w-full h-11 border-border/80 hover:bg-muted font-medium flex items-center justify-center gap-2 text-xs"
                    >
                      <Fingerprint className="w-4 h-4 text-primary" />
                      {isLoggingIn ? "Opening Internet Identity..." : "Sign in with Internet Identity"}
                    </Button>
                    <p className="text-[11px] text-center text-muted-foreground mt-2">
                      Biometric / TouchID / FaceID passkeys on Internet Computer
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/40">
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span><strong>50 Free High-Speed Queries</strong> daily (upgraded from 10 trial uses)</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Persistent problem history across browser sessions</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <Shield className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Zero plaintext passwords or personal phone tracking</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Storage Architecture & Security Details */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-card/70 border border-border/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-foreground font-display font-semibold text-lg mb-1">
                  <Database className="w-5 h-5 text-primary" />
                  <h2>Where is your login info stored?</h2>
                </div>
                <p className="text-xs text-muted-foreground mb-6">
                  Complete architectural transparency on how authentication credentials and session data are stored.
                </p>

                <div className="space-y-4 text-xs">
                  {/* Item 1 */}
                  <div className="p-3.5 rounded-xl border border-border/70 bg-muted/30 space-y-1.5">
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <HardDrive className="w-4 h-4 text-sky-400" />
                      <span>1. Browser Storage (IndexedDB &amp; LocalStorage)</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed pl-6">
                      Your cryptographic student session keypair is generated and stored locally in your browser's private <strong className="text-foreground">IndexedDB</strong> (<code className="bg-muted px-1 py-0.5 rounded font-mono">auth-client-db</code>) and <strong className="text-foreground">LocalStorage</strong> (<code className="bg-muted px-1 py-0.5 rounded font-mono">jee_student_key</code>). Clicking Sign Out immediately purges these keys from your device.
                    </p>
                  </div>

                  {/* Item 2 */}
                  <div className="p-3.5 rounded-xl border border-border/70 bg-muted/30 space-y-1.5">
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <KeyRound className="w-4 h-4 text-amber-400" />
                      <span>2. Local Usage Tracker (Rate Limits &amp; History)</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed pl-6">
                      Your 50-query daily tracker (<code className="bg-muted px-1 py-0.5 rounded font-mono">jee_logged_in_searches_&#123;principal&#125;</code>) and solved question history (<code className="bg-muted px-1 py-0.5 rounded font-mono">jee_solver_history</code>) reside safely on your device in <strong className="text-foreground">LocalStorage</strong>.
                    </p>
                  </div>

                  {/* Item 3 */}
                  <div className="p-3.5 rounded-xl border border-border/70 bg-muted/30 space-y-1.5">
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      <span>3. Zero Plaintext Passwords / Cryptographic Identity</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed pl-6">
                      No password, email, or phone number is ever transmitted or stored on any centralized server. Sessions are signed cryptographically using Ed25519/WebAuthn public-key authentication.
                    </p>
                  </div>

                  {/* Item 4 */}
                  <div className="p-3.5 rounded-xl border border-border/70 bg-muted/30 space-y-1.5">
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Lock className="w-4 h-4 text-violet-400" />
                      <span>4. Cloudflare Edge API (AI Engine)</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed pl-6">
                      The AI solver edge worker (<code className="bg-muted px-1 py-0.5 rounded font-mono">functions/api/solve.js</code>) only applies an in-memory IP rate limiter to protect Gemini model quotas. It does not store user logins or sensitive credentials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
