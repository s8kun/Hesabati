import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router";
import NavBar from "./components/PublicComponents/NavBar.tsx";
import FloatingContact from "./components/PublicComponents/FloatingContact.tsx";
import { CookiesProvider } from "react-cookie";
import { Toaster } from "react-hot-toast";
import RefreshToken from "./components/RefreshToken.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CookiesProvider>
      <BrowserRouter>
        <div
          dir="rtl"
          className="min-h-screen bg-background text-text font-sans relative"
        >
          <RefreshToken>
            <NavBar />
            <App />
          </RefreshToken>
          <FloatingContact />
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={10}
            containerStyle={{ direction: "ltr" }}
            toastOptions={{
              duration: 3200,
              className: "hot-toast-card",
              style: {
                direction: "rtl",
                maxWidth: "380px",
              },
            }}
          />
        </div>
      </BrowserRouter>
    </CookiesProvider>
  </StrictMode>,
);
