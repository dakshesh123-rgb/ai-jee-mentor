import { ArrowLeft } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: (
      <p>
        We value the privacy of our visitors. This Privacy Policy explains how
        AI JEE Mentor collects, uses, and protects information when you visit
        and use our platform. By using our website, you agree to the terms
        outlined in this policy. We are committed to ensuring that your privacy
        is protected and that we handle your data responsibly.
      </p>
    ),
  },
  {
    id: "information-collection",
    title: "Information Collection",
    content: (
      <>
        <p>
          We collect certain information automatically when you visit our site
          to help us understand how our platform is being used and to improve
          our services.
        </p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-muted-foreground">
          <li>
            <strong className="text-foreground">Usage Data:</strong> We use
            Google Analytics to track site traffic and understand how visitors
            use our site. This includes pages visited, time spent, and general
            geographic location.
          </li>
          <li>
            <strong className="text-foreground">
              Questions &amp; Sessions:
            </strong>{" "}
            Questions you submit to the AI solver are processed to generate
            answers. We do not store your questions on our servers; session data
            is kept locally in your browser.
          </li>
          <li>
            <strong className="text-foreground">Log Data:</strong> Like most
            websites, we automatically receive standard log information from
            your browser, such as your IP address, browser type, and the pages
            you visit.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies-and-ads",
    title: "Cookies and Advertising",
    content: (
      <>
        <p>
          Our website uses cookies — small text files stored in your browser —
          to improve your experience and deliver relevant advertisements.
        </p>
        <div className="mt-4 p-4 border border-border rounded-sm bg-white/[0.03]">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Third-party vendors, including Google, use cookies to serve ads
            based on a user's prior visits to this website or other websites.
            Google's use of advertising cookies enables it and its partners to
            serve ads to our users based on their visit to our site. Users may
            opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              Google's Ad Settings
            </a>
            .
          </p>
        </div>
        <p className="mt-3">
          You can choose to disable cookies through your browser settings.
          However, doing so may limit some features of our site.
        </p>
      </>
    ),
  },
  {
    id: "user-rights",
    title: "Your Rights (GDPR)",
    content: (
      <>
        <p>
          If you are located in the European Union, you have specific rights
          under the General Data Protection Regulation (GDPR) regarding your
          personal data.
        </p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-muted-foreground">
          <li>
            <strong className="text-foreground">Right to Access:</strong> You
            have the right to request a copy of the personal data we hold about
            you.
          </li>
          <li>
            <strong className="text-foreground">Right to Rectification:</strong>{" "}
            You can request correction of any inaccurate or incomplete data.
          </li>
          <li>
            <strong className="text-foreground">Right to Erasure:</strong> You
            can request deletion of your personal data where there is no
            compelling reason for its continued processing.
          </li>
          <li>
            <strong className="text-foreground">Right to Object:</strong> You
            have the right to object to the processing of your personal data for
            direct marketing purposes.
          </li>
          <li>
            <strong className="text-foreground">
              Right to Data Portability:
            </strong>{" "}
            You can request a copy of your data in a structured,
            machine-readable format.
          </li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, please contact us using the details
          below.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    content: (
      <>
        <p>
          If you have any questions, concerns, or requests regarding this
          Privacy Policy or how we handle your data, please do not hesitate to
          reach out.
        </p>
        <p className="mt-3">
          Email:{" "}
          <a
            href="mailto:dasdakshesh123@gmail.com"
            className="text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            dasdakshesh123@gmail.com
          </a>
        </p>
        <p className="mt-3 text-muted-foreground text-sm">
          We aim to respond to all privacy-related enquiries within 30 days.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Back link */}
          <a
            href="/"
            data-ocid="privacy.link"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </a>

          {/* Header */}
          <div className="mb-12">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
              Legal
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-sm">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                data-ocid={`privacy.section.${index + 1}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono text-muted-foreground w-5 text-right">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <h2 className="font-display text-xl font-semibold mb-3 ml-8">
                  {section.title}
                </h2>
                <div className="ml-8 text-muted-foreground text-sm leading-relaxed space-y-2">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Divider */}
          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground">
              This Privacy Policy may be updated from time to time. We encourage
              you to review this page periodically for any changes. Continued
              use of the site after changes are posted constitutes your
              acceptance of the updated policy.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
