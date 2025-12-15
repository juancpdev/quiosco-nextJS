import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// CRÍTICO: Cambiar a Node.js runtime
export const runtime = 'nodejs';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  const isLoginPage = req.nextUrl.pathname === "/login";
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  // NO verificar rutas de API
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Si no es login ni admin, pasar sin verificar
  if (!isLoginPage && !isAdminPage) {
    return NextResponse.next();
  }

  let valid = false;
  
  if (token) {
    try {
      // Importar jsonwebtoken solo cuando lo necesitamos
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.ADMIN_SECRET!) as { 
        email: string;
        userAgent: string;
      };
      
      const currentUserAgent = req.headers.get('user-agent') || 'unknown';
      
      // Verificar User-Agent
      if (decoded.userAgent === currentUserAgent) {
        valid = true;
      }
    } catch (error) {
      valid = false;
    }
  }

  if (isLoginPage && valid) {
    return NextResponse.redirect(new URL("/admin/orders", req.url));
  }
  
  if (isAdminPage && !valid) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    if (token) {
      response.cookies.delete("admin_session");
    }
    return response;
  }

  return NextResponse.next();
}

export const config = { 
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
};