import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Menu, 
  Users, 
  ShoppingCart, 
  Package, 
  Calendar,
  CreditCard,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  UtensilsCrossed,
  Tags,
  Plus,
  Truck
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  hasSubmenu?: boolean;
  submenuItems?: { id: string; label: string }[];
  isExpanded?: boolean;
}

export const Sidebar = () => {
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      isActive: true
    },
    {
      id: "menu",
      label: "Menu",
      icon: <Menu className="w-4 h-4" />,
      hasSubmenu: true,
      isExpanded: true,
      submenuItems: [
        { id: "menus", label: "Menus" },
        { id: "menu-items", label: "Menu Items" },
        { id: "item-categories", label: "Item Categories" },
        { id: "modifier-groups", label: "Modifier Groups" },
        { id: "item-modifiers", label: "Item Modifiers" }
      ]
    },
    {
      id: "tables",
      label: "Tables",
      icon: <UtensilsCrossed className="w-4 h-4" />
    },
    {
      id: "waiter-requests",
      label: "Waiter Requests",
      icon: <Users className="w-4 h-4" />
    },
    {
      id: "reservations",
      label: "Reservations",
      icon: <Calendar className="w-4 h-4" />
    },
    {
      id: "pos",
      label: "POS",
      icon: <ShoppingCart className="w-4 h-4" />
    },
    {
      id: "orders",
      label: "Orders",
      icon: <Package className="w-4 h-4" />,
      hasSubmenu: true
    },
    {
      id: "customers",
      label: "Customers",
      icon: <Users className="w-4 h-4" />
    },
    {
      id: "staff",
      label: "Staff",
      icon: <Users className="w-4 h-4" />
    },
    {
      id: "delivery-executive",
      label: "Delivery Executive",
      icon: <Truck className="w-4 h-4" />
    },
    {
      id: "payments",
      label: "Payments",
      icon: <CreditCard className="w-4 h-4" />,
      hasSubmenu: true
    },
    {
      id: "report",
      label: "Report",
      icon: <BarChart3 className="w-4 h-4" />,
      hasSubmenu: true
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: <Package className="w-4 h-4" />,
      hasSubmenu: true
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-4 h-4" />
    }
  ]);

  const toggleSubmenu = (itemId: string) => {
    setSidebarItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, isExpanded: !item.isExpanded }
          : item
      )
    );
  };

  const setActiveItem = (itemId: string) => {
    setSidebarItems(items =>
      items.map(item => ({
        ...item,
        isActive: item.id === itemId
      }))
    );
  };

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="text-sidebar-foreground text-2xl font-bold">ell</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => {
                if (item.hasSubmenu) {
                  toggleSubmenu(item.id);
                } else {
                  setActiveItem(item.id);
                }
              }}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors",
                item.isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.hasSubmenu && (
                item.isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )
              )}
            </button>

            {/* Submenu */}
            {item.hasSubmenu && item.isExpanded && item.submenuItems && (
              <div className="ml-6 mt-1 space-y-1">
                {item.submenuItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => setActiveItem(subItem.id)}
                    className="w-full text-left px-3 py-2 text-sm text-sidebar-foreground hover:text-sidebar-accent-foreground rounded-lg transition-colors"
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};