import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "User name is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary service url
      required: [true, "Avatar is required"],
    },
    coverImage: {
      type: String, // cloudinary service url
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
  return next();
});

userSchema.methods.isPasswordMatch = async function (password) {
  await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
          _id: this._id,
          email: this.email,
          userName: this.userName,
          fullName: this.fullName,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
      );
};

export const User = mongoose.model("User", userSchema);
