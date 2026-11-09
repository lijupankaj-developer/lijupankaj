import Link from "next/link";
import { redirect } from "next/navigation";
import { MfaEnrollForm, MfaVerifyForm } from "@/components/admin/auth-form";
import { requirePasswordAdmin, safeAdminNext } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function MfaPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeAdminNext((await searchParams).next);
  let context: Awaited<ReturnType<typeof requirePasswordAdmin>>;
  try {
    context = await requirePasswordAdmin();
  } catch {
    redirect("/admin/login");
  }
  if (context.aal === "aal2") redirect(next);

  const { data } = await context.supabase.auth.mfa.listFactors();
  const factor = (data?.all ?? []).find((item) => item.factor_type === "totp" && item.status === "verified");

  return <main className="auth-page"><section className="auth-card"><Link className="admin-mark" href="/">LIJU PANKAJ</Link><p className="admin-kicker">Two-factor authentication</p>{factor
    ? <><h1>Enter your code</h1><p>Open your authenticator app and enter the 6-digit code for lijupankaj.com.</p><MfaVerifyForm factorId={factor.id} next={next} /></>
    : <><h1>Secure your account</h1><p>Two-factor authentication is required for the CMS. Scan the QR code with an authenticator app, such as Google Authenticator, Microsoft Authenticator, 1Password or Apple Passwords, then enter the 6-digit code.</p><MfaEnrollForm next={next} /></>}
  </section></main>;
}
