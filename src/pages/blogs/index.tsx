/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { GetStaticProps } from "next";
import { motion } from "framer-motion";

export default function Blogs({ blogs }: { blogs: any[] }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
          📝 All Blogs
        </h1>

        {blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs available yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((b, index) => (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={`/blogs/${b.slug}`}
                  className="block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden group"
                >
                  {b.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={b.image}
                        alt={b.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition">
                      {b.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                      {b.excerpt ||
                        b.content?.slice(0, 120).replace(/<[^>]+>/g, "") + "..."}
                    </p>
                    <div className="mt-4 text-xs text-gray-400 flex justify-between items-center">
                      <span>
                        {b.createdAt
                          ? new Date(b.createdAt).toLocaleDateString()
                          : "Unknown date"}
                      </span>
                      <span className="text-blue-500 font-medium">
                        Read More →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${API}/api/blogs`);
    const blogs = await res.json();
    return { props: { blogs }, revalidate: 60 };
  } catch {
    return { props: { blogs: [] } };
  }
};
