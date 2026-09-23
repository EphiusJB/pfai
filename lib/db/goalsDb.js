import supabaseAdmin from "../supabase/admin";

export async function getGoalsByUserId(userId) {
  const { data, error } = await supabaseAdmin
    .from('goals')
    .select('*,milestones(*, tasks(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createGoal(userId, goalData) {
  console.log(goalData);
  const { data, error } = await supabaseAdmin
    .from('goals')
    .insert([{ ...goalData, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGoal(id, userId, updates) {
  const { data, error } = await supabaseAdmin
    .from('goals')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGoal(id, userId) {
  const { error } = await supabaseAdmin
    .from('goals')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
  return true;
}