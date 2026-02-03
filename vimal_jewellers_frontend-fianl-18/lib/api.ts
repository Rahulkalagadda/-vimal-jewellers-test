// lib/api.ts
// Helper to replace localhost URLs with production URLs
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://vimal-jewellers-test-4k3l.vercel.app/api";
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://vimal-jewellers-test-4k3l.vercel.app";

if (!API_URL) {
  console.warn("NEXT_PUBLIC_API_URL is missing in environment variables.");
}


export function sanitizeData(data: any): any {
  if (typeof data === 'string') {
    // If running typically, API_URL might be localhost. 
    // We want to replace ANY hardcoded backend URL (Prod or Local) with the current environment's URL.

    // 1. Replace Prod API URL -> Current API URL
    let sanitized = data.replace(/https:\/\/backend\.vimaljewellers\.com\/api/g, API_URL);
    // 2. Replace Prod Root URL -> Current Root URL (for images)
    sanitized = sanitized.replace(/https:\/\/backend\.vimaljewellers\.com/g, BACKEND_URL);



    return sanitized;
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }
  if (typeof data === 'object' && data !== null) {
    const newData: any = {};
    for (const key in data) {
      newData[key] = sanitizeData(data[key]);
    }
    return newData;
  }
  return data;
}

// Fetch all products from backend API
export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return sanitizeData(await res.json());
}

// Fetch a product by ID from backend API
export async function fetchProductById(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return sanitizeData(await res.json());
}

// Fetch all categories from backend API
export async function fetchCategories() {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return sanitizeData(await res.json());
}

// Fetch all collections from backend API
export async function fetchCollections() {
  const res = await fetch(`${API_URL}/collections`);
  if (!res.ok) throw new Error("Failed to fetch collections");
  return sanitizeData(await res.json());
}

// Fetch a product by slug from backend API
export async function fetchProductBySlug(slug: string | undefined): Promise<any> {
  try {
    if (!slug || slug === 'undefined') {
      console.error('Invalid slug provided:', slug);
      return null;
    }

    const res = await fetch(`${API_URL}/products/slug/${encodeURIComponent(slug)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        console.log(`Product not found with slug: ${slug}`);
        return null;
      }
      const errorData = await res.json();
      throw new Error(errorData.message || `Failed to fetch product with slug: ${slug}`);
    }

    const data = await res.json();
    if (!data || Object.keys(data).length === 0) {
      console.log(`No data received for slug: ${slug}`);
      return null;
    }

    return sanitizeData(data);
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function signupUser(data: { username: string; email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function signinUser(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function fetchHomeData() {
  try {
    const targetUrl = `${API_URL}/home`;
    console.log("DEBUG: Fetching Home Data from:", targetUrl);
    const res = await fetch(targetUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch home data: ${res.status}`);
    return sanitizeData(await res.json());
  } catch (error) {
    console.error("Error fetching home data:", error);
    return null;
  }
}

export async function fetchMegaMenu() {
  try {
    const targetUrl = `${API_URL}/mega-menu`;
    console.log("DEBUG: Fetching Mega Menu from:", targetUrl);
    const res = await fetch(targetUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch mega menu: ${res.status}`);
    return sanitizeData(await res.json());
  } catch (error) {
    console.error("Error fetching mega menu:", error);
    return [];
  }
}

export async function fetchCategoryDetails(slug: string, params?: URLSearchParams) {
  const queryString = params ? `?${params.toString()}` : '';
  const res = await fetch(`${API_URL}/categories/${slug}${queryString}`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch category details");
  return sanitizeData(await res.json());
}

export async function fetchShopForDetails(id: string) {
  const res = await fetch(`${API_URL}/mega-menu/shop-for/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch shop for details");
  return sanitizeData(await res.json());
}

export async function fetchPage(slug: string) {
  const res = await fetch(`${API_URL}/pages/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch page");
  }
  return res.json();
}

export async function fetchSettings() {
  const res = await fetch(`${API_URL}/settings`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch settings");
  }
  return res.json();
}

export async function bookAppointment(data: any) {
  const res = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to book appointment");
  }
  return res.json();
}

export async function fetchFooterConfigs() {
  try {
    const res = await fetch(`${API_URL}/footer-configs`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch footer configs');
    const data = await res.json();
    return sanitizeData(data);
  } catch (error) {
    console.error('Error fetching footer configs:', error);
    return [];
  }
}
