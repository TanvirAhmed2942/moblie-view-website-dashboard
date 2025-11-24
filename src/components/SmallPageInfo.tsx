interface SmallPageInfoProps {
  title: string;
  description: string;
}

export default function SmallPageInfo({
  title,
  description,
}: SmallPageInfoProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
