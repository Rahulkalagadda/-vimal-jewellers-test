import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthGuard() {
  const router = useRouter();
  useEffect(() => {
    // You can replace this with a cookie check if you switch to HTTP-only cookies
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.replace("/auth/sign-in");
    }
  }, [router]);
}
