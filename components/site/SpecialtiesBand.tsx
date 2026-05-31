import { Fish, Flame, Martini, Soup, UtensilsCrossed } from "lucide-react";
import Reveal from "@/components/site/Reveal";

const signatures = [
  { label: "Entrées", icon: UtensilsCrossed },
  { label: "Poissons", icon: Fish },
  { label: "Grillades", icon: Flame },
  { label: "Cuisine marocaine", icon: Soup },
  { label: "Boissons", icon: Martini }
];

export default function SpecialtiesBand() {
  return (
    <section className="bg-[#10151e] py-16 text-cream">
      <div className="section-shell">
        <Reveal className="rounded-lg border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.16em] text-sand">
            ADN culinaire
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {signatures.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm font-semibold text-cream/90"
                >
                  <Icon size={16} className="text-sand" aria-hidden />
                  {item.label}
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
