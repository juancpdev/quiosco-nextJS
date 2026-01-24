import AdminSidebar from "@/components/admin/AdminSidebar";
import { ToastContainer } from "react-toastify";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="md:flex">
                <AdminSidebar />

                <main className="md:flex-1 md:h-screen md:overflow-y-scroll bg-gray-100 p-5 pt-20 md:pt-5 md:ml-0">
                    {children}
                </main>
            </div>

            <ToastContainer />
        </>
    )
}