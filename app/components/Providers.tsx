"use client";
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

import { ImageKitProvider } from "imagekitio-next";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./Notification";

export default function Providers({ children }: { children: React.ReactNode }) {
  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit-auth");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      console.log("imagekit auth filed: ", error);
      throw new Error(`Image kit Authentication request failed`);
    }
  };

  return (
    <SessionProvider>
      <NotificationProvider>
        <ImageKitProvider
          urlEndpoint={urlEndpoint}
          publicKey={publicKey}
          authenticator={authenticator}
        >
          {children}
          {/* ...client side upload component goes here */}
        </ImageKitProvider>
      </NotificationProvider>
    </SessionProvider>
  );
}
