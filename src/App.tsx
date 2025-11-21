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
import { ThemeProvider } from "@/components/theme-provider";

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
import PaymentSuccess from "./pages/PaymentSuccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <Routes>

              {/* Public */}
              <Route path="/auth" element={<Auth />} />

              {/* System Admin */}
              <Route
                path="/system-admin"
                element={
                  <ProtectedRoute requiredPermissions={["system_admin"]}>
                    <SystemAdmin />
                  </ProtectedRoute>
                }
              />

              {/* Home */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />

              {/* Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredPermissions={["view_reports"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* MENU MANAGEMENT */}
              <Route
                path="/menus"
                element={
                  <ProtectedRoute requiredPermissions={["view_menus"]}>
                    <Menus />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/menu-items"
                element={
                  <ProtectedRoute requiredPermissions={["view_menu_items"]}>
                    <MenuItems />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/item-categories"
                element={
                  <ProtectedRoute requiredPermissions={["view_menu_items"]}>
                    <ItemCategories />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/modifier-groups"
                element={
                  <ProtectedRoute requiredPermissions={["view_menu_items"]}>
                    <ModifierGroups />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/item-modifiers"
                element={
                  <ProtectedRoute requiredPermissions={["view_menu_items"]}>
                    <ItemModifiers />
                  </ProtectedRoute>
                }
              />

              {/* OPERATIONS */}
              <Route
                path="/tables"
                element={
                  <ProtectedRoute requiredPermissions={["view_tables"]}>
                    <Tables />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/waiter-requests"
                element={
                  <ProtectedRoute requiredPermissions={["view_orders"]}>
                    <WaiterRequests />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reservations"
                element={
                  <ProtectedRoute requiredPermissions={["view_reservations"]}>
                    <Reservations />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pos"
                element={
                  <ProtectedRoute requiredPermissions={["view_pos"]}>
                    <POS />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/payment-success"
                element={
                  <ProtectedRoute requiredPermissions={["view_pos"]}>
                    <PaymentSuccess />
                  </ProtectedRoute>
                }
              />

              {/* MANAGEMENT */}
              <Route
                path="/orders"
                element={
                  <ProtectedRoute requiredPermissions={["view_orders"]}>
                    <Orders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/customers"
                element={
                  <ProtectedRoute requiredPermissions={["view_customers"]}>
                    <Customers />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/staff"
                element={
                  <ProtectedRoute requiredPermissions={["view_staff"]}>
                    <Staff />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/delivery-executive"
                element={
                  <ProtectedRoute requiredPermissions={["view_staff"]}>
                    <DeliveryExecutive />
                  </ProtectedRoute>
                }
              />

              {/* SYSTEM */}
              <Route
                path="/payments"
                element={
                  <ProtectedRoute requiredPermissions={["view_payments"]}>
                    <Payments />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/inventory"
                element={
                  <ProtectedRoute requiredPermissions={["view_inventory"]}>
                    <Inventory />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/report"
                element={
                  <ProtectedRoute requiredPermissions={["view_reports"]}>
                    <Report />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute requiredPermissions={["view_settings"]}>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />

            </Routes>
          </BrowserRouter>

        </ThemeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
