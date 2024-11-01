import { Tschema } from "@/pages/account";

const API_BASE_URL = "http://localhost:3000";
export const getUser = async (userId:string) => {
    const token = sessionStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/api/user/${userId}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });

    const data = await res.json();

    if (!res.ok) {
        return data.message
    }

    return data;
}


export const updateUser = async (data: Tschema): Promise<any> => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");

    if (!userId || !token) {
        throw new Error("User ID or token is missing from session storage.");
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        });

        const response = await res.json();

        if (!res.ok) {
            const message = response.message || "Failed to update user.";
            throw new Error(message);
        }

        return response;
    } catch (error) {
        // Handle network errors or other unexpected errors
        throw new Error(`An error occurred: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
