import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ModuleProvider } from "./contexts/ModuleContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import * as React from 'react';
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import PDFResults from "./pages/PDFResults";
import NotFound from "./pages/NotFound";
import UrlResults from "./pages/UrlResults";
import Auth from "./pages/Auth";
import UserLanding from "./pages/UserLanding";
import LoadingPage from "./pages/LoadingPage";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Wrap the entire app with QueryClientProvider
const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipPrimitive.Provider>
        <AuthProvider>
          <ModuleProvider>
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserLanding />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/upload"
                  element={
                    <ProtectedRoute>
                      <Upload />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/loading"
                  element={
                    <ProtectedRoute>
                      <LoadingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/results"
                  element={
                    <ProtectedRoute>
                      <PDFResults />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/url-results"
                  element={
                    <ProtectedRoute>
                      <UrlResults />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ModuleProvider>
        </AuthProvider>
      </TooltipPrimitive.Provider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
