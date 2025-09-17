import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { Download, Calendar, TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag } from "lucide-react";

export default function Report() {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$12,450",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign
    },
    {
      title: "Total Orders",
      value: "542",
      change: "+12.5%",
      trend: "up",
      icon: ShoppingBag
    },
    {
      title: "Customer Count",
      value: "1,248",
      change: "-2.1%",
      trend: "down",
      icon: Users
    },
    {
      title: "Average Order",
      value: "$23.97",
      change: "+5.8%",
      trend: "up",
      icon: TrendingUp
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <PageHeader>
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold">Reports</h1>
                <p className="text-muted-foreground">Analytics and performance insights</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </PageHeader>

          <div className="flex-1 p-6 space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric) => (
                <Card key={metric.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                    <metric.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className={`text-xs flex items-center ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {metric.change} from last month
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <SalesChart />
              </CardContent>
            </Card>

            {/* Additional Reports */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Butter Chicken", sales: 89, revenue: "$1,602" },
                      { name: "Dal Makhani", sales: 76, revenue: "$1,140" },
                      { name: "Tandoori Salmon", sales: 45, revenue: "$1,125" },
                      { name: "Biryani", sales: 52, revenue: "$884" }
                    ].map((item, index) => (
                      <div key={item.name} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.sales} orders</p>
                        </div>
                        <p className="font-semibold">{item.revenue}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Peak Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { time: "7:00 PM - 8:00 PM", orders: 45 },
                      { time: "12:00 PM - 1:00 PM", orders: 38 },
                      { time: "8:00 PM - 9:00 PM", orders: 32 },
                      { time: "6:00 PM - 7:00 PM", orders: 28 }
                    ].map((hour) => (
                      <div key={hour.time} className="flex justify-between items-center">
                        <p className="font-medium">{hour.time}</p>
                        <p className="text-sm">{hour.orders} orders</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}