// src/services/authHelpers.js
export function getAuthToken() {
  try {
    // whichever key you used in AuthContext/main earlier — adjust if different
    return localStorage.getItem('token') || null;
  } catch (e) {
    return null;
  }
}
