import { getConfig } from '../config';

const API_URL = getConfig().apiUrl;

/**
 * A reusable, authenticated fetch wrapper.
 * It automatically adds the Authorization header and handles 401 errors.
 * @param endpoint The API endpoint to call (e.g., '/users/me').
 * @param options The options for the fetch request.
 */
const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  console.log(`authFetch called for endpoint: ${endpoint}. Checking for token...`);
  // Use 'afriwed_token' or your specific key for the auth token.
  const token = localStorage.getItem('token');
  console.log('Token found in authFetch:', localStorage.getItem('token'));

  // If there's no token, don't even attempt the request.
  // This prevents a 401 error on the server and an immediate logout loop.
  if (!token) {
    // This error will be caught by the calling function's try/catch block.
    throw new Error('Unauthorized in authFetch: No token found');
  }

  const headers = new Headers(options.headers || {});

  // The browser will automatically set the Content-Type for FormData.
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token is invalid or expired. Log the user out.
    localStorage.removeItem('token');
    localStorage.removeItem('afriwed_registry_id');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
    throw new Error(errorData.error || response.statusText);
  }

  // Handle responses with no content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

/**
 * A reusable fetch wrapper for public endpoints.
 * @param endpoint The API endpoint to call.
 * @param options The options for the fetch request.
 */
const publicFetch = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
    throw new Error(errorData.error || response.statusText);
  }
  return response.json();
};

// --- Registry ---
export const getRegistries = () => publicFetch('/registries');
export const getMyRegistries = () => authFetch('/registries/mine');
export const getRegistryById = (id: string) => publicFetch(`/registries/${id}`);
export const getRegistryByShareUrl = (shareUrl: string) => publicFetch(`/registries/share/${shareUrl}`);
export const createRegistry = (data: { couple_names: string; wedding_date: string; story: string; phone: string; wedding_city: string; }) => authFetch('/registries', {
  method: 'POST',
  body: JSON.stringify(data),
});
export const updateRegistry = (id: string, data: any) => authFetch(`/registries/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});

// --- Registry Pictures ---
export const getRegistryPictures = (registryId: string) => publicFetch(`/registries/${registryId}/pictures`);
export const addRegistryPicture = (registryId: string, imageUrl: string) => authFetch(`/registries/${registryId}/pictures`, {
  method: 'POST',
  body: JSON.stringify({ image_url: imageUrl }),
});
export const removeRegistryPicture = (registryId: string, imageUrl: string) => authFetch(`/registries/${registryId}/pictures/${encodeURIComponent(imageUrl)}`, {
  method: 'DELETE',
});

// --- Image Uploads ---
export const uploadImageFile = (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  return authFetch('/upload/image', { method: 'POST', body: formData });
};
export const uploadImageFromUrl = (url: string) => authFetch('/upload/image-from-url', { method: 'POST', body: JSON.stringify({ url }) });

// --- Products & Items ---
export const getProducts = () => publicFetch('/products');
export const getRegistryItems = (registryId: string) => publicFetch(`/registries/${registryId}/items`);
export const getRegistryItemByShareUrl = (shareUrl: string, itemId: string) => publicFetch(`/registries/share/${shareUrl}/items/${itemId}`);
export const addRegistryItem = (registryId: string, data: { product_id: number; quantity: number }) => authFetch(`/registries/${registryId}/items`, {
  method: 'POST',
  body: JSON.stringify(data),
});

// --- User ---
export const getMe = () => authFetch('/auth/users/me');
export const updateMe = (data: { first_name: string; last_name: string; how_heard: string; }) => authFetch('/auth/users/me', {
  method: 'PUT',
  body: JSON.stringify(data),
});