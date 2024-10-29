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