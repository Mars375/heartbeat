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
        <h1 className="font-headline text-2xl text-[#ededef] tracking-tight">{name}</h1>
      </div>
      <div
        className={cn(
          "rounded-sm p-4 text-center text-sm font-body font-semibold tracking-widest uppercase border",
          overallStatus === "operational" && "bg-positive/8 text-positive border-positive/20",
          overallStatus === "degraded" && "bg-warning/8 text-warning border-warning/20",
          overallStatus === "down" && "bg-negative/8 text-negative border-negative/20",
          overallStatus === "maintenance" && "bg-info/8 text-info border-info/20",
          overallStatus === "unknown" && "bg-[#353534]/30 text-[#9a9895] border-[#353534]/40"
        )}
      >
        {label}
      </div>
    </div>
  );
}
