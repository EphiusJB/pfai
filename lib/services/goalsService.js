import { useAuthStore } from "../store/AuthStore";

const BASE_URL = '/api/v1/goals';

export async function fetchGoals() {
  const session = useAuthStore.getState().session;
  const token = session?.access_token;

  if (!token) {
    console.error("No active session token found");
    return;
  }
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch goals');
  }
  return result.data;
}

export async function createGoal(goalData) {
  const session = useAuthStore.getState().session;
  const token = session?.access_token;

  if (!token) {
    console.error("No active session token found");
    return;
  }
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(goalData),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to create goal');
  }
  return result.data;
}

export async function updateGoal(id, updates) {
  const session = useAuthStore.getState().session;
  const token = session?.access_token;

  if (!token) {
    console.error("No active session token found");
    return;
  }
  const response = await fetch(BASE_URL, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, ...updates }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to update goal');
  }
  return result.data;
}

export async function deleteGoal(id) {
  const session = useAuthStore.getState().session;
  const token = session?.access_token;

  if (!token) {
    console.error("No active session token found");
    return;
  }
  const response = await fetch(`${BASE_URL}?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to delete goal');
  }
  return result.success;
}