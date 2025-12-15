import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  try {
    jwt.verify(token, process.env.ADMIN_SECRET!);
    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}