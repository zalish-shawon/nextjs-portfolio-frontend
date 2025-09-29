import { useState } from "react";
import { useRouter } from "next/router";
import api from "../lib/api";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      // If backend returns token in body, save in localStorage for client API calls:
      if (res.data.token) localStorage.setItem("token", res.data.token);
      toast.success("Logged in");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Owner Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full px-3 py-2 border rounded" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="w-full px-3 py-2 border rounded" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
