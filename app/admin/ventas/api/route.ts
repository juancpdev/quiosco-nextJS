import { NextRequest, NextResponse } from "next/server";
import { getVentasStats } from "@/actions/ventas/get-ventas-stats-actions";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const startDate = startDateParam ? new Date(startDateParam) : undefined;
    const endDate = endDateParam ? new Date(endDateParam) : undefined;

    const stats = await getVentasStats(startDate, endDate);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error in ventas API:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
