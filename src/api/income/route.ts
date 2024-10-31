import { TIncomeSchema } from "@/components/incomePopover";

const API_BASE_URL = "http://localhost:3000";

export const createIncomeRoute = async (data: TIncomeSchema) => {
    const token = sessionStorage.getItem("token");
    const options: TIncomeSchema = {
        amount: data.amount,
        year: data.year,
        month: data.month,
        budgetId: data.budgetId,
        source: data.source
    }

    const res = await fetch(`${API_BASE_URL}/api/income`, {
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


export const findAllIncomeForUser = async () => {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    console.log(userId);
  
    // Check if token and userId exist
    if (!token || !userId) {
      throw new Error("User is not authenticated or userId is missing.");
    }
  
    try {
      const res = await fetch(`${API_BASE_URL}/api/income?userId=${userId}`, {
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