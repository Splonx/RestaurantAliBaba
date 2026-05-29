export default function EmptyState({
  title,
  text
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-coffee/10 bg-cream p-8 text-center">
      <p className="font-display text-3xl font-semibold text-coffee">{title}</p>
      <p className="mt-2 text-sm leading-7 text-coffee/60">{text}</p>
    </div>
  );
}
