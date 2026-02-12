import { DashboardShell, StatCard } from '@/components/dashboard-shell';

export default function SecondAdminPage() {
  return <DashboardShell title="Second Admin · Allotment"><StatCard label="Pending Double Verifications" value="--" /><StatCard label="Allotted Today" value="--" /></DashboardShell>;
}
