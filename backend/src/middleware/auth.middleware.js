import { Config } from "../config/config.js";
import jwt from 'jsonwebtoken'
import usermodel from '../models/User.model.js'


export async function verifyseller(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        console.log('No token found in cookies');
        return res.status(401).json({
            message: "token not found"
        });
    }

    try {
        let decoded;
        try {
            decoded = jwt.verify(token, Config.JWT_SECRET);
        } catch (tokenErr) {
            console.error('JWT verification error:', tokenErr.message);
            return res.status(401).json({
                message: "invalid token"
            });
        }

        if (!decoded?.id) {
            console.log('No ID in decoded token:', decoded);
            return res.status(401).json({
                message: "invalid token"
            });
        }

        const user = await usermodel.findById(decoded.id);

        if (!user) {
            console.log('User not found for ID:', decoded.id);
            return res.status(404).json({
                message: "user not found"
            });
        }

        if (user.role !== "seller") {
            console.log('User is not a seller, role:', user.role);
            return res.status(403).json({
                message: "you do not have seller access"
            });
        }

        console.log('Seller verified:', user._id);
        req.user = user;
        next();
    } catch (err) {
        console.error('Middleware error:', err);
        return res.status(500).json({
            message: "internal server error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}
export async function verifyme(req,res,next){
    const token = req.cookies.token
    if(!token){
        return res.status(404).json({
            message :"token not found"
        })
    }
   let  decoded
    try{
decoded = await jwt.verify(token , Config.JWT_SECRET)
const user = await usermodel.findById(decoded.id)
req.user = user 
next()


    }
    catch(err){
        console.log(err)
    }
}






