import response from "./response.js";
import logger from "../logger.js";
import env from "../env.js";
import { AppError } from "./errors.js";

const SUPABASE_UNIQUE_VIOLATION = "23505";
const SUPABASE_FOREIGN_KEY = "23503";
const SUPABASE_NOT_NULL = "23502";

function apiHandler(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (err) {
      logger.error("Unhandled error", {
        message: err.message,
        code: err.code,
        stack: env.isDev ? err.stack : undefined,
        url: request?.nextUrl?.pathname,
        method: request?.method,
      });

      // ── Supabase / Postgres error codes ──────────────────
      if (err.code === SUPABASE_UNIQUE_VIOLATION) {
        return response.conflict("A record with this value already exists");
      }
      if (err.code === SUPABASE_FOREIGN_KEY) {
        return response.unprocessable("Referenced record does not exist");
      }
      if (err.code === SUPABASE_NOT_NULL) {
        return response.badRequest("A required field was not provided");
      }

      // ── Application errors (thrown via AppError) ─────────
      if (err instanceof AppError || err.statusCode) {
        return response[statusToHelper(err.statusCode)]
          ? response[statusToHelper(err.statusCode)](err.message)
          : new Response(
              JSON.stringify({
                success: false,
                error: { code: err.code || "APP_ERROR", message: err.message },
              }),
              { status: err.statusCode, headers: { "Content-Type": "application/json" } }
            );
      }

      // ── JWT errors ─────────────────────────────────────────
      if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return response.unauthorised("Invalid or expired token");
      }

      // ── Malformed request body ──────────────────────────────
      if (err instanceof SyntaxError && err.message.includes("JSON")) {
        return response.badRequest("Request body is not valid JSON");
      }

      // ── Default: 500 ─────────────────────────────────────
      const message = env.isProd ? "An unexpected error occurred" : err.message;
      return response.serverError(message);
    }
  };
}

// Small lookup so common AppError statuses map to the matching
// response.* helper (keeps the code in error bodies consistent).
function statusToHelper(statusCode) {
  const map = {
    400: "badRequest",
    401: "unauthorised",
    403: "forbidden",
    404: "notFound",
    409: "conflict",
    422: "unprocessable",
    429: "tooManyRequests",
  };
  return map[statusCode];
}

export default apiHandler;
