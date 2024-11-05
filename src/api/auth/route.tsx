import { TFormLoginSchema } from "@/components/login";
import { TFormSchema } from "@/components/register";

const API_BASE_URL = "https://expense-tracker-backend-5spz.onrender.com";

export const registerRoute = async ({email, password, first_name, last_name}: TFormSchema) => {
    const options = {
        email: email, firstName:first_name, lastName:last_name, password: password
    }

    console.log(options);

    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(options)
    })

    console.log(res);

    const  data = await res.json();
    if (!res.ok) {
        // throw new Error("error");
        console.log(data.message);
        throw new Error(data.message);
    }
    return data.message;
}

export  const loginRoute = async ({email, password}: TFormLoginSchema) => {
    const options = {
        email: email, password: password
    };

    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(options)
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message);
    }

    const token = data.token;
    const refreshToken = data.refreshToken
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("refreshToken", refreshToken);
    return data;
}


export const forgotPassword = async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const response = await res.json();

    if (!res.ok) throw new Error(response.message);
    return {
        message: "Check your mail to reset your password"
    }
}

export const resetPasswordRoute = async (data: any) => {
    const options = {
        token: data.token, newPassword:data.newPassword
    };

    console.log("from: ", data.token)

    const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(options)
    });

    const response = await res.json();

    if (!res.ok)
        throw new Error(response.message);

    return response;
}