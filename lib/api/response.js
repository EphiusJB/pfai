import { NextResponse } from "next/server";

const response = {
  ok(data = null, meta = null) {
    const body = { success: true, data };
    if (meta) body.meta = meta;
    return NextResponse.json(body, { status: 200 });
  },

  created(data = null) {
    return NextResponse.json({ success: true, data }, { status: 201 });
  },

  noContent() {
    return new NextResponse(null, { status: 204 });
  },

  badRequest(message = "Bad request", details = null) {
    const body = { success: false, error: { code: "BAD_REQUEST", message } };
    if (details) body.error.details = details;
    return NextResponse.json(body, { status: 400 });
  },

  unauthorised(message = "Authentication required") {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORISED", message } },
      { status: 401 }
    );
  },

  forbidden(message = "You do not have permission to perform this action") {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message } },
      { status: 403 }
    );
  },

  notFound(message = "Resource not found") {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message } },
      { status: 404 }
    );
  },

  conflict(message = "Resource already exists") {
    return NextResponse.json(
      { success: false, error: { code: "CONFLICT", message } },
      { status: 409 }
    );
  },

  unprocessable(message, details = null) {
    const body = { success: false, error: { code: "UNPROCESSABLE", message } };
    if (details) body.error.details = details;
    return NextResponse.json(body, { status: 422 });
  },

  tooManyRequests(message = "Too many requests. Please try again later.") {
    return NextResponse.json(
      { success: false, error: { code: "RATE_LIMITED", message } },
      { status: 429 }
    );
  },

  serverError(message = "An unexpected error occurred") {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message } },
      { status: 500 }
    );
  },

  pageMeta({ page, limit, total }) {
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  },
};

export default response;
