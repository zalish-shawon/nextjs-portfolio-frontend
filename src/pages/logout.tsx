import { useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import api from "../lib/api";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await api.post("/auth/logout");
      } catch (err) {}
      if (typeof window !== "undefined") localStorage.removeItem("token");
      toast.success("Logged out");
      router.replace("/login");
    })();
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      Logging out...
    </div>
  );
}
