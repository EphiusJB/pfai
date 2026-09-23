import { NextResponse } from "next/server";
import supabaseAnon from "@/lib/supabase/anon";
import {
  getTransactionsByUserId,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/lib/db/financeDb";

async function getAuthUser(request) {
  // Extract Authorization header from incoming request
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  // Extract JWT token (Remove "Bearer ")
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  // Pass the JWT token directly to Supabase to verify user identity
  const {
    data: { user },
    error,
  } = await supabaseAnon.auth.getUser(token);

  if (error || !user) return null;
  return user;
}

/**
 * @swagger
 * /api/v1/finance:
 *   get:
 *     summary: Retrieve user transactions
 *     description: Fetches all financial transactions for the authenticated user ordered by creation date.
 *     tags:
 *       - Finance
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved transactions list.
 *       401:
 *         description: Unauthorized - Invalid or missing user session.
 *       500:
 *         description: Internal Server Error.
 */
export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await getTransactionsByUserId(user.id);
    return NextResponse.json({ data: transactions }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/finance:
 *   post:
 *     summary: Create a transaction
 *     description: Adds a new financial transaction for the authenticated user.
 *     tags:
 *       - Finance
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 49.99
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: expense
 *               category:
 *                 type: string
 *                 example: Subscriptions
 *               description:
 *                 type: string
 *                 example: Monthly Software Subscription
 *     responses:
 *       201:
 *         description: Transaction created successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal Server Error.
 */
export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const newTransaction = await createTransaction(user.id, body);
    return NextResponse.json({ data: newTransaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/finance:
 *   put:
 *     summary: Update a transaction
 *     description: Updates properties of an existing transaction owned by the user.
 *     tags:
 *       - Finance
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction updated successfully.
 *       400:
 *         description: Bad Request - Missing transaction ID.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal Server Error.
 */
export async function PUT(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const updated = await updateTransaction(id, user.id, updates);
    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/finance:
 *   delete:
 *     summary: Delete a transaction
 *     description: Removes a transaction record by its ID.
 *     tags:
 *       - Finance
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the transaction to delete.
 *     responses:
 *       200:
 *         description: Transaction deleted successfully.
 *       400:
 *         description: Transaction ID is required.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal Server Error.
 */
export async function DELETE(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    await deleteTransaction(id, user.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
