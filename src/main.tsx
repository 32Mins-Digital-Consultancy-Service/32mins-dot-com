import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { HomePage } from "./pages/home/page";
import { AboutPage } from "./pages/about/page";
import { UpdatesPage } from "./pages/home/subpages/Updates";
import { SolutionsPage } from "./pages/home/subpages/Solutions";
import { AboutUsPage } from "./pages/home/subpages/AboutUs";
import { ClientsPage } from "./pages/home/subpages/Client";
import { WhyUsPage } from "./pages/home/subpages/WhyUs";
import { ContactUsPage } from "./pages/home/subpages/ContactUs";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route path="updates" element={<UpdatesPage />} />
          <Route path="solutions" element={<SolutionsPage />} />
          <Route path="aboutus" element={<AboutUsPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="whyus" element={<WhyUsPage />} />
          <Route path="contactus" element={<ContactUsPage />} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
