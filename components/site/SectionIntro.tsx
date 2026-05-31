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
      <p className={`eyebrow ${light ? "!text-sand" : ""}`}>{eyebrow}</p>
      <h2
        className={`mt-3 font-display text-5xl font-semibold leading-[0.92] sm:text-6xl ${
          light ? "text-cream" : "text-coffee"
        }`}
      >
        {title}
      </h2>
      {text ? (
        <p className={`mt-5 text-base leading-8 sm:text-lg ${light ? "text-cream/75" : "text-coffee/72"}`}>
          {text}
        </p>
      ) : null}
    </Reveal>
  );
}
