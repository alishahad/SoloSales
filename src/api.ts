export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(endpoint, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Handle unauthorized (redirect to login handled by context/app logic usually)
    // For now just throw
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || `Error ${res.status}`);
  }

  return res.json();
}
