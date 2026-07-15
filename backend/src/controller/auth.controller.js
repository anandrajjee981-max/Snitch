import usermodel from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import { Config } from '../config/config.js';
import passport from 'passport';


async function generateToken(user, res) {
  // jwt.sign is synchronous by default unless given a callback
  const token = jwt.sign(
    { id: user._id ,
      role :user.role
    }, 
    Config.JWT_SECRET, 
    { expiresIn: "1d" }
  );
  
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  res.cookie('token', token, cookieOptions);
  return token;
}

export async function register(req, res) {
  try {
    const { username, email, password, phonenumber, role } = req.body;

    const existingUser = await usermodel.findOne({
      $or: [
        { email: email },
        { phonenumber: phonenumber }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or phone number already exists"
      });
    }

    const newUser = new usermodel({
      username,
      email,
      password,
      phonenumber,
      role
    });
    await newUser.save();

    // Pass 'res' here
    await generateToken(newUser, res);

    return res.status(201).json({
      message: "Registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    // 2. Use findOne instead of find
    const user = await usermodel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        message: "Email does not exist"
      });
    }

    // 3. Verify the password using your schema method
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // 4. Await token generation and pass 'res'
    await generateToken(user, res);

    return res.status(200).json({
      message: "Login successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
export function googleAuth(req, res, next) {
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })(req, res, next);
}


export function googleAuthCallback(req, res, next) {

  passport.authenticate('google', { session: false }, async (err, user, info) => {
    console.log('googleAuthCallback invoked, err:', err, 'info:', info);
    

    if (err) {
      console.error('Google auth error:', err);

      return res.redirect('http://localhost:5173/');
    }

    if (!user) {
      console.warn('No user returned from passport:', info);
   
      return res.redirect('http://localhost:5173/login?error=auth_failed');
    }

    // 3. Handle successful authentication
    try {
      console.log('Authenticated user from Google:', user.email || user.username || user._id);
      await generateToken(user, res);

      return res.redirect('http://localhost:5173/dashboard'); 
    } catch (tokenErr) {
      console.error('Token generation error:', tokenErr);
      return res.redirect('http://localhost:5173/login?error=token_generation_failed');
    }
  })(req, res, next);
}
