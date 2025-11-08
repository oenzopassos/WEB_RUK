import { api, setAuthToken } from "@/api/api";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";
import { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { z, ZodError } from "zod"


export default function SignIn() {
    const router = useRouter();
    const auth = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");


    const signInSchema = z.object({
        email: z.email({ message: "E-mail inválido" }),
        password: z.string().min(6, { message: "Senha deve ser maior que 6 caracteres" }),
    });

    function iconName() {

    }

    async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");
        try {
            const data = signInSchema.parse({
                email: email,
                password: password,
            })
            const mutation = `
                 mutation Login($data: LoginInputClass!) {
                    login(data: $data) {
                    token
                    user {
                        id
                        name
                        email
                        telephones {
                        number
                        area_code
                        }
                    }
                    }
                }
                `;

            const variables = {
                data: data,
            };

            const response = await api.post("/graphql", { query: mutation, variables });

            if (response.data?.errors?.length) {
                const gqlError = response.data.errors[0];
                throw new Error(gqlError.message || "Erro no servidor");
            }

            auth.save(response.data.data.login);
            router.push("/");
        } catch (error) {
            if (error instanceof ZodError) {
                setMessage(error.issues[0].message);
            } else if (error instanceof AxiosError) {
                setMessage(error.response?.data?.errors?.[0]?.message);
            } else if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("Erro desconhecido");
            }
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="w-full min-h-screen lg:h-screen flex flex-col flex-1 items-center bg-white py-2 sm:py-0 px-4 md:px-24 lg:flex-row lg:px-0">
            <div className="relative lg:h-screen hidden lg:block lg:flex-1">
                <Image
                    src={"/bg.jpg"}
                    alt="Background Image"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="w-full h-full lg:flex-1 flex items-center m-auto justify-center lg:px-14">
                <div className="w-full">
                    <Image
                        src={"/logo.svg"}
                        alt="Logo RUK"
                        width={150}
                        height={50}
                        className="mb-10"
                    />
                    <h1 className="lg:pt-5 lg:pb-6 text-2xl text-black font-bold">Nice to see you again</h1>
                    <form onSubmit={handleSignIn} className="w-full flex flex-col gap-4">
                        <Input required legend="E-mail" name="email" type="email" onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" />

                        <Input required legend="Senha" name="password" type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />

                        <p className="text-red-600 ml-2 font-semibold text-sm h-5">
                            {message}
                        </p>
                        <Button type="submit" isLoading={isLoading} title="Sign in" />
                        <a href="/signup" className="text-sm font-semibold text-black mt-10 mb-4 text-center hover:text-black/60 transition ease-linear">Criar conta</a>
                    </form>
                </div>
            </div>

        </div>
    );
}