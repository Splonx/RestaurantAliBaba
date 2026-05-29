"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginAction } from "@/app/admin/actions";

const loginSchema = z.object({
  username: z.string().min(1, "Utilisateur requis"),
  password: z.string().min(1, "Mot de passe requis")
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {
    ok: true,
    message: ""
  });
  const {
    register,
    formState: { errors }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema)
  });

  return (
    <form action={formAction} className="rounded-lg bg-cream p-6 shadow-soft sm:p-8">
      <div className="mb-8 grid h-13 w-13 place-items-center rounded-lg bg-terracotta text-cream">
        <LockKeyhole size={24} aria-hidden />
      </div>
      <h1 className="font-display text-4xl font-semibold text-coffee">Administration</h1>
      <p className="mt-3 text-sm leading-7 text-coffee/65">
        Connectez-vous avec les identifiants configurés dans les variables d’environnement.
      </p>

      {!state.ok ? (
        <div className="mt-5 rounded-lg border border-terracotta/20 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          {state.message}
        </div>
      ) : null}

      <label className="mt-6 block">
        <span className="text-sm font-semibold text-coffee">Utilisateur</span>
        <input
          {...register("username")}
          name="username"
          className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 bg-white px-4 py-3 outline-none"
          autoComplete="username"
        />
        {errors.username ? (
          <span className="mt-1 block text-xs text-terracotta">{errors.username.message}</span>
        ) : null}
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-coffee">Mot de passe</span>
        <input
          {...register("password")}
          name="password"
          type="password"
          className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 bg-white px-4 py-3 outline-none"
          autoComplete="current-password"
        />
        {errors.password ? (
          <span className="mt-1 block text-xs text-terracotta">{errors.password.message}</span>
        ) : null}
      </label>

      <button
        type="submit"
        disabled={pending}
        className="focus-ring mt-6 inline-flex w-full items-center justify-center rounded-lg bg-coffee px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-terracotta disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
