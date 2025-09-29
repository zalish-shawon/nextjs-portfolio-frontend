import { GetServerSideProps } from "next";

export default function Home({ status }: { status: string }) {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-2">Welcome</h1>
      <p className="text-gray-600">
        Backend status: <strong>{status}</strong>
      </p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${API}/ping`);
    const data = await res.json();
    return { props: { status: data.ok ? "OK" : "Unknown" } };
  } catch {
    return { props: { status: "Not reachable" } };
  }
};
