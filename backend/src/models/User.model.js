import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import { Config } from '../config/config.js';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false,
    select:false
  },
  phonenumber: {
    type: Number,
    required: false,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    enum: ["buyer", "seller"],
    default: "buyer"
  }
}, { timestamps: true }); 


userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});


userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

 const User = mongoose.model("User", userSchema);
 export default User