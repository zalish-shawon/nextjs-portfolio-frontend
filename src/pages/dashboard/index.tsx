import { GetServerSideProps } from "next";
import api from "../../lib/api";

export default function DashboardPage({ user }: { user: any }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <div className="mt-6 space-x-3">
        <a href="/dashboard/blogs/blogs" className="px-4 py-2 bg-blue-600 text-white rounded">Manage Blogs</a>
        <a href="/dashboard/projects/blogs" className="px-4 py-2 bg-gray-800 text-white rounded">Manage Projects</a>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${API}/api/auth/me`, {
      headers: { cookie: ctx.req.headers.cookie || "" },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Unauthorized");
    const user = await res.json();
    return { props: { user } };
  } catch {
    return { redirect: { destination: "/login", permanent: false } };
  }
};
