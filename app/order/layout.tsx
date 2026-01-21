import OrderSidebar from "@/components/order/OrderSidebar";
import OrderWrapper from "@/components/order/OrderWrapper";
import Heading from "@/components/ui/Heading";
import Logo from "@/components/ui/Logo";
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    return (
        <>
            <div className="xl:flex">
                <ToastContainer />
                <OrderSidebar />

                <main className="p-5 flex justify-center xl:flex-1 xl:h-screen xl:overflow-y-scroll xl:mt-0 overflow-y-auto overflow-x-hidden  scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-transparent">
                    <div className="w-full xl:[width:-webkit-fill-available]">
                        <div className="flex flex-col items-center justify-center xl:hidden">
                            <Logo/>
                        </div>
                        <Heading>Elegí y personalizá tu pedido</Heading>
                        {children}
                    </div>
                </main>

                <OrderWrapper />
            </div>
        </>
    )
}