import { api, setAuthToken } from "@/api/api";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useActionState } from "react";
import { z, ZodError } from "zod"


export default function SignUp() {
    const router = useRouter();
    const [state, formAction, isLoading] = useActionState(signUp, null)

    const signUpSchema = z.object({
        name: z.string().min(2, { message: "Nome deve ser maior que 2 caracteres" }),
        email: z.email({ message: "E-mail inválido" }),
        telephone: z.string().regex(/^\d{9}$/, 'Número deve conter exatamente 9 dígitos'),
        area_code: z.string().min(1, { message: "DDD obrigatório" }),
        password: z.string().min(6, { message: "Senha deve ser maior que 6 caracteres" }),
    });

    async function signUp(_: any, formData: FormData) {
        try {
            const data = signUpSchema.parse({
                name: formData.get("name"),
                email: formData.get("email"),
                telephone: formData.get("telephone"),
                area_code: formData.get("area_code"),
                password: formData.get("password")
            })
            const mutation = `
                mutation Register($input: CreateUserInputClass!) {
                register(input: $input) {
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
                input: {
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
            const token = response.data.data.register;
            alert("Cadastro realizado com sucesso!");
            setAuthToken(token);
            router.push("/signin");
        } catch (error) {
            if (error instanceof ZodError) {
                return { message: error.issues[0].message };
            }

            if (error instanceof AxiosError) {
                return { message: error.response?.data.errors[0].message };
            }

            return { message: "Erro desconhecido" };
        }
    }
    return (
        <div className="w-full h-full flex bg-white py-2 sm:h-screen sm:py-0 px-4 md:px-24 lg:px-0">
            <div className="flex-1 flex items-center justify-center  px-2 lg:px-14">
                <div className="w-full mt-8">
                    <Image
                        src={"/logo.svg"}
                        alt="Logo RUK"
                        width={150}
                        height={50}
                        className="mb-10"
                    />
                    <h1 className="pt-5 text-black font-bold text-2xl pb-6">Everything your business needs, automated in one place.</h1>
                    <form action={formAction} className="w-full flex flex-col gap-4">
                        <Input required legend="Nome" name="name" type="text" placeholder="Nome" />

                        <Input required legend="E-mail" name="email" type="email" placeholder="seu@email.com" />

                        <div className="flex gap-2">
                            <Input required legend="DDD" name="area_code" type="tel" placeholder="11" className="flex flex-1" />

                            <Input required legend="Telefone" name="telephone" type="tel" placeholder="999999999"className="flex flex-1"/>
                        </div>


                        <Input required legend="Senha" name="password" type="password" placeholder="123456" />

                        <p className="text-red-600 ml-2 font-semibold text-sm h-5">
                            {state?.message}
                        </p>
                        <Button type="submit" isLoading={isLoading} title="Register" />
                        <a href="/signin" className="text-sm font-semibold text-black mt-10 mb-4 text-center hover:text-black/60 transition ease-linear">Ja possuo conta</a>
                    </form>
                </div>
            </div>

            <div className="relative hidden lg:block lg:w-3/5 ">
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