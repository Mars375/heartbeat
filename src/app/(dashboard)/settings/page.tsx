import { requireAuth } from "@/lib/auth";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@clerk/nextjs";
import { ApiKeyManager } from "@/components/dashboard/api-key-manager";

export default async function SettingsPage() {
  const { orgId } = await requireAuth();

  return (
    <div>
      <Topbar title="Settings" />
      <div className="p-6 space-y-6 max-w-4xl">
        <Card className="border-border-default bg-bg-surface-1">
          <CardHeader><CardTitle className="text-text-primary">Profile</CardTitle></CardHeader>
          <CardContent>
            <UserProfile
              appearance={{
                variables: {
                  colorBackground: "#111113",
                  colorText: "#EDEDEF",
                  colorInputBackground: "#1A1A1D",
                  colorInputText: "#EDEDEF",
                  colorPrimary: "#10B981",
                },
              }}
            />
          </CardContent>
        </Card>

        <ApiKeyManager keys={[]} />
      </div>
    </div>
  );
}
