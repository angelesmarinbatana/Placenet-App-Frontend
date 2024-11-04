import api from './api';

/*
api function for property endpoint 
*/

//create
export const createProperty = (propertyData) => api.post('/properties', propertyData);

//get all 
export const getAllProperties = () => api.get('/properties');

//get 1
export const getProperty = (propertyId) => api.get(`/properties/${propertyId}`);

//update
export const updateProperty = (propertyId, propertyData) => api.put(`/properties/${propertyId}`, propertyData);

//delete
export const deleteProperty = (propertyId) => api.delete(`/properties/${propertyId}`);
