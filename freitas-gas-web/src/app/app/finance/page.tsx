"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import TableTransaction from "./_components/table-transactions";
import useModal from "@/hooks/use-modal";
import { AddTransactionDialog } from "./_components/add-transaction-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyBalance } from "./_components/company-balance";
import { TransferTransactionDialog } from "./_components/transfer-transaction-dialog";
import { TableDeposits } from "./_components/deposit-table";
import { TableCustomersWithDebts } from "./_components/customer-table";
import { OnlyRolesCanAccess } from "../_components/only-who-can-access";
import { TableSuppliersWithDebts } from "./_components/suppliers-debts-table";
import { TransferToAccountDialog } from "./_components/tranfer-to-account-dialog";
import { TransferAccountTable } from "./_components/transfer-account-table";

export default function Finance() {
  const { isOpen, onOpenChange } = useModal();
  const { isOpen: isOpenTransfer, onOpenChange: onOpenChangeTransfer } = useModal();
  const { isOpen: isOpenTransferAccount, onOpenChange: onOpenChangeTransferAccount } = useModal();


  return (
    <OnlyRolesCanAccess rolesCanAccess={["ADMIN"]}>
    <main className="p-8 flex flex-col">
      <h1 className="text-4xl font-semibold">Financeiro</h1>

      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>financeiro</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-2">
        <CompanyBalance />

        <div className="w-full flex items-center justify-end">
          <div className="space-x-4">
            <Button onClick={onOpenChange}>Adicionar movimentação</Button>
            <Button onClick={onOpenChangeTransfer}>Fazer transferência</Button>
            <Button onClick={onOpenChangeTransferAccount}>Fazer transferência entre contas</Button>

          </div>
        </div>
        <TableTransaction />
        <TableDeposits />
        <div className="mt-10">
          <TableCustomersWithDebts />
        </div>
        <div className="mt-10">
          <TableSuppliersWithDebts />
        </div>
        <div className="mt-10">
          <TransferAccountTable />
        </div>
      </div>

      <AddTransactionDialog open={isOpen} onOpenChange={onOpenChange} />
      <TransferTransactionDialog open={isOpenTransfer} onOpenChange={onOpenChangeTransfer} />
      <TransferToAccountDialog open={isOpenTransferAccount} onOpenChange={onOpenChangeTransferAccount} />

    </main>
    </OnlyRolesCanAccess>
  );
}
