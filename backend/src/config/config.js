import { configDotenv } from "dotenv";

configDotenv(); 

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not defined");
}
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
}
if(!process.env.CLIENT_ID){
    throw new Error("client id environment variable is not defined");
}
if(!process.env.CLIENT_SECRET){
        throw new Error("client secret environment variable is not defined");
}
if(!process.env.IMAGEKIT_PRIVATE_KEY){
     throw new Error("image kit private key environment variable is not defined");
}
if(!process.env.IMAGEKIT_PUBLIC_KEY){
  throw new Error("image kit public  environment variable is not defined");
}
if(!process.env.IMAGEKIT_URL_END_POINT){
      throw new Error("image kit url  environment variable is not defined");
}
export const Config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    CLIENT_SECRET:process.env.CLIENT_SECRET,
    CLIENT_ID :process.env.CLIENT_ID,
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_PUBLIC_KEY:process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_URL_END_POINT:process.env.IMAGEKIT_URL_END_POINT
};