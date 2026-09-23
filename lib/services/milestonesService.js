import { useAuthStore } from "../store/AuthStore";

const BASE_URL = '/api/v1/milestones';

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

export async function fetchMilestonesByGoalId(goalId) {
  const headers = getAuthHeaders();
  if (!headers) return;

  const response = await fetch(`${BASE_URL}?goal_id=${encodeURIComponent(goalId)}`, {
    method: 'GET',
    headers,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch milestones');
  }
  return result.data;
}

export async function createMilestone(milestoneData) {
  const headers = getAuthHeaders();
  if (!headers) return;

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(milestoneData),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to create milestone');
  }
  return result.data;
}

export async function updateMilestone(id, updates) {
  const headers = getAuthHeaders();
  if (!headers) return;

  const response = await fetch(BASE_URL, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ id, ...updates }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to update milestone');
  }
  return result.data;
}

export async function deleteMilestone(id) {
  const headers = getAuthHeaders();
  if (!headers) return;

  const response = await fetch(`${BASE_URL}?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to delete milestone');
  }
  return result.success;
}