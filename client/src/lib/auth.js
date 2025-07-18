// src/lib/auth.js
export function setAuthToken(token) {
  localStorage.setItem("authToken", token);
}

export function getAuthToken() {
  return localStorage.getItem("authToken");
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

export function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "/login";
}
