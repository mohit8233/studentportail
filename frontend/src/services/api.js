import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});



/* ================= COURSE APIs ================= */

export const createCourseApi = (data) => {
  return api.post("/courses/create", data);
};

export const getAllCoursesApi = () => {
  return api.get("/courses/getAll");
};

export const updateCourseApi = (id, data) => {
  return api.patch(`/courses/update/${id}`, data);
};

export const deleteCourseApi = (id) => {
  return api.delete(`/courses/delete/${id}`);
};



/* ================= SUBJECT APIs ================= */

export const createSubjectApi = (data) => {
  return api.post("/subjects/create", data);
};

export const getSubjectsByCourseApi = (courseId) => {
  return api.get(`/subjects/course/${courseId}`);
};

export const updateSubjectApi = (id, data) => {
  return api.patch(`/subjects/update/${id}`, data);
};

export const deleteSubjectApi = (id) => {
  return api.delete(`/subjects/delete/${id}`);
};



/* ================= TOPIC APIs ================= */

export const createTopicApi = (data) => {
  return api.post("/topics/create", data);
};

export const getTopicsBySubjectApi = (subjectId) => {
  return api.get(`/topics/subject/${subjectId}`);
};

export const updateTopicApi = (id, data) => {
  return api.patch(`/topics/update/${id}`, data);
};

export const deleteTopicApi = (id) => {
  return api.delete(`/topics/delete/${id}`);
};



export default api;