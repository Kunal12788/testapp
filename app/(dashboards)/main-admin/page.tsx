import { DashboardShell, StatCard } from '@/components/dashboard-shell';

export default function MainAdminPage() {
  return <DashboardShell title="Main Admin · Executive"><StatCard label="Total Company Gold Inventory" value="--" /><StatCard label="Completed Transactions" value="--" /></DashboardShell>;
}
