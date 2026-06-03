import UserManager from "@/components/admin/UserManager";
import PageHeader from "@/components/admin/PageHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.adminUser.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }]
  });

  return (
    <>
      <PageHeader
        title="Utilisateurs"
        text="Architecture prête pour les rôles Admin et Manager. L’authentification principale reste pilotée par ADMIN_EMAIL et ADMIN_PASSWORD."
      />
      <UserManager
        users={users.map((user) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as "Admin" | "Manager",
          isActive: user.isActive
        }))}
      />
    </>
  );
}
