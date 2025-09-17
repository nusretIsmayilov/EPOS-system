import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const data = [
  { name: '20 Apr', value: 500 },
  { name: '', value: 1000 },
  { name: '', value: 800 },
  { name: '', value: 1200 },
  { name: '', value: 900 },
  { name: '', value: 1600 },
  { name: '21 Apr', value: 1800 },
];

export const SalesChart = () => {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Sales Overview</h3>
        <div className="text-sm text-muted-foreground">April</div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `£${value}`}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--chart-line))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--chart-point))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--chart-line))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
        <div className="text-sm">
          <span className="text-muted-foreground">Since Previous Month</span>
          <span className="ml-2 text-metric-green font-medium">+40%</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Sales This Month</span>
          <span className="ml-2 text-metric-blue font-medium">£5601.39</span>
        </div>
      </div>
    </div>
  );
};