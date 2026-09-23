import { useAuthStore } from "../store/AuthStore";

const BASE_URL = '/api/v1/tasks';

/**
 * Helper to get the auth header using Zustand store
 */
function getAuthHeaders() {
  const session = useAuthStore.getState().session;
  const token = session?.access_token;

  if (!token) {
    console.error("No active session token found");
    return null;
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchTasksByMilestoneId(milestoneId) {
  const headers = getAuthHeaders();
  if (!headers) return;

  const response = await fetch(`${BASE_URL}?milestone_id=${encodeURIComponent(milestoneId)}`, {
    method: 'GET',
    headers,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch tasks');
  }
  return result.data;
}

export async function createTask(taskData) {
  const headers = getAuthHeaders();
  if (!headers) return;

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(taskData),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to create task');
  }
  return result.data;
}

export async function updateTask(id, updates) {
  const headers = getAuthHeaders();
  if (!headers) return;

  const response = await fetch(BASE_URL, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ id, ...updates }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to update task');
  }
  return result.data;
}

export async function deleteTask(id) {
  const headers = getAuthHeaders();
  if (!headers) return;

  const response = await fetch(`${BASE_URL}?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to delete task');
  }
  return result.success;
}