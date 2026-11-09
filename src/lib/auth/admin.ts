import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export class AdminAuthError extends Error {
  status: number;
  constructor(message = "Administrator authentication required.", status = 401) {
    super(message);
    this.status = status;
  }
}

export const MFA_REQUIRED_MESSAGE = "Two-factor verification is required.";

/** Password-verified administrator (assurance level aal1 or aal2). Only for the two-factor setup/verification step. */
export async function requirePasswordAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = typeof data?.claims?.sub === "string" ? data.claims.sub : null;
  const email = typeof data?.claims?.email === "string" ? data.claims.email.toLowerCase() : null;
  const aal = data?.claims?.aal === "aal2" ? "aal2" : "aal1";
  if (error || !userId || !email) throw new AdminAuthError();

  const { data: admin } = await supabase.from("admin_users").select("user_id,email").eq("user_id", userId).maybeSingle();
  const approvedEmail = process.env.CMS_ADMIN_EMAIL?.toLowerCase();
  if (!admin || !approvedEmail || email !== approvedEmail || admin.email !== approvedEmail) throw new AdminAuthError("This account is not approved for the CMS.", 403);
  return { supabase, userId, email, aal };
}

/** Fully authenticated administrator: password and authenticator code (aal2). */
export async function requireAdmin() {
  const context = await requirePasswordAdmin();
  if (context.aal !== "aal2") throw new AdminAuthError(MFA_REQUIRED_MESSAGE, 401);
  return context;
}

export function safeAdminNext(value: string | null | undefined, fallback = "/admin") {
  return value && value.startsWith("/admin") && !value.startsWith("//") && !value.startsWith("/admin/mfa") && !value.startsWith("/admin/login") ? value : fallback;
}

export async function requireAdminPage(next = "/admin") {
  let context: Awaited<ReturnType<typeof requirePasswordAdmin>>;
  try {
    context = await requirePasswordAdmin();
  } catch {
    redirect("/admin/login");
  }
  if (context.aal !== "aal2") redirect(`/admin/mfa?next=${encodeURIComponent(safeAdminNext(next))}`);
  return context;
}
