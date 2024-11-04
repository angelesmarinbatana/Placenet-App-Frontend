import api from './api';

/*
api function for user endpoint 
*/

//create
export const createProject = (projectData) => api.post('/projects', projectData);

//get all 
export const getAllProjects = () => api.get('/projects');

//get 1
export const getProject = (projectId) => api.get(`/projects/${projectId}`);

//update
export const updateProject = (projectId, projectData) => api.put(`/projects/${projectId}`, projectData);

//delete
export const deleteProject = (projectId) => api.delete(`/projects/${projectId}`);
