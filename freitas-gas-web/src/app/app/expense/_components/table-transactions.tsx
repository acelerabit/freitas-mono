import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Datepicker from "react-tailwindcss-datepicker";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { fetchApi } from "@/services/fetchApi";
import { formatDate, formatDateWithHours } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatCurrent";
import { EllipsisVertical } from "lucide-react";
import useModal from "@/hooks/use-modal";
import { ConfirmDelete } from "./confirm-delete";
import { UpdateTransactionDialog } from "./edit-transaction-dialog";
import { fCurrencyIntlBRL } from "@/utils/formatNumber";

interface Transaction {
  _id: string;
  amount: number;
  transactionType: string;
  category: string;
  userId: string;
  customCategory?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
interface DateFilter {
  startDate: Date | null;
  endDate: Date | null;
}

const transactionTypeLabels: { [key: string]: string } = {
  ENTRY: "Entrada",
  EXIT: "Saída",
  TRANSFER: "Transferência",
};

const transactionCategoryLabels: { [key: string]: string } = {
  DEPOSIT: "Depósito",
  SALE: "Venda",
  EXPENSE: "Despesa",
  CUSTOM: "Personalizado",
};

export function TableTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [usersMap, setUsersMap] = useState<{ [key: string]: string }>({});
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>({
      startDate: new Date(new Date().setHours(0, 0, 0, 0)),
      endDate: new Date(new Date().setHours(23, 59, 59, 999)),
    });

  const { isOpen, onOpenChange } = useModal();
  const { isOpen: isOpenModalUpdate, onOpenChange: onOpenChangeModalUpdate } =
    useModal();

  async function getTransactions() {
    setLoadingTransactions(true);
      
    const fetchTransactionsUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions/expenses`
    );
      
    fetchTransactionsUrl.searchParams.set("page", String(page));
    fetchTransactionsUrl.searchParams.set("itemsPerPage", String(itemsPerPage));
      
    if (dateFilter.startDate) {
      fetchTransactionsUrl.searchParams.set(
        "startDate",
        dateFilter.startDate.toISOString().split("T")[0]
      );
    }
  
    if (dateFilter.endDate) {
      const endDateWithTime = new Date(dateFilter.endDate);
      endDateWithTime.setHours(23, 59, 59);
      
      fetchTransactionsUrl.searchParams.set(
        "endDate",
        endDateWithTime.toISOString().split("T")[0]
      );
    }
      
    const response = await fetchApi(
      `${fetchTransactionsUrl.pathname}${fetchTransactionsUrl.search}`
    );
      
    if (!response.ok) {
      setLoadingTransactions(false);
      return;
    }
      
    const data = await response.json();
    const transactionsList = data.map((item: any) => ({
      _id: item._id,
      amount: item._props.amount,
      transactionType: transactionTypeLabels[item._props.transactionType],
      category: transactionCategoryLabels[item._props.category],
      userId: item._props.userId,
      customCategory: item._props.customCategory || "-",
      description: item._props.description || "-",
      createdAt: item._props.createdAt || "",
    }));
      
    setTransactions(transactionsList);
    setLoadingTransactions(false);
  }    
  const handleValueChange = (value: DateFilter | null) => {
    if (value === null) {
      setDateFilter({ startDate: null, endDate: null });
    } else {
      setDateFilter(value);
    }
  };

  async function getUsersAll() {
    setLoadingUsers(true);
    const fetchUsersUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/all`
    );

    const response = await fetchApi(
      `${fetchUsersUrl.pathname}${fetchUsersUrl.search}`
    );

    if (!response.ok) {
      setLoadingUsers(false);
      return {};
    }

    const usersData = await response.json();
    const userMap = usersData.reduce(
      (acc: { [key: string]: string }, user: any) => {
        acc[user._id] = user.props.email;
        return acc;
      },
      {}
    );

    setUsersMap(userMap);
    setLoadingUsers(false);
  }

  useEffect(() => {
    getUsersAll();
    getTransactions();
  }, [page, dateFilter]);

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  const openEditDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);

    onOpenChangeModalUpdate();
  };

  const openConfirmDeleteDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);

    onOpenChange();
  };

  function onCloseUpdateModal() {
    setSelectedTransaction(null);

    onOpenChangeModalUpdate();
  }

  return (
    <>
      <div>
        <div className="w-full flex items-center gap-2">
          <div className="w-full md:max-w-xs my-4">
            <Datepicker
              containerClassName="relative border rounded-md border-zinc-300"
              popoverDirection="down"
              primaryColor="blue"
              showShortcuts={true}
              placeholder="DD/MM/YYYY ~ DD/MM/YYYY"
              displayFormat="DD/MM/YYYY"
              value={dateFilter}
              onChange={handleValueChange}
            />
          </div>
        </div>
      </div>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Tipo de Movimentação</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Categoria customizada</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingTransactions || loadingUsers ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Carregando...
              </TableCell>
            </TableRow>
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Nenhuma movimentação encontrada.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>{transaction.transactionType}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  {usersMap[transaction.userId] || "Desconhecido"}
                </TableCell>
                <TableCell>{transaction.customCategory}</TableCell>
                <TableCell>{fCurrencyIntlBRL(transaction.amount / 100)}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{formatDateWithHours(transaction.createdAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Button
                          className="w-full"
                          onClick={() => openEditDialog(transaction)}
                        >
                          Editar
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Button
                          className="w-full"
                          variant="destructive"
                          onClick={() => openConfirmDeleteDialog(transaction)}
                        >
                          Remover
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        {selectedTransaction && (
          <UpdateTransactionDialog
            open={isOpenModalUpdate}
            transaction={selectedTransaction}
            onClose={onCloseUpdateModal}
          />
        )}

        {selectedTransaction && (
          <ConfirmDelete
            open={isOpen}
            onOpenChange={onOpenChange}
            expenseId={selectedTransaction?._id}
          />
        )}
      </Table>
      <div className="w-full flex gap-2 items-center justify-end mt-4">
        <Button
          className="disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={previousPage}
        >
          Anterior
        </Button>
        <Button
          className="disabled:cursor-not-allowed"
          disabled={transactions.length < itemsPerPage}
          onClick={nextPage}
        >
          Próxima
        </Button>
      </div>
    </>
  );
}
