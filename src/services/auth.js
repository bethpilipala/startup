import strings from "../strings/en.js";

export async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`/api${path}`, {
      credentials: "same-origin",
      ...options,
    });
  } catch {
    throw new Error(strings.login.connectionError);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = [502, 503, 504].includes(response.status)
      ? strings.login.serviceUnavailable
      : body?.msg || strings.login.requestError;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}

function submitCredentials(path, email, password) {
  return request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export const register = (email, password) => submitCredentials("/auth/create", email, password);
export const login = (email, password) => submitCredentials("/auth/login", email, password);
export const logout = () => request("/auth/logout", { method: "DELETE" });
export const getCurrentUser = () => request("/user/me");
