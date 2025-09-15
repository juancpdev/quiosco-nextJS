import OrderSidebar from "@/components/order/orderSidebar";
import OrderSummary from "@/components/order/orderSummary";


export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    return (
        <>
            <div className="lg:flex">
                <OrderSidebar />

                <main className="lg:flex-1 lg:h-screen lg:overflow-y-scroll p-5">
                    {children}
                </main>

                <OrderSummary />
            </div>
        </>
    )
}