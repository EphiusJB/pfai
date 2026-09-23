import { NextResponse } from 'next/server';
import supabaseAnon from '@/lib/supabase/anon';
import {
  getMilestonesByGoalId,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from '@/lib/db/milestonesDb';

async function getAuthUser(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const {
    data: { user },
    error,
  } = await supabaseAnon.auth.getUser(token);

  if (error || !user) return null;
  return user;
}

/**
 * @swagger
 * /api/v1/milestones:
 *   get:
 *     summary: Retrieve milestones for a goal
 *     description: Fetches all milestones associated with a given goal ID.
 *     tags:
 *       - Milestones
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: goal_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent Goal UUID.
 *     responses:
 *       200:
 *         description: Successfully retrieved milestones.
 *       400:
 *         description: Goal ID missing.
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

    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get('goal_id');

    if (!goalId) {
      return NextResponse.json({ error: 'goal_id query parameter is required' }, { status: 400 });
    }

    const milestones = await getMilestonesByGoalId(goalId, user.id);
    return NextResponse.json({ data: milestones }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/milestones:
 *   post:
 *     summary: Create a milestone
 *     description: Adds a new milestone under a specific goal.
 *     tags:
 *       - Milestones
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goal_id
 *               - title
 *             properties:
 *               goal_id:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               title:
 *                 type: string
 *                 example: Complete Chapter 1
 *               status:
 *                 type: string
 *                 example: not-started
 *     responses:
 *       201:
 *         description: Milestone created successfully.
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
    const newMilestone = await createMilestone(user.id, body);
    return NextResponse.json({ data: newMilestone }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/milestones:
 *   put:
 *     summary: Update a milestone
 *     description: Modifies title or status of an existing milestone.
 *     tags:
 *       - Milestones
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
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Milestone updated successfully.
 *       400:
 *         description: Milestone ID missing.
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
      return NextResponse.json({ error: 'Milestone ID is required' }, { status: 400 });
    }

    const updated = await updateMilestone(id, user.id, updates);
    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/milestones:
 *   delete:
 *     summary: Delete a milestone
 *     description: Removes a milestone and its cascading sub-tasks.
 *     tags:
 *       - Milestones
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Milestone UUID.
 *     responses:
 *       200:
 *         description: Milestone deleted successfully.
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
      return NextResponse.json({ error: 'Milestone ID is required' }, { status: 400 });
    }

    await deleteMilestone(id, user.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}