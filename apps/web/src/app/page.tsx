// apps/web/src/app/page.tsx
"use client";
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">♟️ C4C Chess</h1>
        <p className="text-gray-400">Play chess, earn C4C tokens on BSC</p>
        <p className="text-sm text-gray-500 mt-8">Token: 0xaac20575371de01b4d10c4e7566d5453d72d56e7</p>
      </div>
    </main>
  );
}