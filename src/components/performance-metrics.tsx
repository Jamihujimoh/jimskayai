import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, CheckCircle, Repeat, TrendingUp, GanttChartSquare } from 'lucide-react';

const metrics = [
  {
    title: 'Accuracy',
    value: '81.3%',
    icon: Target,
    color: 'text-blue-400',
  },
  {
    title: 'Precision',
    value: '84.2%',
    icon: CheckCircle,
    color: 'text-green-400',
  },
  {
    title: 'Recall',
    value: '79.8%',
    icon: Repeat,
    color: 'text-yellow-400',
  },
  {
    title: 'ROI',
    value: '+15.7%',
    icon: TrendingUp,
    color: 'text-red-400',
  },
];

export function PerformanceMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <GanttChartSquare className="text-primary"/>
            Historical Performance
        </CardTitle>
        <CardDescription>Model performance based on historical data.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div key={metric.title} className="p-4 flex flex-col items-center justify-center text-center bg-secondary rounded-lg">
             <metric.icon className={`h-8 w-8 mb-2 ${metric.color}`} />
            <p className="text-2xl font-bold">{metric.value}</p>
            <p className="text-sm font-semibold text-muted-foreground">{metric.title}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}