"use client";
export const dynamic = "force-dynamic";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  useEffect(() => { router.replace("/profile"); }, [router]);
  return <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><p>Redirecting...</p></main>;
}