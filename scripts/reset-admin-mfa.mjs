// Removes every two-factor factor from the approved CMS administrator (use when the authenticator device is lost).
// The next sign-in will ask to set up a new authenticator app.
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_INTERNAL_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
const email = process.env.CMS_ADMIN_EMAIL?.trim().toLowerCase();
if (!url || !secret || !email) throw new Error("Supabase server configuration and CMS_ADMIN_EMAIL are required.");

const supabase = createClient(url, secret, { auth: { autoRefreshToken: false, persistSession: false } });
let user = null;
for (let page = 1; page <= 10 && !user; page += 1) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
  if (error) throw error;
  user = data.users.find((candidate) => candidate.email?.toLowerCase() === email) ?? null;
  if (data.users.length < 100) break;
}
if (!user) throw new Error("The approved administrator account was not found.");

const { data, error } = await supabase.auth.admin.mfa.listFactors({ userId: user.id });
if (error) throw error;
for (const factor of data.factors) {
  const { error: deleteError } = await supabase.auth.admin.mfa.deleteFactor({ userId: user.id, id: factor.id });
  if (deleteError) throw deleteError;
}
process.stdout.write(`Removed ${data.factors.length} two-factor factor(s) for ${email}. Sign in to set up a new authenticator app.\n`);
