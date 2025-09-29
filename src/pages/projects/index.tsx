import { GetStaticProps } from "next";

export default function Projects({ projects }: { projects: any[] }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Projects</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded shadow">
            {p.thumbnail && <img src={p.thumbnail} alt={p.title} className="w-full h-40 object-cover rounded mb-3" />}
            <h3 className="font-bold">{p.title}</h3>
            <p className="text-sm text-gray-600">{p.description}</p>
            {p.liveUrl && <a href={p.liveUrl} className="text-blue-600 block mt-2">Live</a>}
          </div>
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await fetch(`${API}/api/projects`);
  const projects = await res.json();
  return { props: { projects }, revalidate: 60 };
};
