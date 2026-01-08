"use client";

import useSWR from "swr";
import Heading from "@/components/ui/Heading";
import { OrderWithProducts } from "@/src/types";
import Logo from "@/components/ui/Logo";
import LatestOrderItem from "@/components/order/LatestOrderItem";
import Masonry from "react-masonry-css";

export default function OrdersPage() {
  const url = "/orders/api";
  const fetcher = () => fetch(url).then((res) => res.json());

  const breakpointColumns = {
    default: 3,
    1280: 3,
    1024: 2,
    640: 1,
  };

  const { data, error, isLoading } = useSWR<OrderWithProducts[]>(url, fetcher, {
    refreshInterval: 1000,
    revalidateOnFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  if (error) {
    return <p>Error al cargar órdenes</p>;
  }

  if (data)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col justify-center items-center">
          <Heading>Órdenes Listas</Heading>
          <Logo />
        </div>
        {data.length ? (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex -ml-6 w-auto mt-10"
            columnClassName="pl-6 bg-clip-padding"
          >
            {data.map((order) => (
              <div key={order.id} className="mb-6">
                <LatestOrderItem key={order.id} order={order} />
              </div>
            ))}
          </Masonry>
        ) : (
          <p className="text-center mt-10">No hay ordenes Completadas</p>
        )}
      </div>
    );
}