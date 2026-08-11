import axiios from 'axios';

const api = axiios.create({
  baseURL: '/api',
  withCredentials: true,
});
export async function searchProducts(searchQuery) {
  return api.get(`/buyer/search?query=${searchQuery}`);
}








