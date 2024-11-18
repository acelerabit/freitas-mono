"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import { formatDateWithHours } from "@/utils/formatDate";
import { useEffect, useState } from "react";
import LoadingAnimation from "../../_components/loading-page";

interface Notification {
  id: string;
  message: string;
  createdAt: string;
}

export function TableNotificationsUnread() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { user, loadingUser } = useUser();

  async function fetchNotificationsUnread() {
    const fetchUsersUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/${user?.id}`
    );

    fetchUsersUrl.searchParams.set("page", String(page));
    fetchUsersUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

    const response = await fetchApi(
      `${fetchUsersUrl.pathname}${fetchUsersUrl.search}`
    );

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    setNotifications(data.notifications);
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  useEffect(() => {
    fetchNotificationsUnread();
  }, [page]);

  if (loadingUser) {
    return <LoadingAnimation />;
  }

  return (
    <Card className="col-span-2">
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mensagem</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell className="font-medium max-w-[420px]">
                  {notification.message}
                </TableCell>
                <TableCell className="font-medium">
                  {formatDateWithHours(notification.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="w-full flex gap-2 items-center justify-end">
          <Button
            className="disabled:cursor-not-allowed"
            disabled={page === 1}
            onClick={previousPage}
          >
            Anterior
          </Button>
          <Button
            className="disabled:cursor-not-allowed"
            disabled={notifications.length < itemsPerPage}
            onClick={nextPage}
          >
            Próxima
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
