// const { v2: cloudinary } = require("cloudinary");
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Configuration
cloudinary.config({
  cloud_name: "dgj1icpu7",
  api_key: "192926895148929",
  api_secret: "TT4K81WU5_4uFTrNLh1Kl2hIBWs", // Click 'View API Keys' above to copy your API secret
});
// cloudinary.config({
//   cloud_name: process.env.cloud_name,
//   api_key: process.env.api_key,
//   api_secret: process.env.api_secret, // Click 'View API Keys' above to copy your API secret
// });

// Upload an image

export const uploadOnCloudinary = async (file, folderName) => {
  try {
    let bufferData = await file.arrayBuffer();
    let buffer = Buffer.from(bufferData);
    // let buffer = new Uint8Array(bufferData);
    // const fileName = Date.now() + path.extname(file.name);
    // let filePath = `./public/uploads/${fileName}`;
    // fs.writeFileSync(filePath, buffer);
    let result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: folderName }, function (error, result) {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
          return result;
        })
        .end(buffer);
    });
    // const result = await cloudinary.uploader.upload(filePath, {
    //   folder: folderName,
    // });
    // try {
    //   fs.unlinkSync(filePath);
    // } catch (error) {
    //   console.log(error);
    //   return { msg: "Failed to delete image from server", error };
    // }
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      // filePath,
    };
  } catch (error) {
    console.log(error);
    return { msg: "error from upload cloudinary", error };
  }
};
//========================================================
export const deleteImageOnCloudinary = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    console.log(error);
    return { msg: "error from delete cloudinary", error };
  }
};
