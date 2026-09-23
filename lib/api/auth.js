import supabaseAnon from "../supabase/anon.js";
import logger from "../logger.js";
import { AppError } from "./errors.js";

async function requireAuth(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(401, "UNAUTHORISED", "Authorization header missing or malformed");
  }

  const token = authHeader.slice(7);
  const { data, error } = await supabaseAnon.auth.getUser(token);

  if (error || !data?.user) {
    logger.warn("Auth failure", { error: error?.message });
    throw new AppError(401, "UNAUTHORISED", "Invalid or expired token");
  }

  return { user: data.user, token };
}

// Optional auth — returns { user, token } if a valid token is
// present, otherwise null. Doesn't throw.
async function optionalAuth(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const { data } = await supabaseAnon.auth.getUser(token);
    if (data?.user) return { user: data.user, token };
  }
  return null;
}

export { requireAuth, optionalAuth };
