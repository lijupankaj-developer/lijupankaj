import { ResetPasswordForm } from "@/components/admin/auth-form";
import Link from "next/link";
import { requireAdminPage } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  await requireAdminPage("/admin/reset-password");
  return <main className="auth-page"><section className="auth-card"><Link className="admin-mark" href="/">LIJU PANKAJ</Link><p className="admin-kicker">Secure password reset</p><h1>Choose a new password</h1><ResetPasswordForm /></section></main>;
}
