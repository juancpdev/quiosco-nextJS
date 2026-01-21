"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import PhoneVerification from "./PhoneVerification";
import { toast } from "react-toastify";
import MinimalCardPayment from "./MinimalCardPayment";
import { useStore } from "@/src/store";
import { createOrder } from "@/actions/order/create-order-actions";
import { OrderSchema } from "@/src/schema";
import { checkTableAvailability } from '@/actions/table/table-actions'
import TableSelector from "./TableSelector";

// Tipo para la información de pago con tarjeta
export interface CardPaymentData {
  paymentId?: string;
  status?: string;
  [key: string]: unknown;
}

export interface OrderFormData {
  name: string;
  phone?: string;
  address?: string;
  table?: number;
  deliveryType?: "local" | "delivery";
  paymentMethod?: "efectivo" | "tarjeta";
  note?: string;
  total?: number;
  order?: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
}


export default function OrderModal({
  isOpen,
  onClose,
  onCloseCart
}: {
  isOpen: boolean;
  onClose: () => void;
  onCloseCart: () => void;
}) {
  const [orderType, setOrderType] = useState<"local" | "delivery" | "">("");
  const [resetKey, setResetKey] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "tarjeta">("efectivo");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [formData, setFormData] = useState<OrderFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const {
  verifiedPhone: phone,
  isPhoneVerified,
  setVerifiedPhone: setPhone,
  setIsPhoneVerified,
  clearVerifiedPhone,
  order,
  clearOrder
} = useStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    getValues,
    watch, 
    setValue 
  } = useForm<OrderFormData>({
    mode: "onChange",
  });

  useEffect(() => {
    fetch("/api/verify-token")
      .then((res) => res.json())
      .then((data) => {
        setIsAdmin(data.valid);
        if (data.valid) {
          setIsPhoneVerified(true); 
        }
      });
  }, [setIsPhoneVerified]);

  const total = useMemo(
    () => order.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [order]
  );

  useEffect(() => {
    reset({
      name: "",
      address: "",
      table: undefined,
      note: "",
    });
  }, [orderType, reset]);
  
  // Función de envío del pedido
  const handleOrderConfirm = async (
    formValues: OrderFormData,
    paymentInfo?: CardPaymentData
  ) => {
    const data = {
      ...formValues,
      phone: isAdmin ? undefined : phone,
      paymentMethod,
      paymentInfo,
      deliveryType: orderType,
      order,
      total,
      isAdminOrder: isAdmin,
    };
    setIsLoading(true);
    const result = OrderSchema.safeParse(data);
    console.log(result);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      setIsLoading(false);
      return;
    }

    const response = await createOrder(data);
    if (response?.errors) {
      response.errors.forEach((issue) => toast.error(issue.message));
      setIsLoading(false);
      return;
    }

    toast.success('Pedido confirmado')
    clearOrder()
    setIsLoading(false);
    // Resetear todo

    reset();
    setOrderType("");
    setPaymentMethod("efectivo");
    setFormData(null);
    setShowPaymentModal(false);
    onClose();
    onCloseCart()
  };

  const handleClose = () => {
    reset();
    setOrderType("");
    setPaymentMethod("efectivo");
    setFormData(null);
    setShowPaymentModal(false);
    onClose();
  };

  const handleClearPhone = () => {
    clearVerifiedPhone();
    setResetKey((prev) => prev + 1);
  };

  const handlePhoneError = () => {
    setResetKey((prev) => prev + 1);
  };

  const handleButtonLocal = () => {
    setOrderType("local");
    setPaymentMethod("efectivo");
  };

const handleMainButton = async () => {
  if (!isPhoneVerified && !isAdmin) {
    toast.error("Verifica tu teléfono antes de confirmar el pedido");
    return;
  }

  const data = getValues();

  // ✨ VALIDACIÓN CON TELÉFONO
  if (orderType === 'local' && data.table) {
    const availability = await checkTableAvailability(data.table);
    
    if (!availability.available) {
      // Si es admin, permitir siempre
      if (isAdmin) {
        // Admin puede agregar a cualquier mesa
        console.log("Admin agregando pedido a mesa ocupada");
      } else {
        // Si es cliente, verificar que el teléfono coincida
        if (availability.phone !== phone) {
          toast.error(
            `La Mesa ${data.table} ya está ocupada por otro cliente. Verifica tu número de mesa.`
          );
          return;
        }
      }
    }
  }
  
  if (paymentMethod === "efectivo") {
    handleOrderConfirm(data);
  } else {
    setFormData(data);
    setShowPaymentModal(true);
  }
};

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-lg relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
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

            <div className="flex justify-center mb-6">
              <div>
                <button
                  type="button"
                  onClick={handleButtonLocal}
                  className={`px-4 py-2 rounded-tl-lg rounded-bl-lg font-semibold cursor-pointer ${
                    orderType === "local"
                      ? "bg-orange-400 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Local
                </button>
                <button
                  type="button"
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

            {(orderType === "delivery" || orderType === "local") && (
              <motion.form
                className="space-y-3"
                onSubmit={handleSubmit(handleMainButton)}
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

                {orderType === "delivery" && (
                  <>
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
                  </>
                )}

                {orderType === 'local' && (
                  <TableSelector
                    value={watch('table')}
                    onChange={(tableNumber) => setValue('table', tableNumber)}
                    error={errors.table?.message}
                  />
                )}

                {!isAdmin && (
                  <PhoneVerification
                    key={resetKey}
                    phone={phone}
                    setPhone={setPhone}
                    isVerified={isPhoneVerified}
                    setIsVerified={setIsPhoneVerified}
                    onClearPhone={handleClearPhone}
                    resetKey={resetKey}
                    onError={handlePhoneError}
                  />
                )}
                
                <textarea
                  placeholder="Nota"
                  {...register("note")}
                  className="resize-none w-full rounded-lg p-2 border-2 border-gray-100 bg-gray-100 focus:outline-none focus:border-orange-500"
                ></textarea>

                {/* MÉTODO DE PAGO */}
                {orderType === "delivery" && (
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Método de pago
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value as "efectivo" | "tarjeta"
                        )
                      }
                      className="w-full cursor-pointer p-2 border-2 border-gray-100 bg-gray-100 rounded-lg focus:outline-none focus:border-orange-500"
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta">Tarjeta</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isValid || (!isPhoneVerified && !isAdmin) || isLoading}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-white transition ${
                    !isValid || (!isPhoneVerified && !isAdmin) || isLoading
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-orange-400 hover:bg-orange-500 cursor-pointer"
                  }`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : paymentMethod === "tarjeta" ? (
                    "Ir a pagar"
                  ) : (
                    "Confirmar pedido"
                  )}
                </button>
              </motion.form>
            )}
          </motion.div>

          {/* Modal de pago con tarjeta */}
          {showPaymentModal && formData && (
            <MinimalCardPayment
              formData={formData}
              onClose={() => setShowPaymentModal(false)}
              onPaymentSuccess={(paymentData) => {
                handleOrderConfirm(formData, paymentData);
              }}
              onPaymentError={(error) => {
                console.error("Error en el pago:", error);
                toast.error("Error al procesar el pago");
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
