import { useAuthStore } from "../store/AuthStore";

const BASE_URL = "/api/v1/journal";

export async function fetchJournalEntries() {
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
    throw new Error(result.error || "Failed to fetch journal entries");
  }
  return result.data;
}

export async function createJournalEntry(entryData) {
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
    body: JSON.stringify(entryData),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Failed to create journal entry");
  }
  return result.data;
}

export async function updateJournalEntry(id, updates) {
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
    throw new Error(result.error || "Failed to update journal entry");
  }
  return result.data;
}

export async function deleteJournalEntry(id) {
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
    throw new Error(result.error || "Failed to delete journal entry");
  }
  return result.success;
}
