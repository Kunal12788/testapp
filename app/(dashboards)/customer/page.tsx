import { DashboardShell, StatCard } from '@/components/dashboard-shell';

export default function CustomerPage() {
  return <DashboardShell title="Customer Portal"><StatCard label="Allotted Products" value="--" /><StatCard label="Confirmed Inventory" value="--" /></DashboardShell>;
}
