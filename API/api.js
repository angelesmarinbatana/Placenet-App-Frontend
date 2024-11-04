import axios from "axios";
/*
base config to make requests w axios
*/

const api = axios.create({
    baseURL:'http://10.222.82.59:3000/api' //my ip allows others to connect -> base url
});
export default api;