
import { useQuery } from "react-query"
import LoadingOverlay from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Budget as BudgetType } from "@/types/types"
import { findAllBudgetsForUser } from "@/api/budget/route"
import { DataTable } from "./budget table/data-table"
import { columns } from "./budget table/data-column"

type Props = {}



export default function Budget({}: Props) {
  const {data, isError, isLoading} = useQuery("findBudgetsForUser", findAllBudgetsForUser, {
    retry: false
  });


  console.log(data);

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

  const budgets: BudgetType[] = data?.data || [];;

  const budget = budgets?.map((e) => {
  
    const amount = e.amount;
    const id = e.id;
    
    return {
      id: id,
      month: e.month,
      year: e.year,
      amount: amount,
    };
  });
  

  console.log(budget);
  
 
  return (

    <div className="container mx-auto py-10">
    <DataTable columns={columns} data={budget} />
  </div>
  )
}