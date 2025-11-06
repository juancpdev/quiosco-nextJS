"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneVerification from "./PhoneVerification";
import { toast } from "react-toastify";

interface FormData {
  name: string;
  address?: string;
  table?: string;
  note?: string;
}

export default function OrderModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [orderType, setOrderType] = useState<"local" | "delivery" | "">(""); 
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phone, setPhone] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
  });

  const handleClose = () => {
    // ✅ Solo resetea el formulario y el tipo de pedido
    // NO resetea phone ni isPhoneVerified

    onClose();
  };

  // ✅ Nueva función para limpiar el teléfono (se pasa a PhoneVerification)
  const handleClearPhone = () => {
    setPhone("");
    setIsPhoneVerified(false);
  };

  const onSubmit = () => {
    if (!isPhoneVerified) {
      toast.error("Verifica tu teléfono antes de confirmar el pedido", {
        toastId: "verify-phone-error",
      });
      return;
    }

    toast.success("Pedido confirmado correctamente ", {
      toastId: "pedido-confirmado",
    });

    // ✅ Al confirmar, limpia TODO incluyendo el teléfono
    reset();
    setOrderType("");
    setPhone("");
    setIsPhoneVerified(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-lg relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center mb-4">
              Confirmar pedido
            </h2>

            {/* Selector tipo de pedido */}
            <div className="flex justify-center mb-6">
              <div>
                <button
                  onClick={() => setOrderType("local")}
                  className={`px-4 py-2 rounded-tl-lg rounded-bl-lg font-semibold cursor-pointer ${
                    orderType === "local"
                      ? "bg-orange-400 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Local
                </button>
                <button
                  onClick={() => setOrderType("delivery")}
                  className={`px-4 py-2 rounded-tr-lg rounded-br-lg font-semibold cursor-pointer ${
                    orderType === "delivery"
                      ? "bg-orange-400 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Delivery
                </button>
              </div>
            </div>

            {/* FORMULARIO DELIVERY */}
            {orderType === "delivery" && (
              <motion.form
                className="space-y-3"
                onSubmit={handleSubmit(onSubmit)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <input
                  type="text"
                  placeholder="Nombre y Apellido"
                  {...register("name", { required: true })}
                  className="w-full rounded-lg p-2 border-2 border-gray-100 bg-gray-100 focus:outline-none focus:border-orange-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">
                    Este campo es obligatorio
                  </p>
                )}

                <input
                  type="text"
                  placeholder="Dirección"
                  {...register("address", { required: true })}
                  className="w-full rounded-lg p-2 border-2 border-gray-100 bg-gray-100 focus:outline-none focus:border-orange-500"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    Este campo es obligatorio
                  </p>
                )}

                <PhoneVerification
                  phone={phone}
                  setPhone={setPhone}
                  isVerified={isPhoneVerified}
                  setIsVerified={setIsPhoneVerified}
                  onClearPhone={handleClearPhone}
                />

                <textarea
                  placeholder="Nota"
                  {...register("note")}
                  className="resize-none w-full rounded-lg p-2 border-2 border-gray-100 bg-gray-100 focus:outline-none focus:border-orange-500"
                ></textarea>

                <button
                  type="submit"
                  disabled={!isValid || !isPhoneVerified}
                  className={`w-full py-2 rounded-lg font-bold text-white transition ${
                    !isValid || !isPhoneVerified
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-orange-400 hover:bg-orange-500 cursor-pointer"
                  }`}
                >
                  Confirmar pedido
                </button>
              </motion.form>
            )}

            {/* FORMULARIO LOCAL */}
            {orderType === "local" && (
              <motion.form
                className="space-y-3"
                onSubmit={handleSubmit(onSubmit)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <input
                  type="text"
                  placeholder="Nombre y Apellido"
                  {...register("name", { required: true })}
                  className="w-full rounded-lg p-2 border-2 border-gray-100 bg-gray-100 focus:outline-none focus:border-orange-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">
                    Este campo es obligatorio
                  </p>
                )}

                <select
                  {...register("table", { required: true })}
                  className="cursor-pointer w-full rounded-lg p-2 border-2 border-gray-100 bg-gray-100 focus:outline-none focus:border-orange-500"
                  defaultValue=""
                >
                  <option value="" disabled hidden>
                    Elige una mesa
                  </option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      Mesa {n}
                    </option>
                  ))}
                </select>
                {errors.table && (
                  <p className="text-red-500 text-sm">
                    Debes seleccionar una mesa
                  </p>
                )}

                <PhoneVerification
                  phone={phone}
                  setPhone={setPhone}
                  isVerified={isPhoneVerified}
                  setIsVerified={setIsPhoneVerified}
                  onClearPhone={handleClearPhone}
                />

                <textarea
                  placeholder="Nota"
                  {...register("note")}
                  className="resize-none w-full rounded-lg p-2 border-2 border-gray-100 bg-gray-100 focus:outline-none focus:border-orange-500"
                ></textarea>

                <button
                  type="submit"
                  disabled={!isValid || !isPhoneVerified}
                  className={`w-full py-2 rounded-lg font-bold text-white transition ${
                    !isValid || !isPhoneVerified
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-orange-400 hover:bg-orange-500 cursor-pointer"
                  }`}
                >
                  Confirmar pedido
                </button>
              </motion.form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}