import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, DollarSign, Package } from "lucide-react";
import { AIChatbot } from "@/components/ai/AIChatbot";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_available: boolean;
  category_id: string | null;
  menu_categories?: {
    name: string;
  } | null;
}

export default function MenuItems() {
  const { isAdmin } = useAuth();
  
  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          menu_categories (
            name
          )
        `)
        .order('name');
      
      if (error) throw error;
      return data as MenuItem[];
    }
  });

  const handleAddItem = () => {
    // TODO: Implement add item functionality
    console.log('Add item clicked');
  };

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality
    console.log('Edit item:', id);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete item:', id);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <PageHeader>
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold">Menu Items</h1>
                <p className="text-muted-foreground">Manage your restaurant's menu items</p>
              </div>
            </div>
            {isAdmin && (
              <Button onClick={handleAddItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            )}
          </PageHeader>

          <div className="flex-1 p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))
              ) : menuItems?.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No menu items yet</h3>
                  <p className="text-muted-foreground mb-4">Start by adding your first menu item</p>
                  {isAdmin && (
                    <Button onClick={handleAddItem}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Item
                    </Button>
                  )}
                </div>
              ) : (
                menuItems?.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-medium line-clamp-1">
                          {item.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {item.menu_categories && (
                            <Badge variant="outline" className="text-xs">
                              {item.menu_categories.name}
                            </Badge>
                          )}
                          <Badge 
                            variant={item.is_available ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {item.is_available ? "Available" : "Out of Stock"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-lg font-semibold text-green-600">
                            {item.price.toFixed(2)}
                          </span>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEdit(item.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
      
      <AIChatbot 
        section="menu" 
        context="Menu items management page - viewing all menu items with prices and availability status" 
      />
    </SidebarProvider>
  );
}