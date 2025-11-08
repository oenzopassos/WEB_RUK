import axios from "axios";


export const api = axios.create({
    baseURL: "https://api-ruk.onrender.com/graphql",
    headers: {
        "Content-Type": "application/json",
    },
})

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};