import { Dispatch, SetStateAction } from "react";
import { ShoppingBagIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useStore } from "@/src/store";
import { motion, AnimatePresence } from "framer-motion";

type statusOrderProp = {
  orderActive: boolean;
  setOrderActive: Dispatch<SetStateAction<boolean>>;
};

export default function OrderButton({
  orderActive,
  setOrderActive,
}: statusOrderProp) {
  const order = useStore((state) => state.order);

  function statusOrder() {
    setOrderActive(!orderActive);
  }

  return (
    <>
      {!orderActive ? (
        <div className="relative">
          <ShoppingBagIcon
            className="z-200 text-center text-lg font-bold cursor-pointer fixed bottom-2 rounded-full right-2 w-12 h-12 p-2.5 bg-linear-to-tr from-orange-200 to-orange-300 transition duration-400"
            onClick={statusOrder}
          />

          <AnimatePresence mode="wait">

              <motion.p
                key={order.length} // detecta cada cambio de cantidad
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.3, type: "spring"  }}
                className="font-medium z-500 bg-linear-to-tr from-orange-200 to-orange-300 rounded-full fixed bottom-1 right-1 w-6 h-6 flex items-center justify-center cursor-pointer"
                onClick={statusOrder}
              >
                {order.length}
              </motion.p>

          </AnimatePresence>
        </div>
      ) : (
        <XMarkIcon
          className="z-200 text-center text-lg font-bold cursor-pointer fixed top-2 rounded-full right-2 w-10 h-10 text-red-500 transition duration-400"
          onClick={statusOrder}
        />
      )}
    </>
  );
}
