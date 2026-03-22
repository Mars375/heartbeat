import { requireAuth } from "@/lib/auth";
import { getMonitors } from "@/lib/db/queries";
import { Topbar } from "@/components/dashboard/topbar";
import { IncidentForm } from "@/components/dashboard/incident-form";

export default async function NewIncidentPage() {
  const { orgId } = await requireAuth();
  const monitors = await getMonitors(orgId);

  return (
    <div>
      <Topbar title="Report Incident" />
      <div className="p-6">
        <IncidentForm monitors={monitors.map((m) => ({ id: m.id, name: m.name }))} />
      </div>
    </div>
  );
}
