interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  underlineClassName?: string;
}

export function SectionHeader({ title, subtitle, underlineClassName }: SectionHeaderProps) {
  return (
    <header className="flex flex-col items-center text-center">
      <h1 className="text-pretty text-3xl md:text-4xl">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-gray-600 text-lg">{subtitle}</p>
      )}
      <span
        aria-hidden="true"
        className={`mt-3 h-0.5 w-10 rounded ${
          underlineClassName || "bg-teal-500"
        }`}
      />
    </header>
  )
}