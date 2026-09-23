import { NextResponse } from 'next/server';
import supabaseAnon from '@/lib/supabase/anon';
import {
  getJournalEntriesByUserId,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from '@/lib/db/journalDb';

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
 * /api/v1/journal:
 *   get:
 *     summary: Retrieve journal entries
 *     description: Fetches all journal entries belonging to the authenticated user.
 *     tags:
 *       - Journal
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of journal entries retrieved.
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

    const entries = await getJournalEntriesByUserId(user.id);
    return NextResponse.json({ data: entries }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/journal:
 *   post:
 *     summary: Create a journal entry
 *     description: Creates a new journal entry record.
 *     tags:
 *       - Journal
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Morning Reflections
 *               content:
 *                 type: string
 *                 example: Today feels like a great day to accomplish tasks.
 *               mood:
 *                 type: string
 *                 example: Productive
 *     responses:
 *       201:
 *         description: Journal entry created.
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
    const newEntry = await createJournalEntry(user.id, body);
    return NextResponse.json({ data: newEntry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/journal:
 *   put:
 *     summary: Update a journal entry
 *     description: Modifies an existing journal entry.
 *     tags:
 *       - Journal
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
 *               content:
 *                 type: string
 *               mood:
 *                 type: string
 *     responses:
 *       200:
 *         description: Journal entry updated successfully.
 *       400:
 *         description: Missing entry ID.
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
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }

    const updated = await updateJournalEntry(id, user.id, updates);
    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/journal:
 *   delete:
 *     summary: Delete a journal entry
 *     description: Deletes a journal entry by ID.
 *     tags:
 *       - Journal
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Journal entry UUID.
 *     responses:
 *       200:
 *         description: Journal entry deleted.
 *       400:
 *         description: Missing entry ID.
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
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }

    await deleteJournalEntry(id, user.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}