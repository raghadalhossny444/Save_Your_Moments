import api, { setAuthToken } from "./api";

export const login = async (email, password) => {
  const response = await api.post("api/token/", { email, password });
  const { access, refresh } = response.data;
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
  setAuthToken(access);
  return response.data;
};

export const signUp = async (email, password, username) => {
  const response = await api.post("app/sign-up", {
    email,
    password,
    user_name: username,
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  setAuthToken(null);
  window.location.href = "/"; // Redirect to home page or any other page
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    try {
      const response = await api.post("api/token/refresh/", {
        refresh: refreshToken,
      });
      const { access } = response.data;
      localStorage.setItem("accessToken", access);
      setAuthToken(access);
      return access;
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
    }
  }
  return null;
};
