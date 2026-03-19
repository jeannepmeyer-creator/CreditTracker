const SESSION_COOKIE = "admin_session";

export function verifyAdminPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return input === password;
}

export function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "fallback-secret-change-me";
}

export function isValidSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  return cookieValue === getSessionSecret();
}

export function parseSessionCookie(cookieHeader: string): string | undefined {
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const found = cookies.find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  return found ? found.slice(SESSION_COOKIE.length + 1) : undefined;
}

export function requireAdmin(request: Request): Response | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const sessionValue = parseSessionCookie(cookieHeader);
  if (!isValidSession(sessionValue)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function makeSessionCookie(maxAge = 86400): string {
  const secret = getSessionSecret();
  return `${SESSION_COOKIE}=${secret}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
}
