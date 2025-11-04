
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardCredential } from "@/components/CardCredential";

import { useAuth } from "@/hooks/useAuth";
import { User, Users, LogOut } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";

export default function Home() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"single" | "all">("single")
    const { users, loading, error } = useUsers();
  const { session, isLoading, signOut } = useAuth();


  useEffect(() => {
    if (!isLoading) {
      if (session && router.pathname === "/signin") {

        router.replace("/");
      } else if (!session && router.pathname !== "/signin") {
        router.replace("/signin");
      }
    }
  }, [session, isLoading, router]);

  if (isLoading) return <p>Carregando...</p>;

  return (
    <main className="animated-background min-h-screen relative">
      <div className="absolute inset-0 pointer-events-none" />
      <div className="flex w-full justify-end p-4 items-center gap-4   transform duration-150 will-change-transform  ">
        <LogOut className="text-black cursor-pointer sm:hover:scale-110 " onClick={() => signOut()}/>
      </div>
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
            <span className="text-balance bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
              Credenciais de Usuário
            </span>
          </h1>
          <p className="text-lg text-gray-900">
            Alterne entre visualizar sua credencial ou de todos os usuários do sistema
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="mb-12 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={() => setViewMode("single")}
            variant={viewMode === "single" ? "default" : "outline"}
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white border-0"
          >
            <User className="h-4 w-4" />
            Minha Credencial
          </Button>
          <Button
            onClick={() => setViewMode("all")}
            variant={viewMode === "all" ? "default" : "outline"}
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white border-0"
          >
            <Users className="h-4 w-4" />
            Todos os Usuários
          </Button>
        </div>

        {/* Content */}
        <div className="flex justify-center">
          {viewMode === "single" ? (
            <div className="w-full flex flex-col justify-center items-center">
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-900">Visualizando sua credencial</p>
              </div>
              <CardCredential name={session?.user.name} email={session?.user.email} telephones={session?.user.telephones} />
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-8 text-center">
                <p className="text-sm text-gray-900">Exibindo {users?.length ?? 0} usuários do sistema</p>
              </div>
              <div className="grid justify-center gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {users?.map((user) => (
                  <CardCredential
                    key={user.id}
                    name={user.name}
                    email={user.email}
                    telephones={user.telephones}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}