import { Barchart } from "@/components/Barchart";
import DashboardCard from "@/components/dashboardCard";
import ExpenseCard from "@/components/expenseCard";
import { Piechart } from "@/components/pieChart";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getUser } from "@/api/user/route";
import { Budget, Category, Expense, Income, User } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import BudgetPopover from "@/components/budgetPopover";
import IncomePopover from "@/components/incomePopover";
import ExpensePopoverContent from "@/components/expensePopover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingOverlay from "@/components/loading";

// TODO: work on the account, billing page and inner pages
// TODO: FIX THE POP UP THE TABLE IN THE EXPENSE, INCOME AND BUDGET PAGE
// TODO: BACKEND TASK: Work on cascade delete for when a budget is deleted, then the expense relating to it should be deleted :DONE
// TODO: Deploy the Backend and correct the backend URL
// then deploy the frontend

export default function Dashboard() {
  const { id: userId } = useParams();

  const { data, isError, isLoading } = useQuery("getUser", () => getUser(userId as string), {
    retry: false,
  });


  const user: User | undefined = data?.data;

  // Retrieve the user session from local storage
  const getUserSession = () => {
    const userSessionString = localStorage.getItem("userSession");
    if (!userSessionString) return null;

    try {
      return JSON.parse(userSessionString);
    } catch (error) {
      console.error("Failed to parse user session:", error);
      return null;
    }
  };

  // const userSession = getUserSession();
  getUserSession();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (isError || !user) {
    return (
      <div className="flex h-full flex-col gap-3 justify-center items-center">
        <p>Error in loading data</p>
        <Button>
        <Link to={"/get-started"}>Try to login again</Link>
        </Button>
      </div>
    );
  }

  const budgets: Budget[] = user.budgets;
  const expenses: Expense[] = user.expenses;
  const categories: Category[] = user.categories;
  const Income: Income[] = user.incomes;

  sessionStorage.setItem("categories", JSON.stringify(categories));

  

  const currentYear = new Date().getFullYear();
  const filteredBudgets = budgets.filter(budget => new Date(budget.createdAt).getFullYear() === currentYear);
  const filteredExpenses = expenses.filter(expense => new Date(expense.createdAt).getFullYear() === currentYear);
  const filteredIncomes = Income.filter(income => new Date(income.createdAt).getFullYear() === currentYear);

  // Calculate total budget
  const totalBudget = filteredBudgets.reduce((total, budget) => total + (budget.amount || 0), 0);

  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((total, expense) => total + (expense.amount || 0), 0);

  // Calculate total income
  const totalIncome = filteredIncomes.reduce((total, inc) => total + (inc.amount || 0), 0);
  
  
  const monthlyBudgets = filteredBudgets.map((b) => {
    return {
      month: b.month,
      amount: b.amount
    }
  })
  
  const monthlyExpenses = Array.from({ length: 12 }, (_, index) => {
    const month = new Date(0, index).toLocaleString('default', { month: 'long' }); // Get the month name
    const totalAmount = filteredExpenses
      .filter(e => new Date(e.createdAt).getMonth() === index) // Filter expenses by month
      .reduce((acc, expense) => acc + expense.amount, 0); // Sum the amounts for that month
  
    return {
      month,
      amount: totalAmount // Total expense for that month
    };
  }).filter(e => e.amount > 0); // Optional: Filter out months with 0 total expenses

  const monthlyIncome = Array.from({ length: 12 }, (_, index) => {
    const month = new Date(0, index).toLocaleString('default', { month: 'long' }); // Get the month name
    const totalAmount = filteredIncomes
      .filter(e => new Date(e.createdAt).getMonth() === index) // Filter expenses by month
      .reduce((acc, income) => acc + income.amount, 0); // Sum the amounts for that month
  
    return {
      month,
      amount: totalAmount // Total expense for that month
    };
  }).filter(e => e.amount > 0);

  console.log("income", monthlyIncome);
  

  return (
    <section className="p-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="section-title text-left text-xl">Welcome to Expense Buddy</h2>
          <p className="section-description text-left text-sm">Let's manage your expenses for you</p>
        </div>
        <div className="hidden md:inline-flex gap-2">


        <Popover>
        <PopoverTrigger asChild>
        <Button
  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border h-10 px-4 py-2 border-blue-800 bg-blue-900 text-white hover:bg-blue-800"
  type="button"
  aria-haspopup="dialog"
  aria-expanded="false"
  aria-controls="radix-:rpv:"
  data-state="closed"
>
  New Budgets 📝
</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
       <BudgetPopover />
      </PopoverContent>
        </Popover>




        <Popover>
        <PopoverTrigger asChild>
<Button
  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border h-10 px-4 py-2 border-green-600 bg-green-500 text-white hover:bg-green-700"
  type="button"
  aria-haspopup="dialog"
  aria-expanded="false"
  aria-controls="radix-:rpv:"
  data-state="closed"
>
  New Incomes 🤑
</Button>
</PopoverTrigger>
<PopoverContent className="w-96">
       <IncomePopover budgets={filteredBudgets} />
      </PopoverContent>
</Popover>


<Popover>
<PopoverTrigger asChild>
<Button
  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border h-10 px-4 py-2 border-red-600 bg-red-500 text-white hover:bg-red-700"
  type="button"
  aria-haspopup="dialog"
  aria-expanded="false"
  aria-controls="radix-:rpv:"
  data-state="closed"
>
  New Expenses 💸
</Button>
</PopoverTrigger>
<PopoverContent className="w-[500px] absolute top-3 right-10">
       <ExpensePopoverContent budgets={filteredBudgets} categories={categories}  />
      </PopoverContent>
</Popover>

        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 mt-10">
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
          <DashboardCard title="Budget" amount={totalBudget} description="Note: This represents your total accumulated budget for the year." />
          <DashboardCard title="Expenses" amount={totalExpenses} description="Note: This represents your total accumulated expenses for the year." />
          <DashboardCard title="Income" amount={totalIncome} description="Note: This represents your total accumulated income for the year." />
          {expenses.slice(0,2).map((expense) => (
            <Link key={expense.id} to={`expense/${expense.id}`}>
              <ExpenseCard title={expense.description as string} price={expense.amount as number} value={expense.amount as number} maxValue={totalBudget} />
            </Link>
          ))}
          <div>
        {   expenses.length > 0 ?     <Link to="expense" className="flex">
            <Card className="flex-1 border border-dashed border-gray-300 p-4 hover:bg-gray-100 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">View More Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Click here to see all your expenses for the year.
                </p>
              </CardContent>
            </Card>
          </Link> : null}
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row mt-4">
          <div className="flex border justify-center items-center rounded-xl w-full p-4 shadow-md">
         
          {monthlyBudgets.length === 0 && monthlyExpenses.length === 0 ? (
          <p className="text-center flex justify-center items-center text-gray-500">No budget or expense data available for this year.</p>
        ) : (
          <Barchart incomes={monthlyIncome} budgets={monthlyBudgets} expenses={monthlyExpenses} />
        )}

          </div>
          <div className="w-full">
            <Piechart expenses={filteredExpenses} />
          </div>
        </div>
      </div>
    </section>
  );
}
