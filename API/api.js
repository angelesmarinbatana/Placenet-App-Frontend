import axios from "axios";
import { useRouter } from 'expo-router';
import { Alert } from "react-native";
import * as SecureStore from 'expo-secure-store';


/*base config to make requests w axios*/


const api = axios.create({
    baseURL: 'http://10.190.191.61:3000/api',//for emulator
   //baseURL: 'http://10.222.82.59:3000/api',// base url + port where backend is running
   timeout: 10000, //10 secs
});


//need jwt in auth header:
api.interceptors.request.use(async(config) =>{
   const token = await SecureStore.getItemAsync('userToken');
   if (token) {
       config.headers.Authorization = `Bearer ${token}`;
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
               await SecureStore.deleteItemAsync('userToken'); //clear jwt
               await SecureStore.deleteItemAsync('userId'); //clear user id
               Alert.alert('Session expired, please log in again.');
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

