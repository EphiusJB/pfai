import { NextResponse } from 'next/server';
import supabaseAnon from '@/lib/supabase/anon';
import {
  getGoalsByUserId,
  createGoal,
  updateGoal,
  deleteGoal,
} from '@/lib/db/goalsDb';

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
 * /api/v1/goals:
 *   get:
 *     summary: Retrieve user goals
 *     description: Fetches all goals created by the authenticated user.
 *     tags:
 *       - Goals
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved goals.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal Server Error.
 */
export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const goals = await getGoalsByUserId(user.id);
    return NextResponse.json({ data: goals }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/goals:
 *   post:
 *     summary: Create a goal
 *     description: Adds a new goal tracking item for the authenticated user.
 *     tags:
 *       - Goals
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Read 12 Books
 *               target_amount:
 *                 type: number
 *                 example: 12
 *               current_amount:
 *                 type: number
 *                 example: 3
 *               category:
 *                 type: string
 *                 example: Personal Growth
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-31"
 *     responses:
 *       201:
 *         description: Goal created successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal Server Error.
 */
export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const newGoal = await createGoal(user.id, body);
    return NextResponse.json({ data: newGoal }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/goals:
 *   put:
 *     summary: Update a goal
 *     description: Modifies attributes or updates progress on an existing goal.
 *     tags:
 *       - Goals
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
 *               title:
 *                 type: string
 *               current_amount:
 *                 type: number
 *               target_amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Goal updated successfully.
 *       400:
 *         description: Goal ID missing.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal Server Error.
 */
export async function PUT(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    const updated = await updateGoal(id, user.id, updates);
    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/goals:
 *   delete:
 *     summary: Delete a goal
 *     description: Permanently removes a goal item.
 *     tags:
 *       - Goals
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Goal ID UUID.
 *     responses:
 *       200:
 *         description: Goal deleted successfully.
 *       400:
 *         description: Missing ID parameter.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal Server Error.
 */
export async function DELETE(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    await deleteGoal(id, user.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}