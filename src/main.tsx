import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router";
import NavBar from "./components/PublicComponents/NavBar.tsx";
import FloatingContact from "./components/PublicComponents/FloatingContact.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <div
        dir="rtl"
        className="min-h-screen bg-background text-text font-sans relative"
      >
        <NavBar />
        <App />
        <FloatingContact />
      </div>
    </BrowserRouter>
  </StrictMode>,
);
