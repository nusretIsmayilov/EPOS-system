import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/layout/Header";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { OrdersList } from "@/components/dashboard/OrdersList";
import { TopDishes } from "@/components/dashboard/TopDishes";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12h5v12z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
                </button>
                
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            <div className="space-y-6">
              {/* Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Earnings"
                  value="£2.03K"
                />
                <MetricCard
                  title="Today's Customers"
                  value="8"
                  subtitle="0% Since Yesterday"
                />
                <MetricCard
                  title="Today's Orders"
                  value="4"
                  subtitle="0% Since Yesterday"
                />
                <MetricCard
                  title="Average Daily Earnings"
                  value="£1.54K"
                  trend={{
                    value: "43% Since Previous Month",
                    isPositive: true
                  }}
                />
              </div>

              {/* Charts and Lists Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SalesChart />
                <OrdersList />
              </div>

              {/* Top Dishes */}
              <TopDishes />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}