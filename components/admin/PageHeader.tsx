type PageHeaderProps = {
  title: string;
  text: string;
  action?: React.ReactNode;
};

export default function PageHeader({ title, text, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="eyebrow">Back-office</p>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-coffee sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-coffee/65">{text}</p>
      </div>
      {action}
    </div>
  );
}
