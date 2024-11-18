"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/services/fetchApi";
import SalesDashboard from "./_components/salesDashboard";
import Filters from "./_components/filters";
import dayjs from "dayjs";
import { OnlyRolesCanAccess } from "../_components/only-who-can-access";

interface SalesIndicators {
  totalSales: number;
  totalPerDay: { createdAt: Date; total: number }[];
  totalPerMonth: { year: number; month: number; total: number }[];
}

interface ExpenseIndicators {
  totalExpenses: number;
  totalPerDay: { createdAt: Date; total: number }[];
  totalPerMonth: { year: number; month: number; total: number }[];
}

interface ExpenseProportion {
  category: string;
  percentage: number;
}

interface SalesVsExpenses {
  totalSales: { year: number; month: number; total: number }[];
  totalExpenses: { year: number; month: number; total: number }[];
}

interface User {
  id: string;
  name: string;
}

export default function CardsStats() {
  const [salesIndicators, setSalesIndicators] =
    useState<SalesIndicators | null>(null);
  const [expenseIndicators, setExpenseIndicators] =
    useState<ExpenseIndicators | null>(null);
  const [loadingSalesIndicators, setLoadingSalesIndicators] = useState(true);
  const [loadingExpenseIndicators, setLoadingExpenseIndicators] =
    useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [startDate, setStartDate] = useState<string>(
    dayjs().startOf("month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [deliverymanId, setDeliverymanId] = useState<string>("");
  const [averageDailySales, setAverageDailySales] = useState<number>(0);
  const [averageMonthlySales, setAverageMonthlySales] = useState<number>(0);
  const [loadingAverages, setLoadingAverages] = useState(true);
  const [expenseProportion, setExpenseProportion] = useState<
    ExpenseProportion[]
  >([]);
  const [loadingExpenseProportion, setLoadingExpenseProportion] =
    useState(true);
  const [salesVsExpenses, setSalesVsExpenses] = useState<SalesVsExpenses>({
    totalSales: [],
    totalExpenses: [],
  });
  const [grossProfit, setGrossProfit] = useState<number>(0);
  const [loadingGrossProfit, setLoadingGrossProfit] = useState(true);
  const [totalFiado, setTotalFiado] = useState<{ total: number }>({ total: 0 });
  const [loadingTotalFiado, setLoadingTotalFiado] = useState(true);
  const [paymentMethodTotals, setPaymentMethodTotals] = useState<{ [key: string]: number }>({});
  const [loadingPaymentMethodTotals, setLoadingPaymentMethodTotals] = useState(true);

  async function getSalesIndicators() {
    setLoadingSalesIndicators(true);
    const fetchUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/indicators`
    );

    if (startDate) {
      fetchUrl.searchParams.append("startDate", startDate);
    }

    if (endDate) {
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
      fetchUrl.searchParams.append("endDate", adjustedEndDate.toISOString());
    }

    if (deliverymanId) {
      fetchUrl.searchParams.append("deliverymanId", deliverymanId);
    }
    const response = await fetchApi(`${fetchUrl.pathname}${fetchUrl.search}`);
    if (!response.ok) {
      console.log(response);
      setSalesIndicators({ totalSales: 0, totalPerDay: [], totalPerMonth: [] });
      setLoadingSalesIndicators(false);
      return;
    }

    const data = await response.json();
    const totalSales = data?.totalSales || 0;
    const totalPerDay = data?.totalPerDay || [];
    const totalPerMonth = data?.totalPerMonth || [];

    setSalesIndicators({ totalSales, totalPerDay, totalPerMonth });
    setLoadingSalesIndicators(false);
  }

  async function getUsers() {
    const fetchUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/all`;
    const response = await fetchApi(fetchUrl);
    if (!response.ok) return;

    const data = await response.json();
    const usersWithProps = data.map(
      (user: { _id: any; props: { name: any } }) => ({
        id: user._id,
        name: user.props.name,
      })
    );

    setUsers(usersWithProps);
    setLoadingUsers(false);
  }
  async function getAverageSales() {
    setLoadingAverages(true);
    const fetchUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/average-sales`
    );

    if (startDate) {
      fetchUrl.searchParams.append("startDate", startDate);
    }

    if (endDate) {
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
      fetchUrl.searchParams.append("endDate", adjustedEndDate.toISOString());
    }

    if (deliverymanId) {
      fetchUrl.searchParams.append("deliverymanId", deliverymanId);
    }

    const response = await fetchApi(`${fetchUrl.pathname}${fetchUrl.search}`);
    if (!response.ok) {
      setLoadingAverages(false);
      return;
    }

    const averageData = await response.json();
    setAverageDailySales(averageData.averageDailySales || 0);
    setAverageMonthlySales(averageData.averageMonthlySales || 0);
    setLoadingAverages(false);
  }

  async function getExpenseIndicators() {
    setLoadingExpenseIndicators(true);
    const fetchUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions/expenses/indicators`
    );

    if (startDate) {
      fetchUrl.searchParams.append("startDate", startDate);
    }

    if (endDate) {
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
      fetchUrl.searchParams.append("endDate", adjustedEndDate.toISOString());
    }

    if (deliverymanId) {
      fetchUrl.searchParams.append("deliverymanId", deliverymanId);
    }

    const response = await fetchApi(`${fetchUrl.pathname}${fetchUrl.search}`);
    if (!response.ok) {
      setLoadingExpenseIndicators(false);
      return;
    }

    const data = await response.json();
    setExpenseIndicators(data);
    setLoadingExpenseIndicators(false);
  }

  async function getExpenseProportion() {
    setLoadingExpenseProportion(true);
    const fetchUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions/expenses/proportion-by-category`
    );

    if (startDate) {
      fetchUrl.searchParams.append("startDate", startDate);
    }

    if (endDate) {
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
      fetchUrl.searchParams.append("endDate", adjustedEndDate.toISOString());
    }

    if (deliverymanId) {
      fetchUrl.searchParams.append("deliverymanId", deliverymanId);
    }

    const response = await fetchApi(`${fetchUrl.pathname}${fetchUrl.search}`);
    if (!response.ok) {
      setLoadingExpenseProportion(false);
      return;
    }

    const proportionData = await response.json();
    setExpenseProportion(proportionData);
    setLoadingExpenseProportion(false);
  }

  async function getSalesVsExpenses() {
    const fetchUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions/expenses/sales-vs-expenses`
    );

    if (startDate) {
      fetchUrl.searchParams.append("startDate", startDate);
    }

    if (endDate) {
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
      fetchUrl.searchParams.append("endDate", adjustedEndDate.toISOString());
    }

    if (deliverymanId) {
      fetchUrl.searchParams.append("deliverymanId", deliverymanId);
    }

    const response = await fetchApi(`${fetchUrl.pathname}${fetchUrl.search}`);
    if (!response.ok) {
      console.log("Erro ao buscar dados de vendas vs despesas");
      return;
    }

    const data = await response.json();
    setSalesVsExpenses(data);
  }

  async function getGrossProfit() {
    setLoadingGrossProfit(true);
    const fetchUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions/gross-profit`
    );

    if (startDate) {
      fetchUrl.searchParams.append("startDate", startDate);
    }

    if (endDate) {
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
      fetchUrl.searchParams.append("endDate", adjustedEndDate.toISOString());
    }

    if (deliverymanId) {
      fetchUrl.searchParams.append("deliverymanId", deliverymanId);
    }

    const response = await fetchApi(`${fetchUrl.pathname}${fetchUrl.search}`);
    if (!response.ok) {
      setLoadingGrossProfit(false);
      return;
    }

    const data = await response.json();
    setGrossProfit(data);
    setLoadingGrossProfit(false);
  }
  async function getTotalFiado() {
    setLoadingTotalFiado(true);
    const fetchUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/total-fiado`
    );

    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);

    fetchUrl.searchParams.append("paymentMethod", "FIADO");
    if (startDate) {
      fetchUrl.searchParams.append("startDate", startDate);
    }
    if (endDate) {
      fetchUrl.searchParams.append("endDate", adjustedEndDate.toISOString());
    }
    if (deliverymanId) {
      fetchUrl.searchParams.append("deliverymanId", deliverymanId);
    }

    const response = await fetchApi(`${fetchUrl.pathname}${fetchUrl.search}`);
    if (!response.ok) {
      console.log("Erro ao buscar total fiado");
      setLoadingTotalFiado(false);
      return;
    }

    const data = await response.json();
    if (data && typeof data.total === "number") {
      setTotalFiado({ total: data.total });
    } else {
      setTotalFiado({ total: 0 });
    }
  }
  async function getTotalByPaymentMethod() {
    setLoadingPaymentMethodTotals(true);
    const fetchUrl = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/total-by-payment-method`);

    if (startDate) {
      fetchUrl.searchParams.append("startDate", startDate);
    }

    if (endDate) {
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
      fetchUrl.searchParams.append("endDate", adjustedEndDate.toISOString());
    }

    if (deliverymanId) {
      fetchUrl.searchParams.append("deliverymanId", deliverymanId);
    }

    const response = await fetchApi(`${fetchUrl.pathname}${fetchUrl.search}`);
    if (!response.ok) {
      console.log("Erro ao buscar totais por método de pagamento");
      setLoadingPaymentMethodTotals(false);
      return;
    }

    const data = await response.json();
    setPaymentMethodTotals(data);
    setLoadingPaymentMethodTotals(false);
  }

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    getSalesIndicators();
    getAverageSales();
    getExpenseIndicators();
    getExpenseProportion();
    getSalesVsExpenses();
    getGrossProfit();
    getTotalFiado();
    getTotalByPaymentMethod();
  }, [startDate, endDate, deliverymanId]);

  return (
    <OnlyRolesCanAccess rolesCanAccess={["ADMIN"]}>
      <main className="p-4">
        <Filters
          startDate={startDate}
          endDate={endDate}
          deliverymanId={deliverymanId}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setDeliverymanId={setDeliverymanId}
          getSalesIndicators={getSalesIndicators}
          loadingUsers={loadingUsers}
          users={users}
        />
        <SalesDashboard
          loadingSalesIndicators={loadingSalesIndicators}
          salesIndicators={salesIndicators}
          expenseIndicators={expenseIndicators}
          salesVsExpenses={salesVsExpenses}
          grossProfit={grossProfit}
          expenseProportion={expenseProportion}
          loadingExpenseIndicators={loadingExpenseIndicators}
          loadingExpenseProportion={loadingExpenseProportion}
          averageDailySales={averageDailySales}
          averageMonthlySales={averageMonthlySales}
          loadingGrossProfit={loadingGrossProfit}
          totalFiado={totalFiado}
          paymentMethodTotals={paymentMethodTotals}
        />
      </main>
    </OnlyRolesCanAccess>
  );
}
