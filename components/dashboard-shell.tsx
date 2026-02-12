import { ReactNode } from 'react';

export function DashboardShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-7xl p-6">
      <header className="mb-6 glass p-5">
        <h1 className="text-2xl font-bold">{title}</h1>
      </header>
      <section className="grid gap-4 md:grid-cols-2">{children}</section>
    </main>
  );
}

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass p-5">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
