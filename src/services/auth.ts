export const loginApi = async (username: string, password: string) => {
  // In a real scenario, we would post to the backend:
  // return fetchApi<{ token: string; user: any }>('/login', {
  //   method: 'POST',
  //   body: JSON.stringify({ username, password }),
  // });

  // Since we skipped Phase 3 (backend), we mock it.
  return new Promise<{
    token: string;
    user: { id: string; username: string; name: string };
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        token: `mock-jwt-token-${Date.now()}`,
        user: { id: "1", username, name: "SuperAdmin" },
      });
    }, 1000);
  });
};
