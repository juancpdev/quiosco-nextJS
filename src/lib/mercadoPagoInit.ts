// lib/mercadoPagoInit.ts
"use client";

import { initMercadoPago } from "@mercadopago/sdk-react";

export const initializeMercadoPago = () => {
  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

  if (!publicKey) {
    console.error("❌ Falta la variable NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY en tu .env.local");
    return;
  }

  initMercadoPago(publicKey, { locale: "es-AR" });
};
