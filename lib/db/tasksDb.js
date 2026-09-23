import supabaseAdmin from "../supabase/admin";

/**
 * Verify task ownership up through milestone -> goal -> user
 */
async function verifyMilestoneOwnership(milestoneId, userId) {
  const { data: milestone, error: milestoneError } = await supabaseAdmin
    .from('milestones')
    .select('goal_id, goals!inner(user_id)')
    .eq('id', milestoneId)
    .single();

  if (milestoneError || !milestone || milestone.goals?.user_id !== userId) {
    throw new Error('Unauthorized access or milestone not found');
  }
}

export async function getTasksByMilestoneId(milestoneId, userId) {
  await verifyMilestoneOwnership(milestoneId, userId);

  const { data, error } = await supabaseAdmin
    .from('tasks')
    .select('*')
    .eq('milestone_id', milestoneId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createTask(userId, taskData) {
  const { milestone_id } = taskData;
  if (!milestone_id) throw new Error('milestone_id is required to create a task');

  await verifyMilestoneOwnership(milestone_id, userId);

  const { data, error } = await supabaseAdmin
    .from('tasks')
    .insert([taskData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTask(id, userId, updates) {
  const { data: task, error: fetchError } = await supabaseAdmin
    .from('tasks')
    .select('milestone_id')
    .eq('id', id)
    .single();

  if (fetchError || !task) throw new Error('Task not found');
  await verifyMilestoneOwnership(task.milestone_id, userId);

  const { data, error } = await supabaseAdmin
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTask(id, userId) {
  const { data: task, error: fetchError } = await supabaseAdmin
    .from('tasks')
    .select('milestone_id')
    .eq('id', id)
    .single();

  if (fetchError || !task) throw new Error('Task not found');
  await verifyMilestoneOwnership(task.milestone_id, userId);

  const { error } = await supabaseAdmin
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}