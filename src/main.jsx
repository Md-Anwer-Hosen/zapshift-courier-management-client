import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Router.jsx";

import AOS from "aos";
import "aos/dist/aos.css";
import AuthProvider from "./contexts/AuthProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function AppWrapper() {
  useEffect(() => {
    // ✅ refresh/back scroll restore বন্ধ
    window.history.scrollRestoration = "manual";
    // ✅ first load / refresh এ top
    window.scrollTo(0, 0);

    // ✅ AOS init
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
);
