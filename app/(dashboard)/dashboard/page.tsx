import { DashboardShell } from '@/components/dashboard-shell';

export default function DashboardPage({ searchParams }: { searchParams: { role?: string } }) {
  const role = searchParams.role ?? 'main-admin';
  return <DashboardShell role={role} />;
}
