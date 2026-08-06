import axios from 'axios';
const api = axios.create({
    baseURL:"/api",
    withCredentials:true

})

export async function addtocart(productid,quantity){
    const res = await api.post(`/cart/add/${productid}`,{quantity})
    return res.data
}

export async function getcart(){
    const res = await api.get(`/cart/`)
    return res.data
}
export async function removecartitem(productid){
    const res = await api.delete(`/cart/remove/${productid}`)
    return res.data
}

export async function updatecartquantity(productid, quantity){
  const res = await api.patch(`/cart/${productid}`, { quantity });
  return res.data;
}



