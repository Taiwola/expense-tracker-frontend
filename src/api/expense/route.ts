import { TExpenseSchema } from "@/components/expensePopover";


const API_BASE_URL = "http://localhost:3000";

export const createExpenseRoute = async (data: TExpenseSchema) => {
    const token = sessionStorage.getItem("token");
    const options: TExpenseSchema = {
        amount: data.amount,
        description: data.description,
        budgetId: data.budgetId,
        categoryId: data.categoryId
    }

    const res = await fetch(`${API_BASE_URL}/api/expense`, {
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

export const findAllExpensesForUser = async () => {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    console.log(userId);
  
    // Check if token and userId exist
    if (!token || !userId) {
      throw new Error("User is not authenticated or userId is missing.");
    }
  
    try {
      const res = await fetch(`${API_BASE_URL}/api/expense?userId=${userId}`, {
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
  