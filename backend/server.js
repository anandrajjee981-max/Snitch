import 'dotenv/config';
import app from "./src/app.js";
import passport from "passport";
import passportGoogle from 'passport-google-oauth20';
import jwt from 'jsonwebtoken'; // Fixed: Imported jwt

const GoogleStrategy = passportGoogle.Strategy;

app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID, 
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Fixed: You must call cb to pass the user profile to the next step
    return cb(null, profile);
  }
));

app.get("/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get("/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: '/login' // Good practice to handle failures
  }),
  (req, res) => {
    // req.user now contains the "profile" passed from the step above
    const token = jwt.sign(
      {
        id: req.user.id,
        displayName: req.user.displayName,
      },
      process.env.JWT_SECRET || 'fallback_secret_if_missing', // Fallback prevents crashes
      {
        expiresIn: "1h",
      }
    );

    console.log("Generated Token:", token);
    
    res.json({
      success: true,
      token,
    });
  }
);

app.listen(3000, () => {
    console.log("server running on port 3000");
});