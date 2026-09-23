import { NextResponse } from 'next/server';
import supabaseAnon from '@/lib/supabase/anon';
import {
  getTasksByMilestoneId,
  createTask,
  updateTask,
  deleteTask,
} from '@/lib/db/tasksDb';

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
 * /api/v1/tasks:
 *   get:
 *     summary: Retrieve tasks for a milestone
 *     description: Fetches sub-tasks belonging to a specific milestone.
 *     tags:
 *       - Tasks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: milestone_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent Milestone UUID.
 *     responses:
 *       200:
 *         description: Successfully retrieved tasks.
 *       400:
 *         description: Milestone ID missing.
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
    const milestoneId = searchParams.get('milestone_id');

    if (!milestoneId) {
      return NextResponse.json({ error: 'milestone_id query parameter is required' }, { status: 400 });
    }

    const tasks = await getTasksByMilestoneId(milestoneId, user.id);
    return NextResponse.json({ data: tasks }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a task
 *     description: Adds a task item under a milestone.
 *     tags:
 *       - Tasks
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - milestone_id
 *               - title
 *             properties:
 *               milestone_id:
 *                 type: string
 *                 example: "987f6543-e21b-12d3-a456-426614174000"
 *               title:
 *                 type: string
 *                 example: Read pages 1-20
 *               xp:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Task created successfully.
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
    const newTask = await createTask(user.id, body);
    return NextResponse.json({ data: newTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/tasks:
 *   put:
 *     summary: Update a task
 *     description: Modifies completion status, title, or reward XP of a task.
 *     tags:
 *       - Tasks
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
 *               is_completed:
 *                 type: boolean
 *               xp:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *       400:
 *         description: Task ID missing.
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
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const updated = await updateTask(id, user.id, updates);
    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/tasks:
 *   delete:
 *     summary: Delete a task
 *     description: Permanently removes a task.
 *     tags:
 *       - Tasks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task UUID.
 *     responses:
 *       200:
 *         description: Task deleted successfully.
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
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    await deleteTask(id, user.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}