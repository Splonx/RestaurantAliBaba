"use client";

import { Ban, Check, Minus, RefreshCw, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState, useTransition } from "react";
import {
  addLoyaltyStampAction,
  removeLoyaltyStampAction,
  toggleLoyaltyCardStatusAction,
  useLoyaltyRewardAction
} from "@/app/admin/actions";
import Toast, { type ToastState } from "@/components/admin/Toast";

type RewardRow = {
  id: string;
  type: string;
  status: string;
};

type LoyaltyActionPanelProps = {
  customerId: string;
  status: string;
  rewards: RewardRow[];
  compact?: boolean;
};

export default function LoyaltyActionPanel({
  customerId,
  status,
  rewards,
  compact = false
}: LoyaltyActionPanelProps) {
  const router = useRouter();
  const [toast, setToast] = useState<ToastState>(null);
  const [pending, startTransition] = useTransition();
  const availableRewards = rewards.filter((reward) => reward.status === "AVAILABLE");

  function run(action: (formData: FormData) => Promise<{ ok: boolean; message: string }>, formData: FormData) {
    startTransition(async () => {
      const result = await action(formData);
      setToast(result);
      if (result.ok) router.refresh();
    });
  }

  function submitStamp(formData: FormData) {
    if (!confirm("Valider cet achat fidélité ?")) return;
    run(addLoyaltyStampAction, formData);
  }

  function submitReward(formData: FormData) {
    if (!confirm("Utiliser cette récompense maintenant ?")) return;
    run(useLoyaltyRewardAction, formData);
  }

  function submitRemove(formData: FormData) {
    if (!confirm("Retirer un tampon avec traçabilité ?")) return;
    run(removeLoyaltyStampAction, formData);
  }

  function submitStatus(formData: FormData) {
    run(toggleLoyaltyCardStatusAction, formData);
  }

  return (
    <div className={compact ? "space-y-3" : "rounded-lg bg-cream p-5 shadow-admin"}>
      <Toast toast={toast} onClose={() => setToast(null)} />
      {!compact ? (
        <div>
          <p className="eyebrow">Actions staff</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-coffee">Modification tracée</h2>
        </div>
      ) : null}

      <div className="mt-4 grid gap-3">
        <ActionForm
          action={submitStamp}
          customerId={customerId}
          pending={pending}
          label="Valider un achat"
          icon={<Check size={17} aria-hidden />}
          buttonClass="bg-olive text-cream"
          notePlaceholder="Ex: Table 8, addition validée"
        />

        {availableRewards.map((reward) => (
          <ActionForm
            key={reward.id}
            action={submitReward}
            customerId={customerId}
            pending={pending}
            label={reward.type === "DISCOUNT_50" ? "Utiliser -50%" : "Utiliser -25%"}
            icon={<ShieldCheck size={17} aria-hidden />}
            buttonClass="bg-terracotta text-cream"
            notePlaceholder="Ex: Réduction appliquée sur commande"
            hidden={{ rewardType: reward.type }}
          />
        ))}

        <ActionForm
          action={submitRemove}
          customerId={customerId}
          pending={pending}
          label="Retirer un tampon"
          icon={<Minus size={17} aria-hidden />}
          buttonClass="border border-coffee/15 bg-white text-coffee"
          notePlaceholder="Note obligatoire"
        />

        <ActionForm
          action={submitStatus}
          customerId={customerId}
          pending={pending}
          label={status === "ACTIVE" ? "Bloquer la carte" : "Débloquer la carte"}
          icon={status === "ACTIVE" ? <Ban size={17} aria-hidden /> : <RefreshCw size={17} aria-hidden />}
          buttonClass="border border-terracotta/20 bg-white text-terracotta"
          notePlaceholder="Motif obligatoire"
          hidden={{ mode: status === "ACTIVE" ? "block" : "unblock" }}
        />
      </div>
    </div>
  );
}

function ActionForm({
  action,
  customerId,
  pending,
  label,
  icon,
  buttonClass,
  notePlaceholder,
  hidden = {}
}: {
  action: (formData: FormData) => void;
  customerId: string;
  pending: boolean;
  label: string;
  icon: ReactNode;
  buttonClass: string;
  notePlaceholder: string;
  hidden?: Record<string, string>;
}) {
  return (
    <form action={action} className="grid gap-2 rounded-lg border border-coffee/10 bg-white/60 p-3">
      <input type="hidden" name="customerId" value={customerId} />
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <input
        name="note"
        required
        placeholder={notePlaceholder}
        className="focus-ring rounded-lg border border-coffee/10 bg-white px-3 py-2 text-sm outline-none"
      />
      <button
        disabled={pending}
        className={`focus-ring inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold ${buttonClass} disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {icon}
        {label}
      </button>
    </form>
  );
}
