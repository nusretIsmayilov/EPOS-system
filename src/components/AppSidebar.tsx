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
  UtensilsCrossed,
  Truck,
  ChevronDown
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { usePermissions } from "@/hooks/usePermissions";
import { useEffect, useState } from "react";

interface NavItem {
  title: string;
  url: string;
  icon: any;
  permissions?: string[];
}

const mainItems: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, permissions: ['view_reports', 'view_analytics'] },
];

const menuItems: NavItem[] = [
  { title: "Menus", url: "/menus", icon: Menu, permissions: ["view_menus"] },
  { title: "Menu Items", url: "/menu-items", icon: Menu, permissions: ["view_menu_items"] },

  // Bunları sadece ADMIN görebilsin
  { title: "Item Categories", url: "/item-categories", icon: Menu, permissions: ["manage_menu_items"] },
  { title: "Modifier Groups", url: "/modifier-groups", icon: Menu, permissions: ["manage_menu_items"] },
  { title: "Item Modifiers", url: "/item-modifiers", icon: Menu, permissions: ["manage_menu_items"] },
];

const operationsItems: NavItem[] = [
  { title: "Tables", url: "/tables", icon: UtensilsCrossed, permissions: ["view_tables"] },
  { title: "Waiter Requests", url: "/waiter-requests", icon: Users, permissions: ["view_waiter_requests"] },

  { title: "Reservations", url: "/reservations", icon: Calendar, permissions: ["view_reservations"] },
  { title: "POS", url: "/pos", icon: ShoppingCart, permissions: ["view_pos"] },
];

const managementItems: NavItem[] = [
  { title: "Orders", url: "/orders", icon: Package, permissions: ["view_orders"] },
  { title: "Customers", url: "/customers", icon: Users, permissions: ["view_customers"] },
  { title: "Staff", url: "/staff", icon: Users, permissions: ["view_staff"] },
  { title: "Delivery Executive", url: "/delivery-executive", icon: Truck, permissions: ["view_staff"] },
];

const systemItems: NavItem[] = [
  { title: "Payments", url: "/payments", icon: CreditCard, permissions: ["manage_payments"] },
  { title: "Report", url: "/report", icon: BarChart3, permissions: ["view_reports"] },
  { title: "Inventory", url: "/inventory", icon: Package, permissions: ["view_inventory"] },
  { title: "Settings", url: "/settings", icon: Settings, permissions: ["view_settings"] },
];


export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const { hasAnyPermission, loading } = usePermissions();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    main: true,
    menu: true,
    operations: true,
    management: true,
    system: true,
  });

  const isCollapsed = state === "collapsed";

  
  // --- NEW FIX ---
  // Açılması gereken section varsa (aktif path o section’da ise), sadece MOUNT anında aç
  useEffect(() => {
    const sectionMap: Record<string, NavItem[]> = {
      main: mainItems,
      menu: menuItems,
      operations: operationsItems,
      management: managementItems,
      system: systemItems,
    };

    Object.entries(sectionMap).forEach(([key, items]) => {
      if (items.some(item => item.url === currentPath)) {
        setOpenSections(prev => ({ ...prev, [key]: true }));
      }
    });
  }, []); // <-- sadece ilk render’da çalışır

  const filterItemsByPermission = (items: NavItem[]) => {
  // Permissions yüklenene kadar, permission isteyen hiçbir item gösterme
  if (loading || !usePermissions) {
    return items.filter(item =>
      !item.permissions || item.permissions.length === 0
    );
  }

  return items.filter(item => {
    if (!item.permissions || item.permissions.length === 0) return true;
    return hasAnyPermission(item.permissions);
  });
};

  const SidebarSection = ({ title, items, sectionKey }: any) => {
    const filteredItems = filterItemsByPermission(items);
    if (filteredItems.length === 0) return null;

    const isOpen = openSections[sectionKey];

    return (
      <Collapsible open={isOpen} onOpenChange={() =>
        setOpenSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }))
      }>
        <SidebarGroup>
          {title && (
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="group/label text-gray-600 text-xs font-medium hover:text-gray-800 cursor-pointer flex items-center justify-between py-2">
                {!isCollapsed && title}
                {!isCollapsed && (
                  <ChevronDown className="w-3 h-3 transition-transform group-data-[state=open]/label:rotate-180" />
                )}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
          )}
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredItems.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentPath === item.url}
                      className="data-[active=true]:bg-black data-[active=true]:text-white hover:bg-gray-100"
                    >
                      <NavLink to={item.url} end>
                        <item.icon className="w-4 h-4" />
                        {!isCollapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    );
  };

  return (
    <Sidebar collapsible="offcanvas">
      <div className="p-6 border-b border-sidebar-border">
        <div className="text-sidebar-foreground text-2xl font-bold">ell</div>
      </div>

      <SidebarContent className="p-4 space-y-2">
        <SidebarSection items={mainItems} sectionKey="main" />
        <SidebarSection title="Menu" items={menuItems} sectionKey="menu" />
        <SidebarSection title="Operations" items={operationsItems} sectionKey="operations" />
        <SidebarSection title="Management" items={managementItems} sectionKey="management" />
        <SidebarSection title="System" items={systemItems} sectionKey="system" />
      </SidebarContent>
    </Sidebar>
  );
}
