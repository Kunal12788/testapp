import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-8 p-6 text-center">
      <h1 className="text-4xl font-bold">Jewellery Enterprise Platform</h1>
      <p className="max-w-2xl text-slate-300">Production-ready foundation with RBAC, immutable audit logs, strict workflow APIs, and responsive role dashboards.</p>
      <Link href="/login" className="rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:scale-105 hover:bg-blue-500">Go to secure login</Link>
    </main>
  );
}
