import axios from 'axios'

const api = axios.create({
    baseURL:"/api",
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






