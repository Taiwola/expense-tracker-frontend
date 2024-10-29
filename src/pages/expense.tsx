
import { useQuery } from "react-query"
import { columns } from "./expense table/data-column"
import { DataTable } from "./expense table/data-table"
import { findAllExpensesForUser } from "@/api/expense/route"
import LoadingOverlay from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Expense as ExpenseType } from "@/types/types"

type Props = {}



export default function Expense({}: Props) {
  const {data, isError, isLoading} = useQuery("findAllExpensesForUser", findAllExpensesForUser, {
    retry: false
  });

  if (isLoading) {
    <LoadingOverlay />
  }

  if (isError) {
    <div className="flex h-full flex-col gap-3 justify-center items-center">
        <p>Error in loading data</p>
        <Button>
            <Link to={"/get-started"}>Try to login again</Link>
        </Button>
      </div>
  }

  const expenses: ExpenseType[] = data?.data || [];;

  const expense = expenses?.map((e) => {
    const createdAt = new Date(e.createdAt); // Convert to Date object
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const weekdays = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
  
    const month = months[createdAt.getMonth()];
    const year = createdAt.getFullYear();
    const day = weekdays[createdAt.getDay()]; // Get the day of the week (e.g., "Tuesday")
    const amount = e.amount;
    const description = e.description;
    const id = e.id;
    
    // Format the date and time (e.g., "October 22, 2024, 10:30 AM")
    const formattedDate = `${month} ${createdAt.getDate()}, ${year}, ${createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  
    return {
      id: id,
      day: day, // Day of the week (e.g., "Tuesday")
      month: month,
      year: year,
      amount: amount,
      description: description,
      date: formattedDate // Include the formatted date with time
    };
  });
  
  
 
  return (

    <div className="container mx-auto py-10">
    <DataTable columns={columns} data={expense} />
  </div>
  )
}