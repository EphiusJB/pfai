import { useAuthStore } from "../store/AuthStore";

const BASE_URL = "/api/v1/finance";

export async function fetchTransactions() {
  // Grab current access token from Zustand store
  const session = useAuthStore.getState().session;
  const token = session?.access_token;

  if (!token) {
    console.error("No active session token found");
    return;
  }
  const response = await fetch(BASE_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, 
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch transactions");
  }
  return result.data;
}

export async function createTransaction(transactionData) {
  const session = useAuthStore.getState().session;
  const token = session?.access_token;

  if (!token) {
    console.error("No active session token found");
    return;
  }
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(transactionData),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Failed to create transaction");
  }
  return result.data;
}

export async function updateTransaction(id, updates) {
  const session = useAuthStore.getState().session;
  const token = session?.access_token;

  if (!token) {
    console.error("No active session token found");
    return;
  }
  const response = await fetch(BASE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, ...updates }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Failed to update transaction");
  }
  return result.data;
}

export async function deleteTransaction(id) {
  const session = useAuthStore.getState().session;
  const token = session?.access_token;

  if (!token) {
    console.error("No active session token found");
    return;
  }
  const response = await fetch(`${BASE_URL}?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Failed to delete transaction");
  }
  return result.success;
}
