import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./styles.css";
import FileInspectionPage from "./pages/FileInspectionPage";
import HowPage from "./pages/HowPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FileInspectionPage />} />
        <Route path="/how" element={<HowPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
