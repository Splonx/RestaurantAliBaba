import TestimonialManager from "@/components/admin/TestimonialManager";
import PageHeader from "@/components/admin/PageHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
  });

  return (
    <>
      <PageHeader
        title="Avis clients"
        text="Ajoutez, modifiez, supprimez et mettez en avant les avis visibles sur la page d’accueil."
      />
      <TestimonialManager
        testimonials={testimonials.map((testimonial) => ({
          id: testimonial.id,
          author: testimonial.author,
          quote: testimonial.quote,
          context: testimonial.context,
          isFeatured: testimonial.isFeatured,
          isActive: testimonial.isActive,
          sortOrder: testimonial.sortOrder
        }))}
      />
    </>
  );
}
