import usermodel from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import { Config } from '../config/config.js';
import passport from 'passport';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(Config.CLIENT_ID);


async function generateToken(user, res) {
  // jwt.sign is synchronous by default unless given a callback
  const token = jwt.sign(
    { id: user._id 
      
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
    const user = await usermodel.findOne({ email: email }).select("+password");
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

      return res.redirect('https://snitch-indol.vercel.app/');
    }

    if (!user) {
      console.warn('No user returned from passport:', info);
   
      return res.redirect('https://snitch-indol.vercel.app/login?error=auth_failed');
    }

    // 3. Handle successful authentication
    try {
      console.log('Authenticated user from Google:', user.email || user.username || user._id);
      await generateToken(user, res);

      const redirectPath = user.role === 'seller' ? '/sellerdashboard' : '/dashboard';
      return res.redirect(`https://snitch-indol.vercel.app/${redirectPath}`); 
    } catch (tokenErr) {
      console.error('Token generation error:', tokenErr);
      return res.redirect('https://snitch-indol.vercel.app/login?error=token_generation_failed');
    }
  })(req, res, next);
}
export async function verifyGoogleToken(req, res) {
  try {
    const { token, accessToken } = req.body;
    const tokenToVerify = token || accessToken;

    if (!tokenToVerify) {
      return res.status(400).json({
        success: false,
        message: "Google credential / token is required"
      });
    }

    let email = null;
    let name = null;
    let googleId = null;

    // Check if token is a JWT ID token (3 segments separated by dots) or access token
    if (typeof tokenToVerify === 'string' && tokenToVerify.split('.').length === 3) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: tokenToVerify,
          audience: Config.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (payload) {
          email = payload.email;
          name = payload.name;
          googleId = payload.sub;
        }
      } catch (idErr) {
        console.warn("verifyIdToken failed, trying userinfo endpoint:", idErr.message);
      }
    }

    // If ID token verification was not applicable or failed, verify via Google UserInfo API
    if (!email) {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenToVerify}` }
      });
      if (response.ok) {
        const userInfo = await response.json();
        email = userInfo.email;
        name = userInfo.name;
        googleId = userInfo.sub;
      }
    }

    if (!email) {
      return res.status(401).json({
        success: false,
        message: "Failed to verify Google token"
      });
    }

    // Find or create user
    let user = await usermodel.findOne({ email });
    if (!user) {
      user = new usermodel({
        username: name || email.split('@')[0],
        email: email,
        role: "buyer"
      });
      await user.save();
    }

    const appToken = await generateToken(user, res);

    return res.status(200).json({
      success: true,
      message: "Google authentication successful",
      token: appToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Google token verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during Google verification"
    });
  }
}

export async function getme(req,res){
  try{
    const user = await usermodel.findById(req.user.id)
    if(!user){
        return res.status(404).json({message: "User not found"})
    } 

    res.status(200).json({
      message:"user information",
      user
    })

  }
  catch(err){
    console.log(err)
  }
}


