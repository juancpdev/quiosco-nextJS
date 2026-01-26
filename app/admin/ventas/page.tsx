"use client";

import { useState, useEffect } from "react";
import Heading from "@/components/ui/Heading";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, TrendingUp, DollarSign, ShoppingCart, Package } from "lucide-react";
import { formatCurrency, getImagePath } from "@/src/utils";
import { VentasStats } from "@/actions/ventas/get-ventas-stats-actions";
import Image from "next/image";

const COLORS = ["#f97316", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function VentasPage() {
  const [stats, setStats] = useState<VentasStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(1); // Primer día del mes
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  });

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });
      const response = await fetch(`/admin/ventas/api?${params}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay datos disponibles</p>
      </div>
    );
  }

  // Datos para gráfico de métodos de pago
  const paymentMethodData = [
    { name: "Efectivo", value: stats.revenueByPaymentMethod.efectivo },
    { name: "Tarjeta", value: stats.revenueByPaymentMethod.tarjeta },
  ];

  // Datos para gráfico de tipo de entrega
  const deliveryTypeData = [
    { name: "Local", value: stats.revenueByDeliveryType.local },
    { name: "Delivery", value: stats.revenueByDeliveryType.delivery },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Heading>Historial de Ventas</Heading>

      {/* Filtros de fecha */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <div className="flex flex-col items-center justify-center sm:flex-row gap-4 ">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="inline mr-2" size={16} />
              Fecha Inicio
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="inline mr-2" size={16} />
              Fecha Fin
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border-2 border-orange-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-sm font-semibold mb-2">Total Ventas</p>
              <div className="flex items-center justify-between">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 wrap-break-word">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <DollarSign className="text-orange-500 shrink-0 self-start sm:self-auto" size={28} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border-2 border-blue-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-sm font-semibold mb-2">Total Órdenes</p>
              <div className="flex items-center justify-between">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 wrap-break-word">
                  {stats.totalOrders}
                </p>
                <ShoppingCart className="text-blue-500 shrink-0 self-start sm:self-auto" size={28} />
              </div>

            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border-2 border-green-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-sm font-semibold mb-2">Ticket Promedio</p>
              <div className="flex items-center justify-between">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 wrap-break-word">
                  {formatCurrency(stats.averageTicket)}
                </p>
                <TrendingUp className="text-green-500 shrink-0 self-start sm:self-auto" size={28} />
              </div>

            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border-2 border-purple-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-sm font-semibold mb-2">Completadas</p>
              <div className="flex items-center justify-between">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 wrap-break-word">
                  {stats.completedOrders}
                </p>
                <Package className="text-purple-500 shrink-0 self-start sm:self-auto" size={28} />

              </div>
              <p className="text-xs text-gray-500 mt-1 wrap-break-word">
                {stats.pendingOrders} pendientes
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Ventas por día */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Ventas por Día
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.ordersByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis />
              <Tooltip
                formatter={(value: number | undefined) => value ? formatCurrency(value) : ''}
                labelFormatter={(label) => new Date(label).toLocaleDateString("es-ES")}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#f97316"
                strokeWidth={2}
                name="Ventas"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Órdenes por día */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Órdenes por Día
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.ordersByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => new Date(label).toLocaleDateString("es-ES")}
              />
              <Legend />
              <Bar dataKey="orders" fill="#3b82f6" name="Órdenes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Método de pago */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Ventas por Método de Pago
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodData.map((entry, index) => ({
                  ...entry,
                  fill: COLORS[index % COLORS.length],
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
                }
                outerRadius={80}
                dataKey="value"
              />
              <Tooltip formatter={(value: number | undefined) => value ? formatCurrency(value) : ''} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tipo de entrega */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Ventas por Tipo de Entrega
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deliveryTypeData.map((entry, index) => ({
                  ...entry,
                  fill: COLORS[(index + 2) % COLORS.length],
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
                }
                outerRadius={80}
                dataKey="value"
              />
              <Tooltip formatter={(value: number | undefined) => value ? formatCurrency(value) : ''} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Productos más vendidos */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Productos Más Vendidos
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Producto</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Cantidad</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Ventas</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((product, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 shrink-0">
                        <Image
                          className="rounded-xl object-cover"
                          src={getImagePath(product.productImage)}
                          fill
                          alt={`Imagen de ${product.productName}`}
                          sizes="48px"
                          priority={index < 2}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate w-36 md:w-auto">
                          {product.productName}
                        </p>
                        {product.variantName && (
                          <p className="text-sm text-orange-600 truncate w-20 md:w-auto">
                            {product.variantName}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 font-semibold text-gray-700">
                    {product.quantity}
                  </td>
                  <td className="text-right py-3 px-4 font-bold text-orange-600">
                    {formatCurrency(product.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
