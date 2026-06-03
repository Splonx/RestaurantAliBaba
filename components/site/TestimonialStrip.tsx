import { Quote } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import SectionIntro from "@/components/site/SectionIntro";

type TestimonialItem = {
  id: string;
  author: string;
  quote: string;
  context: string | null;
};

export default function TestimonialStrip({ testimonials }: { testimonials: TestimonialItem[] }) {
  return (
    <section className="bg-ivory py-24 sm:py-28">
      <div className="section-shell">
        <SectionIntro
          eyebrow="Avis clients"
          title="La chaleur d’une adresse se lit aussi dans les retours"
          text="Les avis affichés ici sont administrables : l’équipe peut choisir ceux qui reflètent le mieux l’expérience Ali Baba."
          align="center"
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <Reveal
              key={testimonial.id}
              delay={index * 0.04}
              className="rounded-lg border border-coffee/10 bg-cream p-6 shadow-soft"
            >
              <Quote size={26} className="text-copper" aria-hidden />
              <p className="mt-5 text-lg leading-8 text-coffee/82">{testimonial.quote}</p>
              <div className="mt-6 border-t border-coffee/10 pt-4">
                <p className="font-display text-2xl font-semibold text-coffee">
                  {testimonial.author}
                </p>
                {testimonial.context ? (
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-olive">
                    {testimonial.context}
                  </p>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
