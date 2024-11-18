"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchApi } from "@/services/fetchApi";
import { User2 } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useUser } from "@/contexts/user-context";
import LoadingAnimation from "../../_components/loading-page";

// const formSchema = z.object({
// imageUrl: z.string().optional(),
// });

export function UploadProfile() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const { user, loadingUser } = useUser();

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     imageUrl: user?.avatarUrl
  //   }
  // });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      toast.error("Por favor, selecione um arquivo para fazer upload.", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetchApi(
      `/upload-file/${user?.id}`,
      {
        method: "POST",
        body: formData,
      },
      true // no define content-type
    );

    if (!response.ok) {
      toast.error("Não foi fazer upload dessa imagem", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    const dataResp = await response.json();

    setImageUrl(dataResp.url);
    window.location.reload()
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, selecione apenas imagens.", {
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });
        return;
      }

      // Verificar o tamanho do arquivo (5MB máximo)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("O tamanho máximo do arquivo é de 5MB.", {
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        // Agora você pode usar 'imageUrl' para exibir uma prévia da imagem
        setImageUrl(url);
      };
      reader.readAsDataURL(file);

      setSelectedFile(file);
    }
  };

  useEffect(() => {
    if (!loadingUser && user) {
      setImageUrl(user?.avatarUrl);
    }
  }, [loadingUser, user]);

  if (loadingUser) {
    return <LoadingAnimation />;
  }

  return (
    <div className="relative">
      {/* <Form  
      // {...form}
    >*/}
      <form
        // onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 max-w-[560px]"
        noValidate
      >
        <div className="flex gap-2">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="w-12 h-12 rounded-full" />
          ) : (
            <Label htmlFor="imageLink">
              <User2 className="w-12 h-12 text-slate-600 bg-slate-100 rounded-full p-2 cursor-pointer" />
            </Label>
          )}
          <Input
            id="imageLink"
            type="file"
            className="cursor-pointer"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <Button onClick={onSubmit} className="w-full mt-4">
          Enviar
        </Button>
      </form>
      {/* </Form> */}
    </div>
  );
}
