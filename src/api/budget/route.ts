import { TBudgetSchema } from "@/components/budgetPopover";

//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const API_BASE_URL="https://expense-tracker-backend-5spz.onrender.com"
export const createBudgetRoute = async (data: TBudgetSchema) => {
    const token = sessionStorage.getItem("token");
    const options = {
        amount: data.amount,
        year: data.year,
        month: data.month
    }

    const res = await fetch(`${API_BASE_URL}/api/budget`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(options)
    });

    const response = await res.json();

    if (!res.ok) {
        console.log(response.message);
        throw new Error(response.message);
    }

    return response;
}

export const findAllBudgetsForUser = async () => {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");
  
    // Check if token and userId exist
    if (!token || !userId) {
      throw new Error("User is not authenticated or userId is missing.");
    }
  
    try {
      const res = await fetch(`${API_BASE_URL}/api/budget?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Check if response is ok (status code 200-299)
      if (!res.ok) {
        const errorDetails = await res.json();
        throw new Error(
          `Error in fetching data: ${res.status} ${res.statusText} - ${errorDetails.message || "Unknown error"}`
        );
      }
  
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Fetch failed:", error);
      throw new Error("Failed to fetch expenses. Please try again.");
    }
};


export const fetchExpense = async(expenseId: string) => {
    const token = sessionStorage.getItem("token");
    // Fetch the expense details from your API
    const response = await fetch(`http://localhost:3000/api/expense/${expenseId}`,{
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
    });
    const expenseData = await response.json();
  
    if (!response.ok) {
      throw new Error(expenseData.message);
    }
  
    return expenseData.data;
  }
    