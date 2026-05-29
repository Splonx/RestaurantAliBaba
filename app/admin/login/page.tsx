import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getAdminSession } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin/dashboard");

  return (
    <main className="moroccan-pattern grid min-h-screen place-items-center bg-ivory px-5 py-12 text-coffee">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
