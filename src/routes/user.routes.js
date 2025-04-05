import { Router } from "express";
import { registerUser, loginUser, getUsers, updateUser, getUser, deleteUserById, updateUserNameById } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(
  loginUser
);

router.route("/getUsers").get(
  getUsers
);

router.route("/updateUser").put(
  updateUser
);

router.route("/getUser/:_id").get(
  getUser
)

router.route("/deleteUser/:id").post(
  deleteUserById
)

router.route("/updateUserName/:id").put(
  updateUserNameById
)
export default router;
