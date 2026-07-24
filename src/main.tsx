import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/home/page";
import { SolutionsPage } from "./pages/home/subpages/Solutions";
import { AboutUsPage } from "./pages/home/subpages/AboutUs";
import { ClientsPage } from "./pages/home/subpages/Client";
import { WhyUsPage } from "./pages/home/subpages/WhyUs";
import { ContactUsPage } from "./components/ContactUs";
import OurProjectsPage from "./pages/home/subpages/OurProject";
import SmoothScroll from "./components/SmoothScroll";

// Secondary routes are code-split so the home bundle stays lean.
const AboutPage = lazy(() =>
  import("./pages/about/page").then((m) => ({ default: m.AboutPage })),
);

const routeFallback = (
  <div className="min-h-[var(--viewport-height)] w-full bg-[#000016]" />
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SmoothScroll>
      <BrowserRouter>
        <Suspense fallback={routeFallback}>
          <Routes>
            <Route path="/" element={<HomePage />}>
              <Route path="solutions" element={<SolutionsPage />} />
              <Route path="aboutus" element={<AboutUsPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="whyus" element={<WhyUsPage />} />
              <Route path="ourprojects" element={<OurProjectsPage />} />
              <Route path="contactus" element={<ContactUsPage />} />
            </Route>
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </SmoothScroll>
  </StrictMode>,
);
