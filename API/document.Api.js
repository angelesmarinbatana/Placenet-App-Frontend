import api from './api';

/*
api function for document endpoint 
*/

//get all 
export const getAllProjects = () => api.get('/projects');

//upload
export const uploadDocument = (documentData) => api.post('/documents', documentData, {
    headers: {
        'Content-Type': 'multipart/form-data'  // required for file uploads
    }
});