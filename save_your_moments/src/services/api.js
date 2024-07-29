import axios from "axios";

const API_URL = "http://127.0.0.1:8000/";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const getAlbums = () => {
  setAuthToken(localStorage.getItem("accessToken"));
  return api.get("app/user-albums/").then((response) => response.data);
};
export const createAlbum = (name) => {
  setAuthToken(localStorage.getItem("accessToken"));
  return api.post("app/album/", { name }).then((response) => response.data);
};
export const getPhotos = () => {
  setAuthToken(localStorage.getItem("accessToken"));
  return api.get("app/user-photos/").then((response) => response.data);
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

export default api;
