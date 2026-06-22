"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "ali_baba_loyalty_public_token";
const COOKIE_NAME = "ali_baba_loyalty_public_token";

function isStandaloneMode() {
  const standaloneNavigator = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    standaloneNavigator.standalone === true
  );
}

function tokenFromCookie() {
  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${COOKIE_NAME}=`));
  if (!cookie) return "";
  return decodeURIComponent(cookie.split("=").slice(1).join("="));
}

function savedToken() {
  return window.localStorage.getItem(STORAGE_KEY) ?? tokenFromCookie();
}

export default function LoyaltyHomeRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = savedToken();
    if (!storedToken) return;

    setToken(storedToken);
    if (isStandaloneMode() || searchParams.get("source") === "pwa") {
      router.replace(`/fidelite/${storedToken}`);
    }
  }, [router, searchParams]);

  if (!token) return null;

  return (
    <div className="mb-4 rounded-lg border border-olive/20 bg-olive/10 p-4 text-sm text-olive">
      <p className="font-semibold">Une carte fidélité existe déjà sur ce téléphone.</p>
      <a href={`/fidelite/${token}`} className="mt-2 inline-block font-bold underline">
        Ouvrir ma carte QR
      </a>
    </div>
  );
}
