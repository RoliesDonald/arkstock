interface RequestOptions extends RequestInit {
  token?: string;
}

// Fungsi helper untuk mendapatkan token dari localStorage
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt_token");
  }
  return null;
}

// Fungsi fetch yang sudah terotentikasi
export async function authenticatedFetch<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = options.token || getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers, // Izinkan custom headers
  };

  if (token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        errorData.message || "Unauthorized: Token tidak valid atau sesi habis."
      );
    }
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// helper untuk setiap metode HTTP
export const api = {
  get: <T>(url: string, options?: RequestOptions) =>
    authenticatedFetch<T>(url, { method: "GET", ...options }),
  post: <T>(url: string, data: any, options?: RequestOptions) =>
    authenticatedFetch<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    }),
  put: <T>(url: string, data: any, options?: RequestOptions) =>
    authenticatedFetch<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    }),
  delete: <T>(url: string, options?: RequestOptions) =>
    authenticatedFetch<T>(url, { method: "DELETE", ...options }),
};
