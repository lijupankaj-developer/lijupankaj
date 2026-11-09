import { NextRequest, NextResponse } from "next/server";
import { requirePasswordAdmin } from "@/lib/auth/admin";
import { clientAddress, enforceRateLimit, requireSameOrigin } from "@/lib/auth/request-security";
import { apiError } from "@/lib/http/api-response";

export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request);
    enforceRateLimit(`mfa-enroll:${clientAddress(request)}`, 10, 15 * 60 * 1000);
    const { supabase } = await requirePasswordAdmin();
    const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
    if (listError) throw listError;
    const all = factors?.all ?? [];
    if (all.some((factor) => factor.factor_type === "totp" && factor.status === "verified")) {
      return NextResponse.json({ error: "An authenticator app is already set up. Enter its code instead." }, { status: 409 });
    }
    // Remove abandoned, never-verified enrolments before starting a fresh one.
    for (const factor of all.filter((item) => item.status !== "verified")) {
      await supabase.auth.mfa.unenroll({ factorId: factor.id });
    }
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: `Authenticator ${new Date().toISOString().slice(0, 10)}`, issuer: "lijupankaj.com" });
    if (error || !data) throw error ?? new Error("MFA enrolment failed");
    return NextResponse.json({ factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret });
  } catch (error) {
    return apiError(error);
  }
}
