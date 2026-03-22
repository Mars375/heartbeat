import { requireAuth } from "@/lib/auth";
import { getStatusPages } from "@/lib/db/queries";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function StatusPagesPage() {
  const { orgId } = await requireAuth();
  const pages = await getStatusPages(orgId);

  return (
    <div>
      <Topbar title="Status Pages" />
      <div className="p-6 space-y-4">
        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Globe className="h-12 w-12 text-text-tertiary mb-4" />
            <p className="text-text-secondary text-lg">No status pages yet</p>
            <p className="text-text-tertiary text-sm mt-1">Create a public status page for your users</p>
          </div>
        ) : (
          pages.map((page) => (
            <Link key={page.id} href={`/status-pages/${page.id}`}>
              <Card className="border-border-default bg-bg-surface-1 transition-colors hover:border-border-strong">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-text-primary">{page.name}</h3>
                    <p className="text-xs text-text-secondary font-mono">/s/{page.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {page.isPublic ? (
                      <Badge variant="outline" className="bg-positive/15 text-positive border-positive/30">Public</Badge>
                    ) : (
                      <Badge variant="outline" className="text-text-secondary">Private</Badge>
                    )}
                    <ExternalLink className="h-4 w-4 text-text-tertiary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
