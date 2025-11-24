"use client";
import { useState, useEffect } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { TrashIcon } from "@heroicons/react/16/solid";

type PhoneVerificationProp = {
  phone: string;
  setPhone: (value: string) => void;
  isVerified: boolean;
  setIsVerified: (value: boolean) => void;
  onClearPhone: () => void;
  resetKey: number;
  onError: () => void; // ✅ CALLBACK para resetear desde el padre
};

export default function PhoneVerification({
  phone,
  setPhone,
  isVerified,
  setIsVerified,
  onClearPhone,
  resetKey, // ✅ NUEVA PROP
  onError, // ✅ CALLBACK
}: PhoneVerificationProp) {
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);

  // ✅ Limpia cuando cambia resetKey o se desmonta
  useEffect(() => {
    return () => {
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch (e) {}
      }
    };
  }, [resetKey, recaptchaVerifier]);

  const sendCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!phone) {
      toast.error("Por favor ingresa un número de teléfono");
      return;
    }

    try {
      setLoading(true);

      // ✅ Crea reCAPTCHA SOLO cuando se necesita
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });

      setRecaptchaVerifier(verifier);

      const result = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmationResult(result);

      toast.success("SMS enviado, revisa tu teléfono");
    } catch (err: any) {
      console.error(err);

      let errorMessage = "Error al enviar SMS";

      if (err.code === "auth/invalid-phone-number") {
        errorMessage = "Número inválido. Formato: +376XXXXXX";
      } else if (err.code === "auth/billing-not-enabled") {
        errorMessage = "Usa el número de prueba configurado";
      }

      toast.error(errorMessage);

      // ✅ Limpia y resetea desde el padre
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch (e) {}
      }
      setRecaptchaVerifier(null);
      setConfirmationResult(null);

      // ✅ CRÍTICO: Llama al callback para resetear el componente
      onError();
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e: any) => {
    e.preventDefault();

    if (!code) {
      toast.error("Ingresa el código");
      return;
    }

    if (!confirmationResult) return;

    try {
      setLoading(true);
      await confirmationResult.confirm(code);

      toast.success("Teléfono verificado");

      setConfirmationResult(null);
      setCode("");
      setIsVerified(true);

      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch (e) {}
      }

      await auth.signOut();
    } catch (err: any) {
      console.error(err);
      setCode("");
      toast.error("Código incorrecto");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhone = () => {
    setCode("");
    setConfirmationResult(null);

    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch (e) {}
    }

    onClearPhone();
    auth.signOut();
    toast.info("Teléfono eliminado");
  };

  return (
    <div className="flex flex-col">
      <div className="flex w-full relative">
        <input
          type="tel"
          placeholder="Teléfono +376..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              // Simula clic en el botón
              if (!isVerified && !confirmationResult && !loading) {
                sendCode(e as any); // reutiliza la misma función
              }
            }
          }}
          className={`w-full rounded-lg p-2 bg-gray-100 focus:outline-none flex-2 ${
            isVerified
              ? "border-2 border-green-500 bg-green-100 text-black cursor-not-allowed"
              : "border-2 border-gray-100 focus:border-orange-500"
          }`}
          disabled={isVerified || !!confirmationResult}
        />

        {(confirmationResult || isVerified) && (
          <button
            onClick={handleDeletePhone}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-600 cursor-pointer"
            type="button"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}

        {!isVerified && !confirmationResult && (
          <button
            onClick={sendCode}
            type="button"
            className={`w-full py-2 rounded-lg font-bold text-white cursor-pointer flex-1 ml-3 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar código"}
          </button>
        )}
      </div>

      {confirmationResult && !isVerified && (
        <div className="flex mt-3">
          <input
            type="text"
            placeholder="Código SMS"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full flex-3 mr-3 rounded-lg p-2 border-2 border-gray-100 bg-gray-100 focus:outline-none focus:border-orange-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                verifyCode(e);
              }
            }}
          />
          <button
            onClick={verifyCode}
            type="button"
            className={`w-full flex-2 py-2 rounded-lg font-bold text-white cursor-pointer ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={loading}
          >
            {loading ? "Verificando..." : "Confirmar"}
          </button>
        </div>
      )}

      <div id="recaptcha-container"></div>
    </div>
  );
}
