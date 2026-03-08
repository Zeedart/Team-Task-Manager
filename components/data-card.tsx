export function DataCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-10">
        <h3 className="text-xl text-center font-semibold">{title}</h3>
        <p className="text-4xl text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold">{value}</p>
      </div>
    </div>
  );
}
