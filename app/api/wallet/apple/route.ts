import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "not_configured",
      message:
        "Apple Wallet est prévu en V2. Configurez Apple Developer Program, Pass Type ID et certificat de signature .pkpass."
    },
    { status: 501 }
  );
}
