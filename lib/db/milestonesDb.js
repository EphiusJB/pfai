import supabaseAdmin from "../supabase/admin";

/**
 * Verify that the goal belongs to the specified user
 */
async function verifyGoalOwnership(goalId, userId) {
  const { data, error } = await supabaseAdmin
    .from('goals')
    .select('id')
    .eq('id', goalId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    throw new Error('Unauthorized access or goal not found');
  }
}

export async function getMilestonesByGoalId(goalId, userId) {
  await verifyGoalOwnership(goalId, userId);

  const { data, error } = await supabaseAdmin
    .from('milestones')
    .select('*, tasks(*)')
    .eq('goal_id', goalId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createMilestone(userId, milestoneData) {
  const { goal_id } = milestoneData;
  if (!goal_id) throw new Error('goal_id is required to create a milestone');

  await verifyGoalOwnership(goal_id, userId);

  const { data, error } = await supabaseAdmin
    .from('milestones')
    .insert([milestoneData])
    .select('*, tasks(*)')
    .single();

  if (error) throw error;
  return data;
}

export async function updateMilestone(id, userId, updates) {
  // First verify milestone exists and user owns parent goal
  const { data: milestone, error: fetchError } = await supabaseAdmin
    .from('milestones')
    .select('goal_id')
    .eq('id', id)
    .single();

  if (fetchError || !milestone) throw new Error('Milestone not found');
  await verifyGoalOwnership(milestone.goal_id, userId);

  const { data, error } = await supabaseAdmin
    .from('milestones')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMilestone(id, userId) {
  const { data: milestone, error: fetchError } = await supabaseAdmin
    .from('milestones')
    .select('goal_id')
    .eq('id', id)
    .single();

  if (fetchError || !milestone) throw new Error('Milestone not found');
  await verifyGoalOwnership(milestone.goal_id, userId);

  const { error } = await supabaseAdmin
    .from('milestones')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}