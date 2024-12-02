import axios from "axios";
import { Alert } from "react-native";
import * as SecureStore from 'expo-secure-store';


//base config to make requests w axios


const api = axios.create({
    //baseURL: 'http://10.190.188.128:3000/api', //home
    baseURL: 'http://10.222.82.59:3000/api',//school
   timeout: 10000, //10 secs
});


//need jwt in auth header:
api.interceptors.request.use(async(config) =>{
   const token = await SecureStore.getItemAsync('userToken');
   if (token) {
    console.log('adding token to request:', token);
    config.headers.Authorization = `Bearer ${token}`;
   }else{
    console.log('no token found');
   }
   return config;
}, (error) => {
   return Promise.reject(error);
});


//handle tokens expiring:
api.interceptors.response.use(
   (response) => response, //success
   async (error) => {
       if (error.response) {
           if (error.response.status === 401 || error.response.status === 403) {
               console.log('Token expired or invalid. Logging out...');
               if (error.config && !error.config._retry) {
                error.config._retry = true;
                try {
                    Alert.alert('Session expired. Please log in again.');
                    await SecureStore.deleteItemAsync('userToken'); //clear jwt
                    await SecureStore.deleteItemAsync('userId'); //clear user id
                    return Promise.reject(error);
                } catch(logoutError) {
                    console.error('Error during logout process:', logoutError);
                }
        

               }
           }
       } else if (error.request) {
           console.error('No response received:', error.request);
       } else {
           console.error('Setup error:', error.message);
       }
       return Promise.reject(error);
   }
);
export default api;

