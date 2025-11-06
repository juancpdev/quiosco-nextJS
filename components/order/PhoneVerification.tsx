"use client";
import { useState } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { TrashIcon } from "@heroicons/react/16/solid";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

type PhoneVerificationProp = {
  phone: string;
  setPhone: (value: string) => void;
  isVerified: boolean;
  setIsVerified: (value: boolean) => void;
  onClearPhone: () => void; // ✅ Nueva prop
};

export default function PhoneVerification({
  phone,
  setPhone,
  isVerified,
  setIsVerified,
  onClearPhone,
}: PhoneVerificationProp) {
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA verificado");
          },
        }
      );
    }
  };

  const sendCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!phone) {
      if (!toast.isActive("enter-number-error")) {
        toast.error("Por favor ingresa un número de teléfono", {
          toastId: "enter-number-error",
        });
      }
      return;
    }

    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      setLoading(true);
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      if (!toast.isActive("sms-enviado")) {
        toast.success("SMS enviado, revisa tu teléfono", {
          toastId: "sms-enviado",
        });
      }
    } catch (err) {
      console.error(err);
      if (!toast.isActive("sms-error")) {
        toast.error(
          "Error al enviar SMS. Revisa el número e intenta de nuevo.",
          {
            toastId: "sms-error",
          }
        );
      }
      setPhone("");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (!code) {
      if (!toast.isActive("code-error")) {
        toast.error("Por favor ingresa el código recibido.", {
          toastId: "code-error",
        });
      }
      return;
    }

    if (!confirmationResult) return;

    try {
      setLoading(true);
      await confirmationResult.confirm(code);
      if (!toast.isActive("phone-verify")) {
        toast.success("Teléfono verificado correctamente", {
          toastId: "phone-verify",
        });
      }
      // ✅ Limpia el estado local después de verificar
      setConfirmationResult(null);
      setCode("");
      setIsVerified(true);
    } catch (err) {
      console.error(err);
      if (!toast.isActive("error-code")) {
        setCode("");
        toast.error("Código incorrecto. Intenta nuevamente.", {
          toastId: "error-code",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhone = () => {
    // ✅ Limpia el estado local
    setCode("");
    setConfirmationResult(null);
    
    // ✅ Llama a la función del padre para limpiar phone e isVerified
    onClearPhone();
    
    toast.info("Teléfono eliminado", {
      toastId: "phone-deleted",
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex w-full relative">
        <input
          type="tel"
          placeholder="Teléfono +376..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={`w-full rounded-lg p-2 bg-gray-100 focus:outline-none flex-2 ${
            isVerified
              ? "border-2 border-green-500 bg-green-100 text-black cursor-not-allowed"
              : "border-2 border-gray-100 focus:border-orange-500"
          }`}
          disabled={isVerified || !!confirmationResult}
        />

        {/* ✅ Botón trash visible cuando está verificado O cuando hay confirmationResult */}
        {(confirmationResult || isVerified) && (
          <button
            onClick={handleDeletePhone}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-600 cursor-pointer"
            title="Borrar teléfono"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}

        {/* Botón de enviar código (solo si no está verificado ni en proceso) */}
        {!isVerified && !confirmationResult && (
          <button
            onClick={sendCode}
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

      {/* Campo para ingresar el código (solo si se envió el SMS y aún no está verificado) */}
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
            className={`w-full flex-2 py-2 rounded-lg font-bold text-white cursor-pointer ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={loading}
          >
            {loading ? "Verificando..." : "Confirmar código"}
          </button>
        </div>
      )}

      {/* Contenedor del reCAPTCHA */}
      <div id="recaptcha-container"></div>
    </div>
  );
}