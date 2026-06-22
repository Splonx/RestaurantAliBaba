import QRCode from "qrcode";
import PrintButton from "@/components/site/PrintButton";
import SiteChrome from "@/components/site/SiteChrome";
import { getSiteSettings } from "@/lib/settings";
import { getSiteUrl } from "@/lib/site-url";

export const metadata = {
  title: "QR Menu | Restaurant Ali Baba El Jadida",
  description: "QR code imprimable pour consulter le menu du Restaurant Ali Baba à El Jadida."
};

export default async function QrMenuPage() {
  const settings = await getSiteSettings();
  const menuUrl = `${getSiteUrl()}/menu`;
  const qrCode = await QRCode.toDataURL(menuUrl, {
    margin: 1,
    width: 420,
    color: {
      dark: "#2B1B15",
      light: "#F7F1E8"
    }
  });

  return (
    <SiteChrome settings={settings}>
      <main className="min-h-screen bg-[#F7F1E8] px-5 py-10 text-[#2B1B15] print:bg-white">
        <section className="mx-auto grid min-h-[72vh] max-w-2xl place-items-center rounded-lg border border-[#D6B98D] bg-[#F7F1E8] p-8 text-center shadow-soft print:border-[#2B1B15] print:shadow-none">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#B8793D]">
              Restaurant
            </p>
            <h1 className="mt-3 font-display text-6xl font-semibold leading-none">
              Ali Baba
            </h1>
            <p className="mx-auto mt-4 max-w-md text-lg leading-8 text-[#2B1B15]/70">
              Scannez pour consulter notre menu
            </p>
            <div className="mx-auto mt-8 w-fit rounded-lg bg-white p-5 shadow-soft print:shadow-none">
              <img src={qrCode} alt="QR code vers le menu Restaurant Ali Baba" className="h-72 w-72" />
            </div>
            <p className="mt-6 text-sm font-semibold text-[#4F5B3A]">{menuUrl}</p>
            <PrintButton />
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
