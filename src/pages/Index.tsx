import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChefHat, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Clock,
  Star,
  DollarSign,
  Calendar,
  LogOut,
  Crown
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AIChatbot } from "@/components/ai/AIChatbot";
import { Link } from "react-router-dom";

export default function Index() {
  const { profile, signOut, isSystemSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Index useEffect - checking redirect:', { loading, isSystemSuperAdmin, profile });
    // Only redirect if we're not loading and the user is confirmed to be system super admin
    if (!loading && isSystemSuperAdmin) {
      console.log('Redirecting system super admin to /system-admin');
      navigate('/system-admin');
    }
  }, [isSystemSuperAdmin, loading, navigate, profile]);

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="w-96 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSystemSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="w-96 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">System Administrator</CardTitle>
            <CardDescription>Redirecting to system administration panel...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const quickStats = [
    {
      title: "Today's Orders",
      value: "127",
      change: "+12%",
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Revenue",
      value: "$3,247",
      change: "+8%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Tables",
      value: "18/24",
      change: "75%",
      icon: Users,
      color: "text-orange-600"
    },
    {
      title: "Kitchen Orders",
      value: "9",
      change: "Avg 12min",
      icon: Clock,
      color: "text-purple-600"
    }
  ];

  const quickActions = [
    { title: "View Dashboard", description: "Comprehensive analytics", link: "/dashboard", icon: TrendingUp },
    { title: "Manage Menu", description: "Update items & prices", link: "/menu-items", icon: ChefHat },
    { title: "Process Orders", description: "Handle incoming orders", link: "/orders", icon: ShoppingCart },
    { title: "Staff Management", description: "Manage team & schedules", link: "/staff", icon: Users },
    { title: "Table Reservations", description: "Manage bookings", link: "/reservations", icon: Calendar },
    { title: "POS System", description: "Process payments", link: "/pos", icon: DollarSign }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-6 gap-4">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Welcome back, {profile?.full_name || 'User'}!</h1>
                <p className="text-sm text-muted-foreground">
                  <Badge variant="secondary" className="mr-2 capitalize">
                    {profile?.role?.replace('_', ' ')}
                  </Badge>
                  Here's what's happening at your restaurant today
                </p>
              </div>
              <Button onClick={signOut} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </header>

          <div className="flex-1 p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {quickStats.map((stat, index) => (
                <Card key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">{stat.change}</span> from yesterday
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Access frequently used features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {quickActions.map((action, index) => (
                    <Link key={index} to={action.link}>
                      <Card className="hover:shadow-md transition-all duration-200 hover-scale cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <action.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{action.title}</CardTitle>
                              <CardDescription className="text-sm">
                                {action.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your restaurant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New order #1847 received</p>
                      <p className="text-xs text-muted-foreground">Table 12 • 2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Reservation confirmed</p>
                      <p className="text-xs text-muted-foreground">Party of 4 • 7:30 PM today</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Low inventory alert</p>
                      <p className="text-xs text-muted-foreground">Salmon - 3 portions remaining</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      <AIChatbot section="general" context={`User role: ${profile?.role}, Restaurant overview page`} />
    </SidebarProvider>
  );
}