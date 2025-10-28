import * as z from "zod";

export const SignInSchema = z.object({
  cpf: z.string().min(1, {
    message: "CPF é obrigatório",
  }),
  password: z.string().min(1, {
    message: "Senha é obrigatória",
  }),
});

export type SignInBody = z.infer<typeof SignInSchema>;
export type SigninBodyKeys = keyof SignInBody;
