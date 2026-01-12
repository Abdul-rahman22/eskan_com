import { Toaster as RadixToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ===== Public Pages ===== */
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

/* ===== Dashboard Pages ===== */
import Dashboard from "./pages/dashboard/Dashboard";
import AddProperty from "./pages/dashboard/AddProperty";
import MyProperties from "./pages/dashboard/MyProperties";
import Favorites from "./pages/dashboard/Favorites";
import Settings from "./pages/dashboard/Settings";

/* ===== Protection ===== */
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />

          {/* Admin */}
          <Route path="/admin" element={<Admin />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="/dashboard/add-property"
            element={<ProtectedRoute element={<AddProperty />} />}
          />
          <Route
            path="/dashboard/my-properties"
            element={<ProtectedRoute element={<MyProperties />} />}
          />
          <Route
            path="/dashboard/favorites"
            element={<ProtectedRoute element={<Favorites />} />}
          />
          <Route
            path="/dashboard/settings"
            element={<ProtectedRoute element={<Settings />} />}
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <RadixToaster />
        <SonnerToaster />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
