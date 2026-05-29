import Reveal from "@/components/site/Reveal";

export default function SectionIntro({
  eyebrow,
  title,
  text,
  align = "left",
  light = false
}: {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2
        className={`mt-3 font-display text-5xl font-semibold leading-[0.98] sm:text-6xl ${
          light ? "text-cream" : "text-coffee"
        }`}
      >
        {title}
      </h2>
      {text ? (
        <p className={`mt-5 text-base leading-8 sm:text-lg ${light ? "text-cream/70" : "text-coffee/70"}`}>
          {text}
        </p>
      ) : null}
    </Reveal>
  );
}
