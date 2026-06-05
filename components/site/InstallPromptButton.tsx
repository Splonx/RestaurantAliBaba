"use client";

import { Download, Share2, X } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function InstallPromptButton() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop">("desktop");

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    setPlatform(isIos ? "ios" : isAndroid ? "android" : "desktop");

    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  async function install() {
    if (!installEvent) {
      setInstructionsOpen(true);
      return;
    }

    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  return (
    <>
      <button
        type="button"
        onClick={install}
        className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg border border-coffee/15 bg-white px-4 py-3 text-sm font-bold text-coffee"
      >
        <Download size={17} aria-hidden />
        Ajouter à l’écran d’accueil
      </button>

      {instructionsOpen ? (
        <div className="fixed inset-0 z-[120] grid place-items-end bg-black/45 p-4 sm:place-items-center">
          <div className="w-full max-w-md rounded-lg bg-cream p-5 text-coffee shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Installation mobile</p>
                <h2 className="mt-2 font-display text-3xl font-semibold">
                  Ajouter la carte
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setInstructionsOpen(false)}
                className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-coffee/10 bg-white"
                aria-label="Fermer"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            <div className="mt-5 rounded-lg border border-coffee/10 bg-white p-4 text-sm leading-7 text-coffee/75">
              {platform === "ios" ? (
                <ol className="list-decimal space-y-2 pl-5">
                  <li>Ouvrez cette carte dans Safari.</li>
                  <li>
                    Touchez le bouton <Share2 className="mx-1 inline text-copper" size={16} aria-hidden /> Partager.
                  </li>
                  <li>Choisissez “Sur l’écran d’accueil”.</li>
                  <li>Validez avec “Ajouter”.</li>
                </ol>
              ) : platform === "android" ? (
                <ol className="list-decimal space-y-2 pl-5">
                  <li>Ouvrez cette carte dans Chrome.</li>
                  <li>Touchez le menu avec les trois points.</li>
                  <li>Choisissez “Ajouter à l’écran d’accueil” ou “Installer l’application”.</li>
                  <li>Validez avec “Ajouter”.</li>
                </ol>
              ) : (
                <p>
                  Sur téléphone, ouvrez cette carte dans Safari ou Chrome, puis utilisez le menu
                  du navigateur pour l’ajouter à l’écran d’accueil.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
