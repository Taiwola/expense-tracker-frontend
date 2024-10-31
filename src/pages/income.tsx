
import { useQuery } from "react-query"
import LoadingOverlay from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Income as IncomeType } from "@/types/types"
import { DataTable } from "./income table/data-table"
import { columns } from "./income table/data-column"
import { findAllIncomeForUser } from "@/api/income/route"

type Props = {}



export default function Income({}: Props) {
  const {data, isError, isLoading} = useQuery("findIncomeForUser", findAllIncomeForUser, {
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

  const incomes: IncomeType[] = data?.data || [];;

  const income = incomes?.map((e) => {
  
    const amount = e.amount;
    const id = e.id;
    const source = e.source;
    
    
    return {
      id: id,
      month: e.month,
      year: e.year,
      amount: amount,
      source: source
    };
  });
  

  console.log(income);
  
 
  return (

    <div className="container mx-auto py-10">
    <DataTable columns={columns} data={income} />

  </div>
  )
}