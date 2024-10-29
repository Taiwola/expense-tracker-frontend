import { Label, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Expense } from "@/types/types";

type Props = {
  expenses: Expense[];
};

export function Piechart({ expenses }: Props) {
  const currentMonth = new Date().getMonth();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonthName = monthNames[currentMonth];

  // Filter expenses for current month
  const currentMonthExpenses = expenses.filter(
    (e) => new Date(e.createdAt).getMonth() === currentMonth
  );

  // Calculate total expenses for percentage calculation
  const totalAmount = currentMonthExpenses.reduce((acc, expense) => acc + expense.amount, 0);

  // Transform data for pie chart
  const chartData = currentMonthExpenses.map((expense, index) => ({
    name: expense.description,
    value: expense.amount,
    percentage: ((expense.amount / totalAmount) * 100).toFixed(1),
    // Generate different colors for each segment
    fill: `hsl(${(index * 360) / currentMonthExpenses.length}, 70%, 50%)`,
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle>Expense Distribution</CardTitle>
        <CardDescription>{currentMonthName} {new Date().getFullYear()}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{data.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ₦{data.value.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {data.percentage}% of total
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                strokeWidth={2}
                stroke="white"
                animationDuration={500} // Animation duration
              >
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {currentMonthExpenses.length}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          // @ts-ignore
                          y={viewBox.cy + 20}
                          className="fill-muted-foreground text-xs"
                        >
                          Items
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-4">
        {totalAmount > 0 && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Summary:</span>
            {chartData.slice(0,3).map(({ name, value, percentage }) => (
              <div key={name} className="flex justify-between">
                <span className="mr-2">{name}: </span>
                <span> ₦{value.toLocaleString()} ({percentage}%)</span>
              </div>
            ))}
          </div>
        )}
        {totalAmount > 0 && (
          <div className="mt-2 text-sm text-muted-foreground">
            <span className="font-medium">Insights:</span>
            <p>
              {chartData.length === 0
                ? "No expenses recorded."
                : `Your top expense this month is ${chartData[0].name}, accounting for ${chartData[0].percentage}% of your total expenses.`}
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
