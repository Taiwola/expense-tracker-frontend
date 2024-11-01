import { useQuery } from "react-query";
import { columns } from "./expense table/data-column";
import { DataTable } from "./expense table/data-table";
import { findAllExpensesForUser } from "@/api/expense/route";
import LoadingOverlay from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { Budget, Category, Expense as ExpenseType, User } from "@/types/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ExpensePopoverContent from "@/components/expensePopover";
import { getUser } from "@/api/user/route";

type Props = {};

export default function Expense({}: Props) {
  const { data, isError, isLoading } = useQuery("findAllExpensesForUser", findAllExpensesForUser, {
    retry: false
  });

  const { id: userId } = useParams();

  const { data: users } = useQuery("getUser", () => getUser(userId as string), {
    retry: false,
  });

  const user: User | undefined = users?.data;
  const budgets: Budget[] = user?.budgets || []; // This ensures budgets is always an array

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col gap-3 justify-center items-center">
        <p>Error in loading data</p>
        <Button>
          <Link to={"/get-started"}>Try to login again</Link>
        </Button>
      </div>
    );
  }

  const expenses: ExpenseType[] = data?.data || [];

  const expense = expenses.map((e) => {
    const createdAt = new Date(e.createdAt);
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const weekdays = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    const month = months[createdAt.getMonth()];
    const year = createdAt.getFullYear();
    const day = weekdays[createdAt.getDay()];
    const amount = e.amount;
    const description = e.description;
    const id = e.id;
    const category = e.category?.name || "Unknown Category"; // Handle undefined category

    const formattedDate = `${month} ${createdAt.getDate()}, ${year}, ${createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    return {
      id,
      day,
      month,
      year,
      amount,
      description,
      category,
      date: formattedDate,
      budget: e.budget
    };
  });

  const currentYear = new Date().getFullYear();
  const filteredBudgets = budgets.filter(budget => new Date(budget.createdAt).getFullYear() === currentYear);

  let categories: string | null = sessionStorage.getItem("categories");
  let cate: Category[] = [];

  if (categories) {
    try {
      const parsedCategories = JSON.parse(categories);
      cate = Array.isArray(parsedCategories) ? parsedCategories : [];
    } catch (error) {
      console.error("Failed to parse categories:", error);
      cate = [];
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col">
        <div className="flex justify-end">
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
            <PopoverContent className="w-[300px] absolute box-border top-3 right-10">
              <ExpensePopoverContent budgets={filteredBudgets} categories={cate} />
            </PopoverContent>
          </Popover>
        </div>
        <DataTable columns={columns} data={expense} />
      </div>
    </div>
  );
}
