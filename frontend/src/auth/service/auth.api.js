import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE || '/api';
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials:true 
})

export async function register(email , password , role , phonenumber , username){
    try{
const res = await api.post("/auth/register",{email,password,phonenumber,username,role})
return res.data
    }
    catch(err){
        console.log(err)
    }
}

export async function login(email ,password){
    try{
const res = await api.post("/auth/login",{email,password})
return res.data
    }
    catch(err){
        console.log(err)
    }
}
export async function getme(){
    try{
const res = await api.get("/auth/getme")
return res.data
    }
    catch(err){
        console.log(err)
    }
}

export async function verifyGoogleAuthToken(tokenData) {
    const payload = typeof tokenData === 'string' 
        ? { token: tokenData } 
        : { token: tokenData.credential, accessToken: tokenData.access_token };
    const res = await api.post("/auth/google/verify", payload);
    return res.data;
}





