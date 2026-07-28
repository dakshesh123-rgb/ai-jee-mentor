import { RouterProvider, createRouter } from "@tanstack/react-router";
import { createRootRoute, createRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import SolverSection from "./components/SolverSection";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const MarqueeStrip = lazy(() => import("./components/MarqueeStrip"));
const FeaturesSection = lazy(() => import("./components/FeaturesSection"));
const SubjectsSection = lazy(() => import("./components/SubjectsSection"));
const DashboardSection = lazy(() => import("./components/DashboardSection"));
const PracticeSection = lazy(() => import("./components/PracticeSection"));
const FutureSection = lazy(() => import("./components/FutureSection"));
const Footer = lazy(() => import("./components/Footer"));

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <Suspense fallback={<div className="py-8" />}>
          <MarqueeStrip />
          <FeaturesSection />
          <SubjectsSection />
          <DashboardSection />
          <SolverSection />
          <PracticeSection />
          <FutureSection />
        </Suspense>
      </main>
      <Suspense fallback={<div className="py-4" />}>
        <Footer />
      </Suspense>
    </div>
  );
}

const rootRoute = createRootRoute();

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy-policy",
  component: PrivacyPolicy,
});

const routeTree = rootRoute.addChildren([homeRoute, privacyRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
