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