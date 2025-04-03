import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../../utils/cloudinary.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const registerUser = asyncHandler(async (req, res) => {
  // get users detail from frontend
  // validation - required fields
  // check if user already exists ----> username and email
  // check for images and avatar
  // upload them to cloudinary
  // create user object --- create entry in DB
  // remove password and refresh token field from response
  // check for user creation
  // return response
  // else return error

  const { fullName, email, userName, password } = req.body;
  if (
    [fullName, email, userName, password].some((item) => item?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const checkExistingUser = await User.findOne({
    $or: [{ userName: userName }, { email: email }],
  })

  if (checkExistingUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req?.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  };

  const avatar = await uploadCloudinary(avatarLocalPath);
  const coverImage = await uploadCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  const user = await User.create({
    fullName,
    email,
    userName: userName.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url ?? '',
  });

  const isUserCreated  = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  if (!isUserCreated) {
    throw new ApiError(500, "User creation failed");
  }
  return res.status(201).json(
    new ApiResponse(200, isUserCreated, "User created successfully"),
  )
});

const loginUser = asyncHandler(async (req, res) => {
  // get userName, password from frontend
  // trim and lowercase userName
  // check if user exists
  // check password

  const { userName, password } = req.body;
  if ([userName, password].some((item) => item?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const checkExistingUser = await User.findOne({
    $or: [{ userName: userName }],
  });
  if (!checkExistingUser) {
    throw new ApiError(404, "User not found");
  }


  const isPasswordMatch = await bcrypt.compare(password, checkExistingUser.password);
  if (isPasswordMatch) {
    return res.status(200).json(
      new ApiResponse(200, checkExistingUser, "Successful logged in"),
    )
  }
  else {
    throw new ApiError(401, "Incorrect password");
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const isUserCreated  = await User.find({});
  return res.status(200).json(
    new ApiResponse(200, isUserCreated, ""),
  )
});

const updateUser = asyncHandler(async (req, res) => {
  const {email, userName, fullName, password, avatar, coverImage} = req.body;
  if ([email, userName, fullName, password, avatar].some((item) => item?.trim() === "" || !item)) {
    throw new ApiError(400, "All fields are required");
  }
    const checkExistingUser = await User.findOne({
      $or: [{ email: email, userName: userName }],
    })

  if (!checkExistingUser) {
    throw new ApiError(404, "User not found");
  }
  else {
    const user = await User.findOneAndUpdate({ userName: userName }, {
      $set: {
        email,
        userName,
        fullName,
        avatar,
        coverImage,
        password
      }
    });
    return res.status(200).json(
      new ApiResponse(200, user, "User updated successfully"),
    )
  }
});

const getUser = asyncHandler(async (req, res) => {
  const {_id} = req.params;
  if (!_id.trim()) {
    throw new ApiError(400, "User id is required");
  }
  const checkExistingUser = await User.findOne({_id:  new mongoose.Types.ObjectId(_id)});
  if (!checkExistingUser) {
    throw new ApiError(404, "User not found");
  }

return res.status(200).json(
  new ApiResponse(200, checkExistingUser, ""),
)
});


export { registerUser, loginUser, getUsers, updateUser, getUser };
