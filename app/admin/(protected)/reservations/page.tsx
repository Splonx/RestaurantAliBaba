import ReservationManager from "@/components/admin/ReservationManager";
import PageHeader from "@/components/admin/PageHeader";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminReservationsPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: [{ createdAt: "desc" }]
  });

  return (
    <>
      <PageHeader
        title="Réservations"
        text="Suivez les demandes de table, les statuts et les notes internes depuis le back-office."
      />
      <ReservationManager
        reservations={reservations.map((reservation) => ({
          id: reservation.id,
          name: reservation.name,
          phone: reservation.phone,
          date: reservation.date,
          time: reservation.time,
          guests: reservation.guests,
          message: reservation.message,
          status: reservation.status,
          notes: reservation.notes,
          createdAt: formatDateTime(reservation.createdAt)
        }))}
      />
    </>
  );
}
