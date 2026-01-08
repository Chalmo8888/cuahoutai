interface AdminHeaderProps {
  title: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-6">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
    </header>
  );
}
