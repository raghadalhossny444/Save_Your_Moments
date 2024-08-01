import axios from "axios";
import { logout } from "../services/auth";
const API_URL = "http://127.0.0.1:8000/";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.log("Unauthorized or Forbidden. Logging out...");
      logout();
    }
    return Promise.reject(error);
  }
);
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const getAlbums = () => {
  setAuthToken(localStorage.getItem("accessToken"));
  return api.get("app/albums/").then((response) => response.data);
};
export const createAlbum = (name, coverPhoto) => {
  setAuthToken(localStorage.getItem("accessToken"));
  const formData = new FormData();
  formData.append("name", name);
  if (coverPhoto) {
    formData.append("cover_photo", coverPhoto);
  }

  return api
    .post("app/albums/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
};
export const getPhotos = (albumId) => {
  setAuthToken(localStorage.getItem("accessToken"));
  return api
    .get("app/photos/?album=" + albumId)
    .then((response) => response.data);
};
export const uploadPhoto = (file, albumId, onProgress) => {
  setAuthToken(localStorage.getItem("accessToken"));
  const formData = new FormData();
  formData.append("photo", file);
  formData.append("album", albumId);

  return api
    .post("app/photo/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      },
    })
    .then((response) => response.data);
};
export const uploadPhotos = (
  files,
  albumId,
  useLLMVision,
  onProgress = () => {},
  lang
) => {
  setAuthToken(localStorage.getItem("accessToken"));
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`photos[${index}]`, file);
  });
  console.log(formData.get("photos"));
  formData.append("album", albumId);
  formData.append("use_llm_vision", useLLMVision);
  formData.append("lang", lang);
  return api
    .post("app/photos/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      },
    })
    .then((response) => response.data);
};
// New function to poll photo status
export const getPhotoStatus = (photoId) => {
  setAuthToken(localStorage.getItem("accessToken"));
  return api
    .get(`app/photos/status/${photoId}/`)
    .then((response) => response.data);
};

export const deletePhoto = async (photoId) => {
  try {
    const response = await api.delete(`app/photos/${photoId}/`);
    if (response.status === 204) {
      // Handle successful deletion
      console.log("Photo deleted successfully.");
    }
  } catch (error) {
    console.error("Error deleting photo:", error);
  }
};
export default api;
