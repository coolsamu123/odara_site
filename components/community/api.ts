const API_BASE = '/api/v1';

function getToken(): string | null {
  return localStorage.getItem('odara_token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

// Auth
export async function register(data: {
  email: string;
  password: string;
  name: string;
  country: string;
  company: string;
  telephone?: string;
}) {
  const result = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  localStorage.setItem('odara_token', result.access_token);
  localStorage.setItem('odara_user', JSON.stringify(result.user));
  return result;
}

export async function login(email: string, password: string) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('odara_token', data.access_token);
  localStorage.setItem('odara_user', JSON.stringify(data.user));
  return data;
}

export function logout() {
  localStorage.removeItem('odara_token');
  localStorage.removeItem('odara_user');
}

export function getCurrentUser() {
  const raw = localStorage.getItem('odara_user');
  return raw ? JSON.parse(raw) : null;
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// Profile
export async function updateProfile(data: { name?: string; avatar_url?: string; country?: string; company?: string; telephone?: string }) {
  const result = await request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  localStorage.setItem('odara_user', JSON.stringify(result));
  return result;
}

export async function changePassword(current_password: string, new_password: string) {
  return request('/auth/password', {
    method: 'PUT',
    body: JSON.stringify({ current_password, new_password }),
  });
}

// Posts
export async function listPosts(category?: string, status?: string, page = 1) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (status) params.set('status', status);
  params.set('page', String(page));
  params.set('limit', '20');
  return request(`/posts?${params.toString()}`);
}

export async function getPost(id: number) {
  return request(`/posts/${id}`);
}

export async function createPost(data: { category: string; title: string; body: string; priority?: string }) {
  return request('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePost(id: number, data: { title?: string; body?: string; status?: string; priority?: string }) {
  return request(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePost(id: number) {
  return request(`/posts/${id}`, { method: 'DELETE' });
}

// Comments
export async function createComment(postId: number, body: string) {
  return request(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

export async function deleteComment(id: number) {
  return request(`/comments/${id}`, { method: 'DELETE' });
}

// Votes
export async function toggleVote(postId: number) {
  return request(`/posts/${postId}/vote`, { method: 'POST' });
}

// Stats
export async function getStats() {
  return request('/stats');
}

// Admin: User Management
export async function listUsers(page = 1, search = '') {
  const params = new URLSearchParams();
  params.set('page', String(page));
  if (search) params.set('search', search);
  return request(`/users?${params.toString()}`);
}

export async function deleteUser(id: number | string) {
  return request(`/users/${id}`, { method: 'DELETE' });
}

export async function resetUserPassword(id: number | string) {
  return request(`/users/${id}/reset-password`, { method: 'POST' });
}

// Image Upload
export async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const result = await request('/posts/image', {
          method: 'POST',
          body: JSON.stringify({ image_data: reader.result }),
        });
        // result.url is something like /api/v1/uploads/uuid.png
        // We need to make sure the frontend can load it.
        // Since it's a relative path starting with /api/v1, it will go through the proxy if dev server, or direct if prod.
        resolve(result.url);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
