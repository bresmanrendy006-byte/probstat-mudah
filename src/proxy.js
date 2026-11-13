// src/proxy.js
// Next.js 16 memakai nama "proxy" (dulu "middleware"). Letaknya sejajar dengan folder app.

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};