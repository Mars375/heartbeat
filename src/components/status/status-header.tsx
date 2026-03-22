import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatusLabel } from "@/lib/utils";

interface StatusHeaderProps {
  name: string;
  logoUrl?: string | null;
  brandingColor: string;
  overallStatus: "operational" | "degraded" | "down" | "maintenance" | "unknown";
}

export function StatusHeader({ name, logoUrl, brandingColor, overallStatus }: StatusHeaderProps) {
  const label = getStatusLabel(overallStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {logoUrl ? (
          <img src={logoUrl} alt={name} className="h-8" />
        ) : (
          <Heart className="h-6 w-6" style={{ color: brandingColor }} fill="currentColor" />
        )}
        <h1 className="text-2xl font-bold text-text-primary">{name}</h1>
      </div>
      <div
        className={cn(
          "rounded-xl p-4 text-center text-lg font-semibold",
          overallStatus === "operational" && "bg-positive/10 text-positive",
          overallStatus === "degraded" && "bg-warning/10 text-warning",
          overallStatus === "down" && "bg-negative/10 text-negative",
          overallStatus === "maintenance" && "bg-info/10 text-info",
          overallStatus === "unknown" && "bg-text-secondary/10 text-text-secondary"
        )}
      >
        {label}
      </div>
    </div>
  );
}
