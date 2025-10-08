import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setLoggedIn(!!token);
  }, [router.pathname]);

  return (
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          My Portfolio
        </Link>
        <nav className="space-x-4 text-sm flex items-center">
          <Link href="/blogs">Blogs</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/about">About</Link>

          {loggedIn ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/logout" className="ml-3 px-3 py-1 border rounded">
                Logout
              </Link>
            </>
          ) : (
            <Link href="/login" className="ml-3 px-3 py-1 border rounded">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
