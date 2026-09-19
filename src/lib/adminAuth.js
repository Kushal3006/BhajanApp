import { getSupabaseAdminClient } from "@/lib/supabase";

export async function assertAdminRequest(request) {
  const authorization = request.headers.get("authorization") || "";
  const accessToken = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";

  if (!accessToken) {
    const error = new Error("Supabase authentication is required.");
    error.status = 401;
    throw error;
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    const authError = new Error("Invalid or expired Supabase session.");
    authError.status = 401;
    throw authError;
  }

  const configuredAdmins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const userEmail = data.user.email?.toLowerCase();
  const hasAdminRole = data.user.app_metadata?.role === "admin";

  if (!hasAdminRole && (!userEmail || !configuredAdmins.includes(userEmail))) {
    const forbiddenError = new Error("This account is not authorized for admin access.");
    forbiddenError.status = 403;
    throw forbiddenError;
  }

  return data.user;
}

export function adminErrorResponse(error) {
  const status = error.status || 500;
  const message = status === 500 ? "Admin request failed." : error.message;

  return Response.json({ error: message }, { status });
}
