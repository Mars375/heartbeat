import { requireAuth } from "@/lib/auth";
import { getIncidents } from "@/lib/db/queries";
import { Topbar } from "@/components/dashboard/topbar";
import { IncidentCard } from "@/components/dashboard/incident-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function IncidentsPage() {
  const { orgId } = await requireAuth();
  const incidentsList = await getIncidents(orgId);

  return (
    <div>
      <Topbar title="Incidents">
        <Link href="/incidents/new">
          <Button className="bg-accent-primary hover:bg-accent-primary-hover text-bg-primary">
            <Plus className="mr-2 h-4 w-4" /> Report Incident
          </Button>
        </Link>
      </Topbar>
      <div className="p-6 space-y-4">
        {incidentsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-text-secondary text-lg">No incidents</p>
            <p className="text-text-tertiary text-sm mt-1">All systems are running smoothly</p>
          </div>
        ) : (
          incidentsList.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))
        )}
      </div>
    </div>
  );
}
