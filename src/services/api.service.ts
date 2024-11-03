import axios from "axios";

export const localServer='http://localhost:3005/';
export const localhost = 'http://localhost:3005/muni';
// export const hostedUrl = ''

const axiosApi = axios.create({   
  //baseURL: hostedUrl,
  baseURL: localhost,
});


export default axiosApi;