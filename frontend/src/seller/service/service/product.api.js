import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export async function submitProducts(productData) {
  return api.post('/seller/post', productData);
}
export async function getproduct(){
  return api.get('/seller/get');
}
export async function allproduct(){
  return api.get('/buyer/get');
}