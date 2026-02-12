import { DashboardShell, StatCard } from '@/components/dashboard-shell';

export default function FirstAdminPage() {
  return <DashboardShell title="First Admin · Stock Intake"><StatCard label="Products in Admin Stock" value="--" /><StatCard label="Duplicate Barcode Blocks" value="--" /></DashboardShell>;
}
