"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export function useAuthGuard(roles?: ("seller" | "buyer" | "admin")[]) {
  const { user, ready } = useApp();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (roles && !roles.includes(user.role)) {
      router.replace("/");
      return;
    }
    setAllowed(true);
  }, [user, ready, router, roles]);

  return { user, ready, allowed };
}
