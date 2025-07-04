import {jwtDecode} from "jwt-decode";

export const checkTokenExpiry = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (err) {
    return true;
  }
};
