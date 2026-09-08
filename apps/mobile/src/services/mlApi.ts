import AsyncStorage from '@react-native-async-storage/async-storage';

export type MLRecommendation = {
  exercise_id: string;
  title: string;
  area: string;
  skill: string;
  difficulty: number;
  rule_score: number;
  ml_score: number | null;
  hybrid_score: number;
  explanation: string;
};

export type MLRecommendationResponse = {
  user_id: string;
  model_version: string | null;
  model_readiness: string;
  ml_available: boolean;
  fallback_reason: string | null;
  recommendations: MLRecommendation[];
};

const API_URL = (process.env.EXPO_PUBLIC_ML_API_URL || 'http://127.0.0.1:8001').replace(/\/$/, '');
const jsonHeaders = { 'Content-Type': 'application/json' };

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { ...init, headers: { ...jsonHeaders, ...(init.headers || {}) } });
  if (!response.ok) throw new Error((await response.text()) || `ML request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export async function checkMLHealth() {
  return request<{ status: string; trained_models: string[]; ensemble_available: boolean }>('/health');
}

export async function syncMLProfile(userId: string, profile?: any) {
  return request(`/users/profile`, {
    method: 'PUT',
    body: JSON.stringify({ user_id: userId, selected_areas: [], selected_skills: [], goals: [], preferences: { displayName: profile?.displayName || '' } }),
  });
}

export async function getMLRecommendations(userId: string, options: { limit?: number; requestedArea?: string; requestedSkill?: string; text?: string } = {}) {
  return request<MLRecommendationResponse>('/recommend', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, limit: options.limit || 3, requested_area: options.requestedArea || null, requested_skill: options.requestedSkill || null, text: options.text || null, current_context: null }),
  });
}

export async function sendMLEvent(event: unknown) {
  return request('/events', { method: 'POST', body: JSON.stringify(event) });
}

export async function getMLUserId() {
  const key = 'swa-ml-user-id-v1';
  let id = await AsyncStorage.getItem(key);
  if (!id) {
    id = `user_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
    await AsyncStorage.setItem(key, id);
  }
  return id;
}
