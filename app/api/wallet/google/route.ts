import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "not_configured",
      message:
        "Google Wallet est prévu en V2. Configurez un issuer account, un service account Google Cloud et l’API Google Wallet."
    },
    { status: 501 }
  );
}
