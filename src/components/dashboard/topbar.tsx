import { UserButton } from "@clerk/nextjs";

interface TopbarProps {
  title: string;
  children?: React.ReactNode;
}

export function Topbar({ title, children }: TopbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border-default px-6">
      <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
      <div className="flex items-center gap-4">
        {children}
        <UserButton />
      </div>
    </header>
  );
}
