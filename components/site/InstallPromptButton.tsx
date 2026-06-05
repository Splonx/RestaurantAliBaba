"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function InstallPromptButton() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [hint, setHint] = useState("Ajouter à l’écran d’accueil");

  useEffect(() => {
    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  async function install() {
    if (!installEvent) {
      setHint("Menu du navigateur puis Ajouter à l’écran d’accueil");
      return;
    }

    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  return (
    <button
      type="button"
      onClick={install}
      className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg border border-coffee/15 bg-white px-4 py-3 text-sm font-bold text-coffee"
    >
      <Download size={17} aria-hidden />
      {hint}
    </button>
  );
}
