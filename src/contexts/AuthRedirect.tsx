import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";

export function AuthRedirect() {
  const router = useRouter();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (session && (router.pathname === "/signin" || router.pathname === "/signup")) {
        router.replace("/");
      } else if (!session && router.pathname !== "/signin" && router.pathname !== "/signup") {
        router.replace("/signin");
      }
    }
  }, [session, isLoading, router]);

   if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return null;
}