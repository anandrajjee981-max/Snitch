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
if(process.env.IMAGEKIT_PRIVATE_KEY){
     throw new Error("image kit environment variable is not defined");
}

export const Config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    CLIENT_SECRET:process.env.CLIENT_SECRET,
    CLIENT_ID :process.env.CLIENT_ID,
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY
};