import { createContext, useEffect, useState } from "react"
import { api } from "../api/api";



type AuthContext = {
    isLoading: boolean;
    session: null | LoginResponse;
    save: (data: LoginResponse) => void;
    signOut: () => void;
}

const LOCAL_STORAGE_KEY = "@ruk"

export const AuthContext = createContext({} as AuthContext);


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<null | LoginResponse>(null);
    const [isLoading, setIsLoading] = useState(true);

    function save(data: LoginResponse) {

        localStorage.setItem(`${LOCAL_STORAGE_KEY}:user`, JSON.stringify(data.user));
        localStorage.setItem(`${LOCAL_STORAGE_KEY}:token`, data.token);

        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`

        setSession(data);
    }

    function loadUser() {
         const user = localStorage.getItem(`${LOCAL_STORAGE_KEY}:user`);
        const token = localStorage.getItem(`${LOCAL_STORAGE_KEY}:token`);

        if(token && user) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`
            setSession({
                token,
                user: JSON.parse(user)
            })
        }
        setIsLoading(false);
    }

     function signOut() {
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}:user`);
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}:token`);
        setSession(null);
        
        window.location.assign("/");
    }

    useEffect(() => {
        loadUser();
    }, [])
    return (
        < AuthContext.Provider value={{ session, signOut, save, isLoading }} >
            {children}
        </AuthContext.Provider>
    )
}