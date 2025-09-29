"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";


export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
const router = useRouter();


useEffect(() => {
const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
if (!token) {
router.replace('/login');
}
}, [router]);


return <>{children}</>;
}