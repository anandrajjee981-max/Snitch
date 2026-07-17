import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export async function submitProducts(productData) {
  return api.post('/seller/post', productData);
}
