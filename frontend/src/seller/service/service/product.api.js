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
export async function submitVariant(productId, variantData) {
  return api.post(`/seller/variant/${productId}`, variantData);
}
export async function getSellerProductById(productId) {
  return api.get(`/seller/get/${productId}`);
}
export async function editproduct(productid, formData) {
  return api.patch(`/seller/edit/${productid}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function editstock(productid, data) {
  return api.patch(`/seller/editstock/${productid}`, data);
}
export async function editvariantstock(productid, variantid, data) {
  return api.patch(`/seller/editvariantstock/${productid}/${variantid}`, data);
}
