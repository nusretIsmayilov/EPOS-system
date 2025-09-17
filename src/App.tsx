import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import SystemAdmin from "./pages/SystemAdmin";
import NotFound from "./pages/NotFound";

// Menu Management
import Menus from "./pages/Menus";
import MenuItems from "./pages/MenuItems";
import ItemCategories from "./pages/ItemCategories";
import ModifierGroups from "./pages/ModifierGroups";
import ItemModifiers from "./pages/ItemModifiers";

// Operations
import Tables from "./pages/Tables";
import WaiterRequests from "./pages/WaiterRequests";
import Reservations from "./pages/Reservations";
import POS from "./pages/POS";

// Management
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Staff from "./pages/Staff";
import DeliveryExecutive from "./pages/DeliveryExecutive";

// System
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";
import Inventory from "./pages/Inventory";
import Report from "./pages/Report";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/system-admin" element={
              <ProtectedRoute>
                <SystemAdmin />
              </ProtectedRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute requireStaff>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Menu Management */}
            <Route path="/menus" element={
              <ProtectedRoute requireStaff>
                <Menus />
              </ProtectedRoute>
            } />
            <Route path="/menu-items" element={
              <ProtectedRoute requireStaff>
                <MenuItems />
              </ProtectedRoute>
            } />
            <Route path="/item-categories" element={
              <ProtectedRoute requireAdmin>
                <ItemCategories />
              </ProtectedRoute>
            } />
            <Route path="/modifier-groups" element={
              <ProtectedRoute requireAdmin>
                <ModifierGroups />
              </ProtectedRoute>
            } />
            <Route path="/item-modifiers" element={
              <ProtectedRoute requireAdmin>
                <ItemModifiers />
              </ProtectedRoute>
            } />
            
            {/* Operations */}
            <Route path="/tables" element={
              <ProtectedRoute requireStaff>
                <Tables />
              </ProtectedRoute>
            } />
            <Route path="/waiter-requests" element={
              <ProtectedRoute requireStaff>
                <WaiterRequests />
              </ProtectedRoute>
            } />
            <Route path="/reservations" element={
              <ProtectedRoute requireStaff>
                <Reservations />
              </ProtectedRoute>
            } />
            <Route path="/pos" element={
              <ProtectedRoute requireStaff>
                <POS />
              </ProtectedRoute>
            } />
            
            {/* Management */}
            <Route path="/orders" element={
              <ProtectedRoute requireStaff>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/customers" element={
              <ProtectedRoute requireStaff>
                <Customers />
              </ProtectedRoute>
            } />
            <Route path="/staff" element={
              <ProtectedRoute requireAdmin>
                <Staff />
              </ProtectedRoute>
            } />
            <Route path="/delivery-executive" element={
              <ProtectedRoute requireAdmin>
                <DeliveryExecutive />
              </ProtectedRoute>
            } />
            
            {/* System */}
            <Route path="/payments" element={
              <ProtectedRoute requireStaff>
                <Payments />
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute requireStaff>
                <Inventory />
              </ProtectedRoute>
            } />
            <Route path="/report" element={
              <ProtectedRoute requireAdmin>
                <Report />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute requireAdmin>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
