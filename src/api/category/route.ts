import { TCategorySchema } from "@/components/categoryPopover";

const API_BASE_URL = "http://localhost:3000";

export const createCategoryRoute = async (data: TCategorySchema) => {
    const token = sessionStorage.getItem("token");
    const options: TCategorySchema = {
        name: data.name,
        description: data.description
    }

    const res = await fetch(`${API_BASE_URL}/api/category`, {
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