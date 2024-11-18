"use client";


import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchApi } from "@/services/fetchApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from 'sonner'

interface RedefinePasswordProps {
  searchParams: {
    token: string;
  };
}

const formSchema = z
  .object({
    password: z.string(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export default function RedefinePassword({
  searchParams,
}: RedefinePasswordProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { formState, register, handleSubmit } = form;

  const onSubmit = async (dataForm: z.infer<typeof formSchema>) => {
    const response = await fetchApi(
      `/recovery-password/redefine?token=${searchParams.token}`,
      {
        method: "PUT",
        body: JSON.stringify({
          password: dataForm.password,
        }),
      }
    );

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error,{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    toast.success("Senha salva com sucesso",{
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    window.location.href = "/";
  };

  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Redefine password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="senha"
                required
                {...register("password", { required: true })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm">Confirme a senha</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="confirmação de senha"
                required
                {...register("confirm", { required: true })}
              />
            </div>
          </CardContent>
        </form>

        <CardFooter>
          <Button onClick={form.handleSubmit(onSubmit)} className="w-full">Salvar</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
