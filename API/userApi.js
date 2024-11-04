import api from './api';

/*
api function for user endpoint 
*/

//create
export const createUser = (userData) => api.post('/users', userData);

//get all 
export const getAllUsers = () => api.get('/users');

//get 1
export const getUser = (userId) => api.get(`/users/${userId}`);

//update
export const updateUser = (userId, userData) => api.put(`/users/${userId}`, userData);

//delete
export const deleteUser = (userId) => api.delete(`/users/${userId}`);
