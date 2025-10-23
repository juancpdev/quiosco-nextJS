import OrderSidebar from "@/components/order/OrderSidebar";
import OrderSummary from "@/components/order/OrderSummary";

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    return (
        <>
            <div className="xl:flex">
                <OrderSidebar />

                <main className="p-5 flex justify-center mt-10 xl:flex-1 xl:h-screen xl:overflow-y-scroll xl:mt-0">
                    <div className="xl:[width:-webkit-fill-available]">
                        <p className="font-bold text-xl text-center my-5 text-black xl:text-3xl xl:pb-2">Elegí y personalizá tu pedido</p>
                        {children}
                    </div>
                </main>

                <OrderSummary />
            </div>
        </>
    )
}