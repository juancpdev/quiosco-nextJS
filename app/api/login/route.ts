import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || 'unknown';

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email, userAgent },
      process.env.ADMIN_SECRET!,
      { expiresIn: '12h' }
    );

    (await cookies()).set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      path: "/",
      maxAge: 12 * 60 * 60,
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}