import Income from "@/pages/income";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, YAxis, Tooltip } from "recharts";

interface BarchartProps {
  budgets: { month: string; amount: number }[];
  expenses: { month: string; amount: number }[];
  incomes: { month: string; amount: number }[];
}

export function Barchart({ budgets, expenses, incomes }: BarchartProps) {
  // Create a set of all unique months from both budgets, expenses, and incomes
  const allMonths = Array.from(new Set([
    ...budgets.map(b => b.month),
    ...expenses.map(e => e.month),
    ...incomes.map(i => i.month)
  ]));

  // Merge the budgets, expenses, and incomes data to include all months
  const chartData = allMonths.map(month => {
    const budget = budgets.find(b => b.month === month) || { amount: 0 };
    const expense = expenses.find(e => e.month === month) || { amount: 0 };
    const income = incomes.find(i => i.month === month) || { amount: 0 };
    return {
      month, // Use the common month key
      budget: budget.amount,
      expense: expense.amount,
      income: income.amount
    };
  });

  return (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            className="stroke-muted" 
          />
          <XAxis 
            dataKey="month" 
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
            className="text-sm text-muted-foreground"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            className="text-sm text-muted-foreground"
            tickFormatter={(value) => `₦${value.toLocaleString()}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              const data = payload[0]?.payload;
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Budget
                      </span>
                      <span className="font-bold text-muted-foreground">
                        ₦{data?.budget?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Expense
                      </span>
                      <span className="font-bold text-muted-foreground">
                        ₦{data?.expense?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Income
                      </span>
                      <span className="font-bold text-muted-foreground">
                        ₦{data?.income?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }}
          />
          <Bar
            dataKey="budget"
            fill="#2563eb"
            radius={[4, 4, 0, 0]}
            className="fill-primary"
          />
          <Bar
            dataKey="expense"
            fill="#60a5fa"
            radius={[4, 4, 0, 0]}
            className="fill-primary/60"
          />
          <Bar
            dataKey="income"
            fill="#34d399"
            radius={[4, 4, 0, 0]}
            className="fill-green-400"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
