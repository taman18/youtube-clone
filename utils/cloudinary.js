import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

  // Upload an image
const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // Upload the image to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        console.log(response, "response");
        fs.unlinkSync(localFilePath);
        return response;
    }
    catch (err) {
        fs.unlinkSync(localFilePath);
        throw err;
    }
}

export {uploadCloudinary};