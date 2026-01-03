"use client";

import useSWR from "swr";
import OrdersGrid from "@/components/order/OrdersGrid";
import Heading from "@/components/ui/Heading";
import { OrderWithProducts } from "@/src/types";

export default function OrdersPage() {
  const url = "/admin/orders/api";

  const fetcher = () => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR<OrderWithProducts[]>(url, fetcher, {
    refreshInterval: 1000,
    revalidateOnFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  if (error) {
    return <p>Error al cargar órdenes</p>;
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Heading>Administrar Órdenes</Heading>
      <OrdersGrid orders={data} />
    </div>
  );
}
