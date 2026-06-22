"use client";

import { useEffect } from "react";

const STORAGE_KEY = "ali_baba_loyalty_public_token";
const COOKIE_NAME = "ali_baba_loyalty_public_token";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export default function LoyaltyCardMemory({ publicToken }: { publicToken: string }) {
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, publicToken);
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(publicToken)}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax; Secure`;
  }, [publicToken]);

  return null;
}
