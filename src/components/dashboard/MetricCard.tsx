import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const MetricCard = ({ title, value, subtitle, trend, className }: MetricCardProps) => {
  return (
    <div className={cn("bg-card rounded-lg p-6 border border-border", className)}>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-metric-green" : "text-metric-red"
              )}
            >
              {trend.isPositive ? "+" : ""}{trend.value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};