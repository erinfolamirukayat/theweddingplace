const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
import { getToken } from './authApi';

// Helper for handling responses
async function handleResponse(res: Response) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'API Error');
  }
  return res.json();
}

// Registries
export async function createRegistry(data: {
  couple_names: string;
  wedding_date: string;
  story?: string;
  photo_url?: string;
  phone: string;
  wedding_city?: string;
  first_name?: string;
  last_name?: string;
  how_heard?: string;
}): Promise<any> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/registries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getRegistries(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/registries`);
  return handleResponse(res);
}

export async function getRegistryById(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/registries/${id}`);
  return handleResponse(res);
}

export async function getMyRegistries(): Promise<any[]> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/registries/my`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return handleResponse(res);
}

export async function getRegistryByShareUrl(shareUrl: string): Promise<any> {
  const res = await fetch(`${API_BASE}/registries/share/${shareUrl}`);
  return handleResponse(res);
}

export async function updateRegistry(id: string, data: {
  couple_names: string;
  wedding_date: string;
  story?: string;
  phone?: string;
  wedding_city?: string;
}): Promise<any> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/registries/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Products
export async function getProducts(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/products`);
  return handleResponse(res);
}

export async function addRegistryItem(registryId: string, productId: number, quantity: number = 1): Promise<any> {
  const res = await fetch(`${API_BASE}/registries/${registryId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  return handleResponse(res);
}

export async function getRegistryPictures(registryId: string): Promise<any[]> {
  const res = await fetch(`${API_BASE}/registries/${registryId}/pictures`);
  return handleResponse(res);
}

export async function addRegistryPicture(registryId: string, imageUrl: string): Promise<any> {
  const res = await fetch(`${API_BASE}/registries/${registryId}/pictures`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl }),
  });
  return handleResponse(res);
}

export async function removeRegistryPicture(registryId: string, imageUrl: string): Promise<any> {
  const res = await fetch(`${API_BASE}/registries/${registryId}/pictures/${encodeURIComponent(imageUrl)}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
} 