import { GetServerSideProps } from "next";
import Link from "next/link";

export default function DashboardPage({ user }: { user: any }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-lg text-gray-700">
            Welcome, <span className="font-semibold">{user?.email}</span>
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blog Card */}
            <Link href="/dashboard/blogs/blogs" className="block">
              <div className="bg-blue-600 hover:bg-blue-700 transition text-white p-6 rounded-lg shadow flex flex-col justify-between h-full">
                <h2 className="text-xl font-bold mb-2">Manage Blogs</h2>
                <p className="text-sm opacity-90">Create, edit, and delete your blog posts.</p>
              </div>
            </Link>

            {/* Project Card */}
            <Link href="/dashboard/projects/projects" className="block">
              <div className="bg-gray-800 hover:bg-gray-900 transition text-white p-6 rounded-lg shadow flex flex-col justify-between h-full">
                <h2 className="text-xl font-bold mb-2">Manage Projects</h2>
                <p className="text-sm opacity-90">View, update, and manage your projects.</p>
              </div>
            </Link>
          </div>
        </div>
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
