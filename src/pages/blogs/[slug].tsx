import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import Head from "next/head";

export default function BlogPage({ blog }: { blog: any }) {
  return (
    <>
      <Head>
        <title>{blog.title} | My Portfolio Blog</title>
        <meta name="description" content={blog.excerpt || blog.title} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:image" content={blog.image} />
        <meta property="og:type" content="article" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden"
        >
          {/* Cover Image */}
          {blog.image && (
            <div className="relative h-80 w-full overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="p-8 lg:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>

            <div className="flex justify-between text-sm text-gray-500 mb-8">
              <p>
                {blog.author ? `By ${blog.author}` : "Admin"} ·{" "}
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p>Slug: {blog.slug}</p>
            </div>

            <div
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </motion.article>
        {/* Back to Blogs */}
        <div className="max-w-4xl mx-auto text-center mt-10">
          <Link
            href="/blogs"
            className="inline-block text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            ← Back to Blogs
          </Link>
        </div>
        </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${API}/api/blogs`);
    const blogs = await res.json();
    const paths = blogs.map((b: any) => ({ params: { slug: b.slug } }));
    return { paths, fallback: "blocking" };
  } catch {
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await fetch(`${API}/api/blogs/${params?.slug}`);
  if (res.status === 404) return { notFound: true };
  const blog = await res.json();
  return { props: { blog }, revalidate: 60 };
};
