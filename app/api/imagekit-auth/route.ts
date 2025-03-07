import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function GET() {
  try {
    const imagekitAuthParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(imagekitAuthParameters);
  } catch (error) {
    return NextResponse.json(
      { error: "imagekit auth failed" },
      { status: 500 }
    );
  }
}
