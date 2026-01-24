import { getAllTables } from "@/actions/table/table-actions";

export async function GET() {
  const tables = await getAllTables();
  return Response.json(tables);
}