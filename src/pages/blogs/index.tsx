import Link from "next/link";
import { GetStaticProps } from "next";

export default function Blogs({ blogs }: { blogs: any[] }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">All Blogs</h1>
      <div className="space-y-4">
        {blogs.map((b) => (
          <Link key={b._id} href={`/blogs/${b.slug}`} className="block bg-white p-4 rounded shadow hover:shadow-md transition">
            <h3 className="font-bold">{b.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{b.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await fetch(`${API}/api/blogs`);
  const blogs = await res.json();
  return { props: { blogs }, revalidate: 60 };
};
