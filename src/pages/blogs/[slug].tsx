import { GetStaticPaths, GetStaticProps } from "next";

export default function BlogPage({ blog }: { blog: any }) {
  return (
    <article className="prose lg:prose-xl">
      <h1>{blog.title}</h1>
      {blog.coverImage && <img src={blog.coverImage} alt={blog.title} className="rounded max-w-full" />}
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    </article>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await fetch(`${API}/api/blogs`);
  const blogs = await res.json();
  const paths = blogs.map((b: any) => ({ params: { slug: b.slug } }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await fetch(`${API}/api/blogs/${params?.slug}`);
  if (res.status === 404) return { notFound: true };
  const blog = await res.json();
  return { props: { blog }, revalidate: 60 };
};
