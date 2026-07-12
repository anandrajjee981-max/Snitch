import express from "express";

import cookie from 'cookie-parser'
import authrouter from "./routes/auth.route.js";
import passport from 'passport'
import { Config } from "./config/config.js";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cors from 'cors'
import usermodel from './models/User.model.js'

const app = express()
app.use(express.json())
app.use(cookie())

// Allow frontend origin and credentials for cookies
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

// Initialize passport
app.use(passport.initialize())

const CALLBACK_BASE = process.env.BACKEND_URL || 'http://localhost:5173';

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

export default app