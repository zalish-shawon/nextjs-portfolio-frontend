import React from "react";
import { GetServerSideProps } from "next";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function Home({ status }: { status: string }) {
  const statusColors: Record<string, string> = {
    OK: "text-green-600",
    "Not reachable": "text-red-600",
    Unknown: "text-gray-500",
  };

  const statusIcons: Record<string, JSX.Element> = {
    OK: <CheckCircle2 className="w-6 h-6 text-green-600" />,
    "Not reachable": <XCircle className="w-6 h-6 text-red-600" />,
    Unknown: <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md text-center border border-gray-100"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to portfolio management
        </h1>
        <p className="text-gray-500 mb-6">
          Monitor your backend connection status easily.
        </p>

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="flex items-center space-x-2">
            {statusIcons[status] || statusIcons["Unknown"]}
            <span className={`font-semibold text-lg ${statusColors[status]}`}>
              {status}
            </span>
          </div>

          <span className="text-sm text-gray-400 mt-2">
            API Endpoint: <code className="text-gray-500">/ping</code>
          </span>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Refresh Status
        </button>
      </motion.div>
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
