import express from "express";
import cookie from 'cookie-parser'
import authrouter from "./routes/auth.route.js";
import passport from 'passport'
import { Config } from "./config/config.js";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cors from 'cors'
import usermodel from './models/User.model.js'
import productrouter from "./routes/product.route.js";
import buyerrouter from "./routes/buyer.route.js";
import cartrouter from "./routes/cart.route.js";
import paymentrouter from "./routes/payment.route.js";
import helmet from "helmet";
import morgan from "morgan";

const app = express()
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

   scriptSrc: [
  "'self'",
  "https://apis.google.com",
  "https://checkout.razorpay.com",
],

    styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: [
  "'self'",
  "https://ik.imagekit.io",   // images yahan load honge, scriptSrc mein nahi
  "data:",
],

        connectSrc: ["'self'", 
          "http://localhost:3000",
          "https://snitch-7b46.onrender.com",
          "https://ik.imagekit.io",   // agar fetch/API calls bhi ImageKit ko jaati hain
          "https://api.razorpay.com", // Razorpay payment verification API
        ],
        frameSrc: [
  "'self'",
  "https://api.razorpay.com",
  "https://checkout.razorpay.com",
],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: "no-referrer" },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: false,
    },
  })
);
app.use(express.json())
app.use(cookie())

// Allow frontend origin and credentials for cookies
app.use(cors({ origin: [
  "http://localhost:5173",
  "https://snitch-indol.vercel.app"
],
  credentials: true }))

// Initialize passport
app.use(passport.initialize())
app.use(morgan("combined"))

const CALLBACK_BASE = process.env.BACKEND_URL || 'https://snitch-7b46.onrender.com';

passport.use(new GoogleStrategy({
    clientID:Config.CLIENT_ID,
    clientSecret: Config.CLIENT_SECRET,
    callbackURL: `${CALLBACK_BASE}/api/auth/google/callback`
  },
  async function(accessToken, refreshToken, profile, cb) {
    console.log('GoogleStrategy verify called for profile id:', profile.id);
    try {
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      console.log('Google profile email:', email);
      if (!email) return cb(new Error('No email found in Google profile'));

      let user = await usermodel.findOne({ email });
      if (!user) {
        user = new usermodel({
          username: profile.displayName || email.split('@')[0],
          email,
          // password and phonenumber are optional for OAuth users
        });
        await user.save();
      }
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
));

app.use("/api/auth",authrouter)
app.use("/api/seller",productrouter)
app.use("/api/buyer",buyerrouter)
app.use("/api/cart",cartrouter)
app.use("/api/payment",paymentrouter)
export default app