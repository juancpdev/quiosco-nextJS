import { revalidatePath } from "next/cache";

export async function POST() {
  revalidatePath('/admin/tables');
  return Response.json({ success: true });
}