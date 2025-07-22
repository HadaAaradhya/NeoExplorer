
// --- UI Providers & Utilities ---
import { Toaster } from "@/components/ui/toaster"; // Custom toast notifications
import { Toaster as Sonner } from "@/components/ui/sonner"; // Sonner notification system
import { TooltipProvider } from "@/components/ui/tooltip"; // Tooltip context for the whole app
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // React Query for async state
import { BrowserRouter, Routes, Route } from "react-router-dom"; // SPA routing

// --- Page Components ---
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";

// --- Auth Context Provider ---
import { AuthProvider } from "./hooks/useAuth";

// Create a single QueryClient instance for React Query
const queryClient = new QueryClient();

/**
 * App root component
 * Wraps the app in all global providers (auth, query, tooltips, notifications, router)
 *
 * Provider hierarchy:
 * - AuthProvider: Handles authentication state/context
 *   - QueryClientProvider: Handles async server state (React Query)
 *     - TooltipProvider: Enables tooltips throughout the app
 *       - Toaster/Sonner: Toast notification systems
 *         - BrowserRouter: SPA routing
 *           - Routes: All app routes
 */
const App = () => (
  <AuthProvider>
    {/* React Query for server state management */}
    <QueryClientProvider client={queryClient}>
      {/* Tooltip context for all tooltips */}
      <TooltipProvider>
        {/* Toast notifications (custom and Sonner) */}
        <Toaster />
        <Sonner />
        {/* Main app router */}
        <BrowserRouter>
          <Routes>
            {/* Home page */}
            <Route path="/" element={<Index />} />
            {/* Dashboard page (protected) */}
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Catch-all for 404s */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
