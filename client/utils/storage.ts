// Types for our data
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  suggestedAmount: number;
}
export interface Registry {
  id: string;
  coupleNames: string;
  weddingDate: string;
  story: string;
  items: RegistryItem[];
  shareUrl?: string;
  pictures: string[]; // Array of image URLs
}
export interface RegistryItem {
  id: string;
  productId: string;
  quantity: number;
  contributionsReceived: number;
  isFullyFunded: boolean;
  contributors: Contributor[];
}
export interface Contributor {
  name: string;
  amount: number;
  message?: string;
  date: string;
}
// Local storage keys
const REGISTRY_STORAGE_KEY = 'afriwed_registries';
const PRODUCTS_STORAGE_KEY = 'afriwed_products';
// Sample product data
const sampleProducts: Product[] = [{
  id: "1",
  name: "Traditional Clay Cooking Set",
  category: "Kitchenware",
  description: "Handcrafted clay cooking pots, perfect for traditional African dishes",
  price: 150,
  imageUrl: "https://images.unsplash.com/photo-1604771240470-124b6144b410?auto=format&fit=crop&q=80",
  suggestedAmount: 50
}, {
  id: "2",
  name: "Ankara Print Bedding Set",
  category: "Bedding",
  description: "Queen-size bedding set with traditional Ankara patterns",
  price: 200,
  imageUrl: "https://images.unsplash.com/photo-1629624927838-3b39b7fdd00c?auto=format&fit=crop&q=80",
  suggestedAmount: 75
}, {
  id: "3",
  name: "Modern African Dining Set",
  category: "Furniture",
  description: "6-seater dining set with African-inspired designs",
  price: 800,
  imageUrl: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80",
  suggestedAmount: 100
}];
// Initialize products if they don't exist
if (!localStorage.getItem(PRODUCTS_STORAGE_KEY)) {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(sampleProducts));
}
// Helper functions for registries
export const getRegistries = (): Registry[] => {
  const data = localStorage.getItem(REGISTRY_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
export const getRegistryById = (id: string): Registry | undefined => {
  const registries = getRegistries();
  return registries.find(r => r.id === id);
};
export const createRegistry = (registry: Registry): void => {
  const registries = getRegistries();
  registries.push(registry);
  localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(registries));
};
export const updateRegistry = (updatedRegistry: Registry): void => {
  const registries = getRegistries();
  const index = registries.findIndex(r => r.id === updatedRegistry.id);
  if (index !== -1) {
    registries[index] = updatedRegistry;
    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(registries));
  }
};
// Helper functions for products
export const getProducts = (): Product[] => {
  const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
export const getProductById = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.id === id);
};
// Helper function for generating unique IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
// Helper function for formatting currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount);
};