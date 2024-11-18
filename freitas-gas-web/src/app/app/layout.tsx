"use client";

import { useUser } from "@/contexts/user-context";
import "dotenv/config";
import { signOut, useSession } from "next-auth/react";
import { PropsWithChildren, useEffect } from "react";
import LoadingAnimation from "./_components/loading-page";
import { MainSidebar } from "./_components/main-sidebar";

export default function Layout({ children }: PropsWithChildren) {
  const { data, status } = useSession();
  const { loadingUser } = useUser();

  useEffect(() => {
    if (status === "unauthenticated") {
      loadOut();
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated" && !data) {
      loadOut();
    }
  }, [status, data]);

  async function loadOut() {
    await signOut({
      redirect: false,
    });

    window.location.href = "/";
  }

  if (loadingUser) {
    return <LoadingAnimation />;
  }

  return (
    <div>
      <MainSidebar>
        <main>{children}</main>
      </MainSidebar>
    </div>
  );
}
