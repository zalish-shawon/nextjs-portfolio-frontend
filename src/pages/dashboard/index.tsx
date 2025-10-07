/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetServerSideProps } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { PenSquare, FolderKanban, LogOut } from "lucide-react";

export default function DashboardPage({ user }: { user: any }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-lg rounded-2xl p-8"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
            Welcome back,{" "}
            <span className="text-blue-600">{user?.email?.split("@")[0]}</span> 👋
          </h2>

          <p className="text-gray-600 mb-8">
            Manage your content efficiently — you can edit, create, or review your blogs and projects here.
          </p>

          {/* Cards */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Blog Card */}
            <Link href="/dashboard/blogs/blogs">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-br from-blue-600 to-blue-700 hover:shadow-xl text-white p-8 rounded-2xl flex flex-col justify-between h-full transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <PenSquare size={28} />
                  <h3 className="text-2xl font-semibold">Manage Blogs</h3>
                </div>
                <p className="opacity-90 mb-6">
                  Create, edit, and manage your blog posts easily.
                </p>
                <span className="text-sm font-medium opacity-80">
                  Go to Blogs →
                </span>
              </motion.div>
            </Link>

            {/* Projects Card */}
            <Link href="/dashboard/projects/projects">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 hover:shadow-xl text-white p-8 rounded-2xl flex flex-col justify-between h-full transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FolderKanban size={28} />
                  <h3 className="text-2xl font-semibold">Manage Projects</h3>
                </div>
                <p className="opacity-90 mb-6">
                  View, update, and organize your portfolio projects.
                </p>
                <span className="text-sm font-medium opacity-80">
                  Go to Projects →
                </span>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </main>
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
