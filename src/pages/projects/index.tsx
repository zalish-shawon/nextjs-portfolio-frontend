import { GetStaticProps } from "next";
import { motion } from "framer-motion";
import Head from "next/head";

export default function Projects({ projects }: { projects: any[] }) {
  return (
    <>
      <Head>
        <title>Projects | My Portfolio</title>
        <meta name="description" content="Explore my latest web development projects." />
      </Head>

      <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
            🚀 My Projects
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((p, i) => (
              <motion.div
                key={p._id}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden border border-gray-100 flex flex-col"
              >
                {/* Thumbnail */}
                {p.thumbnail && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {p.title}
                  </h3>
                  <p className="text-gray-600 text-sm flex-grow">{p.description}</p>

                  {/* Buttons */}
                  <div className="mt-4 flex space-x-3">
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Live Demo
                      </a>
                    )}
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${API}/api/projects`);
    const projects = await res.json();
    return { props: { projects }, revalidate: 60 };
  } catch {
    return { props: { projects: [] }, revalidate: 60 };
  }
};
