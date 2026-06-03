"use client";

import { Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteAdminUserAction, saveAdminUserAction } from "@/app/admin/actions";
import Toast, { type ToastState } from "@/components/admin/Toast";

type AdminUserRow = {
  id: string;
  email: string;
  name: string;
  role: "Admin" | "Manager";
  isActive: boolean;
};

const empty: AdminUserRow = {
  id: "",
  email: "",
  name: "",
  role: "Manager",
  isActive: true
};

export default function UserManager({ users }: { users: AdminUserRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminUserRow>(empty);
  const [toast, setToast] = useState<ToastState>(null);
  const [pending, startTransition] = useTransition();

  function submit(formData: FormData) {
    startTransition(async () => {
      const result = await saveAdminUserAction(formData);
      setToast(result);
      if (result.ok) {
        setEditing(empty);
        router.refresh();
      }
    });
  }

  function remove(id: string) {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    startTransition(async () => {
      const result = await deleteAdminUserAction(id);
      setToast(result);
      if (result.ok) router.refresh();
    });
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <form key={editing.id || "new"} action={submit} className="rounded-lg bg-cream p-6 shadow-admin">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold text-coffee">{editing.id ? "Modifier" : "Ajouter"} un accès</h2>
            <button type="button" onClick={() => setEditing(empty)} className="focus-ring inline-flex items-center gap-2 rounded-lg border border-coffee/10 px-3 py-2 text-sm font-semibold">
              <Plus size={16} aria-hidden />
              Nouveau
            </button>
          </div>
          <input type="hidden" name="id" value={editing.id} />
          <Field name="name" label="Nom" value={editing.name} />
          <Field name="email" label="Email" value={editing.email} type="email" />
          <label className="mt-4 block">
            <span className="text-sm font-semibold">Rôle</span>
            <select name="role" defaultValue={editing.role} className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none">
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
            </select>
          </label>
          <label className="mt-4 flex items-center gap-3 text-sm font-semibold">
            <input name="isActive" type="checkbox" defaultChecked={editing.isActive} className="h-4 w-4 accent-terracotta" />
            Actif
          </label>
          <button disabled={pending} className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-coffee px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream">
            <Save size={17} aria-hidden />
            Enregistrer
          </button>
        </form>

        <div className="overflow-hidden rounded-lg bg-cream shadow-admin">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-coffee text-cream">
              <tr>
                <th className="px-5 py-4">Utilisateur</th>
                <th className="px-5 py-4">Rôle</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-coffee/10 last:border-0">
                  <td className="px-5 py-4"><strong>{user.name}</strong><br /><span className="text-coffee/55">{user.email}</span></td>
                  <td className="px-5 py-4">{user.role}</td>
                  <td className="px-5 py-4">{user.isActive ? "Actif" : "Inactif"}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setEditing(user)} className="focus-ring rounded-lg border border-coffee/10 px-3 py-2 font-semibold">Modifier</button>
                      <button type="button" onClick={() => remove(user.id)} className="focus-ring rounded-lg border border-terracotta/20 px-3 py-2 text-terracotta">
                        <Trash2 size={16} aria-hidden />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Field({ name, label, value, type = "text" }: { name: string; label: string; value: string; type?: string }) {
  return (
    <label className="mt-4 block first:mt-0">
      <span className="text-sm font-semibold">{label}</span>
      <input name={name} defaultValue={value} type={type} className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" />
    </label>
  );
}
