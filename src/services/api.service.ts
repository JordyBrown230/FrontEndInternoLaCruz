import axios from "axios";

export const localServer='http://localhost:9000/';
export const localhost = 'http://localhost:9000/sit';
// export const localhostpublic = 'http://localhost:9000/sit/public';
// export const hostedUrl = ''

const axiosApi = axios.create({   
  //baseURL: hostedUrl,
  baseURL: localhost,
  withCredentials: true, // Habilita el envío de credenciales en todas las solicitudes
  
});


export default axiosApi;