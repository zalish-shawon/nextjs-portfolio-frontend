import { useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import api from "../lib/api";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        // Call backend logout (optional — can safely remove)
        await api.post("/auth/logout");
      } catch (err) {
        console.error("Logout API error:", err);
      }

      // Remove user info from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }

      toast.success("Logged out");
      router.replace("/login");
    })();
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-gray-600">
      Logging out...
    </div>
  );
}
