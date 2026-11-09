import { NextRequest, NextResponse } from "next/server";
import { requirePasswordAdmin } from "@/lib/auth/admin";
import { clientAddress, enforceRateLimit, requireSameOrigin } from "@/lib/auth/request-security";
import { apiError } from "@/lib/http/api-response";

export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request);
    enforceRateLimit(`mfa-verify:${clientAddress(request)}`, 8, 15 * 60 * 1000);
    const { supabase, userId } = await requirePasswordAdmin();
    enforceRateLimit(`mfa-verify-user:${userId}`, 8, 15 * 60 * 1000);
    const body = await request.json();
    const factorId = typeof body.factorId === "string" ? body.factorId : "";
    const code = typeof body.code === "string" ? body.code.replace(/\s+/g, "") : "";
    if (!/^\d{6}$/.test(code)) return NextResponse.json({ error: "Enter the 6-digit code from your authenticator app." }, { status: 400 });

    const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
    if (listError) throw listError;
    const factor = (factors?.all ?? []).find((item) => item.id === factorId && item.factor_type === "totp");
    if (!factor) return NextResponse.json({ error: "Authenticator not found. Reload the page and try again." }, { status: 400 });

    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code });
    if (error) return NextResponse.json({ error: "That code is incorrect or has expired." }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
