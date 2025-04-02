import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../../utils/cloudinary.js";
import { ApiResponse } from "../../utils/apiResponse.js";

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
  console.log(fullName, email, userName, password, req.files);
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
  console.log(avatar, coverImage, '-----');

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

export { registerUser };
