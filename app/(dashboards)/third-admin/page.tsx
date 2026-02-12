import { DashboardShell, StatCard } from '@/components/dashboard-shell';

export default function ThirdAdminPage() {
  return <DashboardShell title="Third Admin · Billing"><StatCard label="Pending Billing" value="--" /><StatCard label="Making Charge Collected" value="--" /></DashboardShell>;
}
