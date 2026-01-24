import { getTablesWithOrders } from "@/actions/table/table-actions";

export async function GET() {
  const tables = await getTablesWithOrders();
  return Response.json(tables);
}