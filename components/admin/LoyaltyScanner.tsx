"use client";

import jsQR from "jsqr";
import { Camera, Search, XCircle } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { scanLookupLoyaltyCardAction } from "@/app/admin/actions";

const initialState = {
  ok: false,
  message: ""
};

function extractToken(value: string) {
  const trimmed = value.trim();
  try {
    const url = new URL(trimmed);
    const segments = url.pathname.split("/").filter(Boolean);
    return segments.at(-1) ?? trimmed;
  } catch {
    return trimmed;
  }
}

export default function LoyaltyScanner({ targetPath = "/admin/fidelite/scan" }: { targetPath?: string }) {
  const [state, formAction] = useActionState(
    async (_previousState: typeof initialState, formData: FormData) =>
      scanLookupLoyaltyCardAction(formData),
    initialState
  );
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!active) return undefined;
    let frameId = 0;
    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false
        });
        streamRef.current = stream;
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        scan();
      } catch {
        setCameraError("Caméra indisponible. Utilisez la saisie manuelle.");
        setActive(false);
      }
    }

    function scan() {
      if (cancelled || !videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", { willReadFrequently: true });

      if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code?.data) {
          setQuery(extractToken(code.data));
          setActive(false);
          return;
        }
      }

      frameId = window.requestAnimationFrame(scan);
    }

    start();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [active]);

  return (
    <div className="rounded-lg bg-cream p-5 shadow-admin">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Scanner mobile</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-coffee">
            Scanner une carte
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setCameraError("");
            setActive((current) => !current);
          }}
          className="focus-ring inline-flex items-center gap-2 rounded-lg bg-coffee px-4 py-3 text-sm font-bold text-cream"
        >
          {active ? <XCircle size={17} aria-hidden /> : <Camera size={17} aria-hidden />}
          {active ? "Arrêter" : "Ouvrir caméra"}
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg bg-coffee">
        {active ? (
          <video ref={videoRef} className="aspect-video w-full object-cover" muted playsInline />
        ) : (
          <div className="grid aspect-video place-items-center px-6 text-center text-sm leading-6 text-cream/65">
            Ouvrez la caméra ou saisissez un token/téléphone.
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {cameraError ? (
        <p className="mt-3 rounded-lg bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          {cameraError}
        </p>
      ) : null}

      <form action={formAction} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input type="hidden" name="targetPath" value={targetPath} />
        <input
          name="query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Token public ou téléphone"
          className="focus-ring rounded-lg border border-coffee/10 bg-white px-4 py-3 text-sm outline-none"
        />
        <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-terracotta px-5 py-3 text-sm font-bold text-cream">
          <Search size={17} aria-hidden />
          Charger fiche
        </button>
      </form>

      {state.message ? (
        <p className="mt-3 rounded-lg bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
