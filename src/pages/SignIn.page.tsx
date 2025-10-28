import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@components/ui/Form";
import { Input } from "@components/ui/Input";
import { Label } from "@components/ui/Label";

import { useSignInMutation } from "@/api/mutations/auth.mutation";
import { useAuthStore } from "@/store/auth.store";
import Logo from "../assets/carvalogo.svg";
import { SignInSchema, SigninBodyKeys } from "./SignIn.defs";
import { type SignInBody } from "./SignIn.defs";

export const SignIn = () => {
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      cpf: "",
      password: "",
    },
  });

  const { mutateAsync: doLogin } = useSignInMutation();
  const { setUser } = useAuthStore();
  const navigate = useNavigate({ from: "/" });

  const onSubmitSignIn = async (values: SignInBody): Promise<void> => {
    // Simulação para demonstração - aceita qualquer credencial
    try {
      // Simula loading da API por 1 segundo
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Cria um usuário mock com base no CPF digitado
      const mockUser = {
        cpf: values.cpf || "000.000.000-00",
        name: "Usuário Demo",
        // Adicione outros campos necessários aqui
      };

      setUser(mockUser);
      toast.success("Login realizado com sucesso!");

      // Redireciona para o dashboard
      await navigate({
        to: "/dashboard/eventos",
        search: { page: "1", q: "" },
      });
    } catch (error: unknown) {
      // Em caso de erro inesperado
      toast.error("Erro inesperado");
    }
  };

  return (
    <div className="w-[400px] mx-4 md:mx-0 py-[45px] px-8 rounded-lg bg-white flex flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitSignIn)}
          className="space-y-5"
        >
          <div className="flex items-center justify-center mb-8 max-w-[70%] mx-auto">
            <img src={Logo} alt="Carvalheira, Criando Memórias" />
          </div>
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="cpf" label="CPF" />
                <FormControl>
                  <Input
                    id="cpf"
                    placeholder="Insira qualquer CPF para demo"
                    {...field}
                    size="md"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="password" label="Senha" />
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Qualquer senha para demo"
                    {...field}
                    size="md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Entrar
          </Button>
        </form>
      </Form>
    </div>
  );
};
