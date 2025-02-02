import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./styles.css";
import FileInspectionPage from "./pages/FileInspectionPage";
import FaqPage from "./pages/FaqPage";
import FormatsListPage from "./pages/FormatsListPage";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<FileInspectionPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/formats" element={<FormatsListPage />} />
    </Routes>
  </BrowserRouter>,
);
