import { DashboardShell, StatCard } from '@/components/dashboard-shell';

export default function FourthAdminPage() {
  return <DashboardShell title="Fourth Admin · Gold Collection"><StatCard label="Current Gold Rate /10gm" value="--" /><StatCard label="Collections Awaiting Confirmation" value="--" /></DashboardShell>;
}
