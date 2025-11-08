import { api, setAuthToken } from "@/api/api";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { z, ZodError } from "zod"


export default function SignUp() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [telephone, setTelephone] = useState("");
    const [area_code, setArea] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const signUpSchema = z.object({
        name: z.string().min(2, { message: "Nome deve ser maior que 2 caracteres" }),
        email: z.email({ message: "E-mail inválido" }),
        telephone: z.string().regex(/^\d{9}$/, 'Número deve conter exatamente 9 dígitos'),
        area_code: z.string().min(1, { message: "DDD obrigatório" }),
        password: z.string().min(6, { message: "Senha deve ser maior que 6 caracteres" }),
    });



    async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");
        try {
            const data = signUpSchema.parse({
                name: name,
                email: email,
                telephone: telephone,
                area_code: area_code,
                password: password,
            })
            const mutation = `
                mutation Register($data: CreateUserInputClass!) {
                register(data: $data) {
                    id
                    name
                    email
                    telephones {
                    number
                    area_code
                    }
                  }
                }
            `;

            const variables = {
                data: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    telephones: [
                        {
                            number: data.telephone,
                            area_code: data.area_code
                        }
                    ],
                },
            };

            const response = await api.post("/graphql", { query: mutation, variables });

            if (response.data?.errors?.length) {
                throw new Error(response.data.errors[0].message);
            }

            const token = response.data?.data?.register;

            if (!token) throw new Error("Erro ao registrar usuário");

            alert("Cadastro realizado com sucesso!");
            setAuthToken(token);
            router.push("/signin");
        } catch (error) {
            console.log(error);
            if (error instanceof ZodError) {
                setMessage(error.issues[0].message);
            } else if (error instanceof AxiosError) {
                setMessage(error.response?.data?.errors[0]?.message);
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
            <div className="w-full h-full lg:flex-1 flex items-center m-auto justify-center lg:px-14">
                <div className="w-full">
                    <Image
                        src={"/logo.svg"}
                        alt="Logo RUK"
                        width={150}
                        height={50}
                        className="mb-10"
                    />
                    <h1 className="lg:pt-5 lg:pb-6 text-2xl text-black font-bold">Everything your company needs, automated in a single place</h1>
                    <form onSubmit={handleSignUp} className="w-full flex flex-col gap-4">
                        <Input required legend="Nome" name="name" value={name} type="text" placeholder="Nome" onChange={(e) => setName(e.target.value)} />

                        <Input required legend="E-mail" name="email" value={email} type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} />

                        <div className="flex gap-2">
                            <Input required legend="DDD" name="area_code" value={area_code} type="tel" placeholder="DDD" className="flex flex-1" onChange={(e) => setArea(e.target.value)} />

                            <Input required legend="Telefone" name="telephone" value={telephone} type="tel" placeholder="Telefone" className="flex flex-1" onChange={(e) => setTelephone(e.target.value)} />
                        </div>


                        <Input required legend="Senha" name="password" value={password} type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />

                        <p className="text-red-600 ml-2 font-semibold text-sm h-5">
                            {message}
                        </p>
                        <Button type="submit" isLoading={isLoading} title="Register" />
                        <a href="/signin" className="text-sm font-semibold text-black mt-10 mb-4 text-center hover:text-black/60 transition ease-linear">Ja possuo conta</a>
                    </form>
                </div>
            </div>
            <div className="relative lg:h-screen hidden lg:block lg:flex-1">
                <Image
                    src={"/bg.jpg"}
                    alt="Background Image"
                    fill
                    className="object-cover"
                />
            </div>
        </div>
    )
}