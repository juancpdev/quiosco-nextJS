import OrderSidebar from "@/components/order/OrderSidebar";
import OrderWrapper from "@/components/order/OrderWrapper";
import Heading from "@/components/ui/Heading";
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    return (
        <>
            <div className="xl:flex">
                <ToastContainer />
                <OrderSidebar />

                <main className="p-5 flex justify-center xl:flex-1 xl:h-screen xl:overflow-y-scroll xl:mt-0">
                    <div className="xl:[width:-webkit-fill-available]">
                        <Heading>Elegí y personalizá tu pedido</Heading>
                        {children}
                    </div>
                </main>

                <OrderWrapper />
            </div>
        </>
    )
}