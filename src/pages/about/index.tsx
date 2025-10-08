import { GetStaticProps } from "next";

export default function About({ about }: { about: any }) {
  if (!about) return <p className="text-center py-20">No about info found.</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10">
      <div>
        <h1 className="text-4xl font-bold mb-2">{about.name}</h1>
        <p className="text-gray-600 text-lg mb-6">{about.title}</p>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: about.bio }}
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {about.skills?.map((skill: string, i: number) => (
            <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">Experience</h2>
        <ul className="space-y-4">
          {about.experience?.map((exp: any, i: number) => (
            <li key={i} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg">{exp.role}</h3>
              <p className="text-sm text-gray-600">{exp.company} — {exp.years}</p>
              <p className="mt-1">{exp.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await fetch(`${API}/api/about`);
  const about = await res.json();
  return { props: { about }, revalidate: 60 };
};
