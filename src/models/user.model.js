import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from "crypto"
const UserSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: 'https://placehold.co/600x400',
        localPath: '',
      },
    },

    username: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      required: true,
      lowercase: true,
    },
    tempToken:{
        type: String
    },
    fullName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationTokenExp: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = function () {
  jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};
UserSchema.methods.generateRefeshToken = function () {
  jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
};


UserSchema.methods.genereateTemporaryToken = function(){
    const unHashedToken = crypto.randomBytes(20).toString("hex")
    
    const hashedToken = crypto.createHash("sh256").update(unHashedToken).digest("hex")

    const tokenExpiry = Date.now() + (20*60*1000)

    return { hashedToken, unHashedToken, tokenExpiry}
}
export const User = mongoose.model('User', UserSchema);
