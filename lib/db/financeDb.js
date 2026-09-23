import supabaseAdmin from "../supabase/admin";

export async function getTransactionsByUserId(userId) {
  const { data, error } = await supabaseAdmin
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createTransaction(userId, transactionData) {
  const { data, error } = await supabaseAdmin
    .from('transactions')
    .insert([{ ...transactionData, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTransaction(id, userId, updates) {
  const { data, error } = await supabaseAdmin
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTransaction(id, userId) {
  const { error } = await supabaseAdmin
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
  return true;
}