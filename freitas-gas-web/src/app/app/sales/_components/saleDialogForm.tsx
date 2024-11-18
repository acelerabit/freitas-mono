"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { fetchApi } from "@/services/fetchApi";
import { useUser } from "../../../../contexts/user-context";
import { toast } from "react-hot-toast";
import { FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "react-currency-mask";
import { Separator } from "@/components/ui/separator";

interface ProductType {
  id: string;
  type: string;
  quantity: number;
  price: number;
  status: string;
}

interface Customer {
  name: string;
  id: string;
}

interface SaleDialogFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const productTypes = {
  FULL: "CHEIO",
  EMPTY: "VAZIO",
  COMODATO: "COMODATO",
};

const productTypesMapper = [
  {
    key: "P13",
    value: "P13",
  },
  {
    key: "P20",
    value: "P20",
  },
  {
    key: "P45",
    value: "P45",
  },
];

type BottleStatus = "EMPTY" | "FULL" | "COMODATO";

const bottleStatusMapper = [
  { key: "EMPTY", value: "Troca de gás" },
  { key: "FULL", value: "Vasilhame + gás" },
  { key: "COMODATO", value: "comodato" },
];

export function SaleDialogForm({
  isOpen,
  onClose,
  onSubmit,
}: SaleDialogFormProps) {
  const { user } = useUser();
  const { control, handleSubmit, setValue } = useForm();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    customerId: "",
    deliverymanId: user?.id || "",
    products: [{ type: "", status: "EMPTY", price: 0, quantity: 1 }],
    paymentMethod: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await fetchApi("/customers/all");
        const customersData = await customersResponse.json();
        const formattedCustomers = customersData.map(
          (customer: { id: any; props: { id: any; name: any } }) => ({
            id: customer.props.id,
            name: customer.props.name,
          })
        );
        setCustomers(formattedCustomers);

        const productsResponse = await fetchApi("/products");
        const productsData = await productsResponse.json();
        const formattedProducts = productsData.map(
          (product: {
            _id: any;
            _props: { type: any; status: any; price: any; quantity: any };
          }) => ({
            id: product._id,
            type: product._props.type,
            status: product._props.status,
            price: product._props.price / 100,
            quantity: product._props.quantity,
          })
        );
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleProductSelect = (type: string, index: number) => {
    let  currentProduct = formData.products[index]

    const selectedProduct = products.find(product => product.type === type && product.status === currentProduct.status);


    if (selectedProduct) {
      const updatedProducts = [...formData.products];
      updatedProducts[index] = {
        type: type,
        status: currentProduct.status,
        price: selectedProduct.price,
        quantity: updatedProducts[index].quantity || 1,
      };

      setFormData((prev) => ({ ...prev, products: updatedProducts }));
      setValue(`products[${index}]`, updatedProducts[index]);
    }
  };

  function handleTypeSaleSelect(value: string, index: number) {
    const selectedProduct = formData.products[index];

    const findProduct = products.find(
      (product) =>
        product.type === selectedProduct.type && product.status === value
    );

    if (selectedProduct && findProduct) {
      const updatedProducts = [...formData.products];
      updatedProducts[index] = {
        type: selectedProduct.type,
        status: value,
        price: findProduct.price,
        quantity: updatedProducts[index].quantity || 1,
      };

      setFormData((prev) => ({ ...prev, products: updatedProducts }));
      setValue(`products[${index}]`, updatedProducts[index]);
    }
  }

  const addProductField = () => {
    setFormData((prevData) => ({
      ...prevData,
      products: [
        ...prevData.products,
        { type: "", status: "EMPTY", price: 0, quantity: 1 },
      ],
    }));
  };
  const onSubmitHandler = (data: any) => {
    if(!formData.paymentMethod) {
      toast.error("Método de pagamento deve estar preenchido")
      return
    }

    
    const saleData = {
      ...formData,
      ...data,
      deliverymanId: user?.id || "",
    };

    onSubmit(saleData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Nova Venda</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="space-y-4 w-full"
        >
          <Controller
            name="customerId"
            control={control}
            rules={{ required: 'Selecione um cliente' }}
            render={({ field, fieldState }) => (
              <>
                <Select
                  {...field}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, customerId: value }));
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState?.error && (
                  <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                    {fieldState?.error?.message}
                  </p>
                )}
              </>
            )}
          />
          {formData.products.map((product, index) => (
            <div key={index} className="space-y-4">
              <Controller
                name={`products[${index}].id`}
                control={control}
                rules={{ required: 'Selecione um produto' }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      onValueChange={(value) => {
                        console.log("Selected Product:", value);
                        handleProductSelect(value, index);
                        field.onChange(value);
                      }}                      
                    >
                      <SelectTrigger className={fieldState?.error ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {productTypesMapper.map((product) => (
                          <SelectItem key={product.key} value={product.key}>
                            {product.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState?.error && (
                      <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                        {fieldState?.error?.message}
                      </p>
                    )}
                  </>
                )}
              />

              <Controller
                name={`products[${index}].status`}
                control={control}
                rules={{ required: 'Selecione um tipo de venda' }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      defaultValue="EMPTY"
                      onValueChange={(value) => handleTypeSaleSelect(value, index)}
                    >
                      <SelectTrigger className={fieldState?.error ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione um tipo de venda" />
                      </SelectTrigger>
                      <SelectContent>
                        {bottleStatusMapper.map((bottle) => (
                          <SelectItem key={bottle.key} value={bottle.key}>
                            {bottle.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState?.error && (
                      <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                        {fieldState?.error?.message}
                      </p>
                    )}
                  </>
                )}
              />

              <Controller
                name={`products[${index}].price`}
                control={control}
                rules={{ required: 'Preço é obrigatório' }}
                render={({ field, fieldState }) => (
                  <>
                    <div>
                      <Label>Preço</Label>

                      <CurrencyInput
                        value={field.value}
                        onChangeValue={(_, value) => {
                          const updatedProducts = [...formData.products];
                          updatedProducts[index].price = parseFloat(String(value));
                          setFormData((prev) => ({ ...prev, products: updatedProducts }));
                          field.onChange(value);
                        }}
                        InputElement={
                          <input
                            type="text"
                            id="currency"
                            placeholder="R$ 0,00"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        }
                      />
                      {fieldState?.error && (
                        <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                          {fieldState?.error?.message}
                        </p>
                      )}
                    </div>
                  </>
                )}
              />

              <Controller
                name={`products[${index}].quantity`}
                control={control}
                rules={{ required: 'Quantidade é obrigatória' }}
                render={({ field, fieldState }) => (
                  <>
                    <div>
                      <Label>Quantidade</Label>
                      <Input
                        placeholder="Quantidade"
                        type="number"
                        {...field}
                        value={product.quantity}
                        onChange={(e) => {
                          const updatedProducts = [...formData.products];
                          updatedProducts[index].quantity = parseInt(e.target.value, 10) || 1;
                          setFormData((prev) => ({ ...prev, products: updatedProducts }));
                          field.onChange(parseInt(e.target.value, 10) || 1);
                        }}
                      />
                      {fieldState?.error && (
                        <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                          {fieldState?.error?.message}
                        </p>
                      )}
                    </div>
                  </>
                )}
              />

              <Separator className="last:hidden" />
            </div>
          ))}
          <Button type="button" onClick={addProductField}>
            Adicionar Produto
          </Button>

          <Controller
            name="paymentMethod"
            control={control}
            rules={{ required: 'Selecione um método de pagamento' }}
            render={({ field, fieldState }) => (
              <>
                <Select
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setFormData((prev) => ({ ...prev, paymentMethod: value }));
                  }}
                >
                  <SelectTrigger className={fieldState?.error ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione um método de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                    <SelectItem value="CARTAO">Cartão de débito</SelectItem>
                    <SelectItem value="CARTAO_CREDITO">Cartão de crédito</SelectItem>
                    <SelectItem value="PIX">Pix</SelectItem>
                    <SelectItem value="FIADO">Venda a receber</SelectItem>
                    <SelectItem value="TRANSFERENCIA">Transferência</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState?.error && (
                  <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                    {fieldState?.error?.message}
                  </p>
                )}
              </>
            )}
          />
          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
