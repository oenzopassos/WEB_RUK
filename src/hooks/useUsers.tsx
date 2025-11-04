import { useEffect, useState } from "react";
import { api } from "@/api/api"; // seu axios configurado


export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.post("", {
          query: `
            query {
              users {
                id
                name
                email
                telephones {
                  number
                  area_code
                }
              }
            }
          `,
        });

        const data = response.data?.data?.users || [];
        

        setUsers(data);
      } catch (err: any) {
        console.error("Erro ao buscar usuários:", err);
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
}
