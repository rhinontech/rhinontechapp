export interface JWTPayload {
  userId: string;
  roleSlug: string;
  permissions: string[];
  fullName: string;
  companyEmail: string;
  exp?: number;
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    const base64 = token.split(".")[1];
    const json = Buffer.from(base64, "base64url").toString("utf-8");
    const payload = JSON.parse(json) as JWTPayload;

    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    if (!payload.roleSlug) return null;

    return payload;
  } catch {
    return null;
  }
}
