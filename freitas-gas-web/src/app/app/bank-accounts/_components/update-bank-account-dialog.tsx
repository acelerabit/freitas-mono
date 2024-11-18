"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface UpdateBankAccountDialogProps {
  open: boolean;
  onOpenChange: () => void;
  bankId: string;
}

const paymentsMapper = {
  CARTAO: "Cartão de débito",
  CARTAO_CREDITO: "Cartão de crédito",
  DINHEIRO: "Dinheiro",
  FIADO: "À receber",
  PIX: "Pix",
  TRANSFERENCIA: "Transferência",
};

const formSchema = z.object({
  bank: z.string().min(1, "O nome do banco é obrigatório"),
});

export function UpdateBankAccountDialog({
  open,
  onOpenChange,
  bankId,
}: UpdateBankAccountDialogProps) {
  const { user, loadingUser } = useUser();

  const [paymentsAssociated, setPaymentsAssociated] = useState<string[]>([
    "CARTAO",
    "CARTAO_CREDITO",
    "DINHEIRO",
    "FIADO",
    "PIX",
    "TRANSFERENCIA",
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { control } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const requestData = {
      bank: values.bank,
      paymentsAssociated,
    };

    const response = await fetchApi(`/bank-account/${bankId}`, {
      method: "PUT",
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const respError = await response.json();

      toast.error(respError.error, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      return;
    }

    toast.success("Conta atualizada com sucesso", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });

    window.location.reload();
  }

  async function getBankAccount() {
    const response = await fetchApi(`/bank-account/${bankId}`);

    if (!response.ok) {
      const respError = await response.json();

      toast.error(respError.error, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      return;
    }

    const data = await response.json();

    form.setValue("bank", data.bank);
    setPaymentsAssociated(data.paymentsAssociated);
  }

  function removeFromPaymentsAssociated(payment: string) {
    const paymentsUpdated = paymentsAssociated.filter(
      (paymentAssociated) => paymentAssociated !== payment
    );

    setPaymentsAssociated(paymentsUpdated);
  }

  function redefine() {
    setPaymentsAssociated([
      "CARTAO",
      "CARTAO_CREDITO",
      "DINHEIRO",
      "FIADO",
      "PIX",
      "TRANSFERENCIA",
    ]);
  }

  useEffect(() => {
    if (open) {
      getBankAccount();
    }
  }, [open]);

  if (!user) {
    return;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar conta</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="bank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banco</FormLabel>
                  <FormControl>
                    <Input type="string" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <p className="font-medium mt-10">
                Remova os métodos de pagamento não associados a essa conta
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {paymentsAssociated.map((payment) => (
                  <p
                    key={payment}
                    className="flex items-center gap-4 rounded-xl px-2 bg-zinc-200"
                  >
                    {paymentsMapper[payment as keyof typeof paymentsMapper]}

                    <X
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => removeFromPaymentsAssociated(payment)}
                    />
                  </p>
                ))}
              </div>

              <Button
                variant="ghost"
                onClick={redefine}
                type="button"
                className="mt-4"
              >
                Redefinir
              </Button>
            </div>

            <div className="w-full flex justify-end">
              <Button className="mt-4" type="submit">
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
