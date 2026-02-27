import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// ─── Auth ────────────────────────────────────────
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);

// ─── Profile ─────────────────────────────────────
export const updateLaborerProfile = (userId, data) =>
  API.put(`/profile/laborer?userId=${userId}`, data);

export const updateThekedarProfile = (userId, data) =>
  API.put(`/profile/thekedar?userId=${userId}`, data);

// ─── Jobs ────────────────────────────────────────
export const createJob = (thekedarId, data) =>
  API.post(`/jobs?thekedarId=${thekedarId}`, data);

export const getNearbyJobs = (laborerId) =>
  API.get(`/jobs/nearby?laborerId=${laborerId}`);

export const applyToJob = (jobId, laborerId) =>
  API.post(`/jobs/${jobId}/apply?laborerId=${laborerId}`);

export const panicButton = (jobId, thekedarId) =>
  API.post(`/jobs/${jobId}/panic?thekedarId=${thekedarId}`);

// ─── Groups ──────────────────────────────────────
export const createGroup = (thekedarId, data) =>
  API.post(`/groups?thekedarId=${thekedarId}`, data);

export const addLaborerToGroup = (groupId, laborerId) =>
  API.post(`/groups/${groupId}/add-laborer?laborerId=${laborerId}`);

export const assignTask = (groupId, data) =>
  API.post(`/groups/${groupId}/task`, data);

export const getGroups = (userId, role) =>
  API.get(`/groups?userId=${userId}&role=${role}`);

// ─── Tasks ───────────────────────────────────────
export const getTodayTasks = (laborerId) =>
  API.get(`/tasks/today?laborerId=${laborerId}`);

// ─── Chat ────────────────────────────────────────
export const getGroupMessages = (groupId) =>
  API.get(`/chat/${groupId}/messages`);

export const sendGroupMessage = (groupId, data) =>
  API.post(`/chat/${groupId}/messages`, data);

export default API;
