import supabaseAdmin from "../supabase/admin";

export async function getJournalEntriesByUserId(userId) {
  const { data, error } = await supabaseAdmin
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createJournalEntry(userId, entryData) {
  const { data, error } = await supabaseAdmin
    .from('journal_entries')
    .insert([{ ...entryData, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateJournalEntry(id, userId, updates) {
  const { data, error } = await supabaseAdmin
    .from('journal_entries')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteJournalEntry(id, userId) {
  const { error } = await supabaseAdmin
    .from('journal_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
  return true;
}