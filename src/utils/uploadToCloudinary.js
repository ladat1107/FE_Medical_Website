import axios from 'axios';
import CryptoJS from 'crypto-js';
import { CLOUD_NAME, UPLOAD_PRESET, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "@/constant/environment"; // Thay đổi để sử dụng crypto-js thay vì node's crypto

// Hàm tạo chữ ký (signature)
const generateSignature = (timestamp, folder) => {
    const stringToSign = `folder=${folder}&timestamp=${timestamp}&upload_preset=${UPLOAD_PRESET}`;  // Chuỗi cần ký bao gồm folder, timestamp và upload_preset
    return CryptoJS.SHA1(stringToSign + CLOUDINARY_API_SECRET).toString(CryptoJS.enc.Hex);  // Kết hợp với apiSecret
};
// Hàm upload ảnh lên Cloudinary
export const uploadToCloudinary = async (file, folder, onProgress) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateSignature(timestamp, folder);  // Tạo chữ ký
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);  // Chữ ký
    formData.append("folder", folder);
    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);  // Cập nhật tiến trình upload
                },
            }
        );
        return response.data.secure_url;  // Trả về URL ảnh đã upload
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error.response || error.message);
        throw error;  // Ném lỗi để xử lý ở nơi gọi
    }
};
// Hàm xóa ảnh từ Cloudinary
export const deleteImageFromCloudinary = async (publicId) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateSignatureDelete(publicId, timestamp);
    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
            {
                public_id: publicId,
                api_key: CLOUDINARY_API_KEY,
                timestamp: timestamp,
                signature: signature,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa ảnh cũ từ Cloudinary:", error.response || error.message);
        throw error;
    }
};
// Hàm tạo chữ ký (signature)
const generateSignatureDelete = (publicId, timestamp) => {
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}`;
    return CryptoJS.SHA1(stringToSign + CLOUDINARY_API_SECRET).toString(CryptoJS.enc.Hex);  // Kết hợp với apiSecret
};
export const uploadAndDeleteToCloudinary = async (file, folder, oldLink, onProgress) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateSignature(timestamp, folder);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);  // Chữ ký
    formData.append("folder", folder);

    try {
        // Nếu oldLink khác null, xóa ảnh cũ trước
        if (oldLink) {
            const publicId = folder + "/" + oldLink.split('/').pop().split('.')[0];  // Lấy public_id từ URL
            await deleteImageFromCloudinary(publicId);  // Xóa ảnh cũ
        }
        // Upload ảnh mới
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,  // Thay 'your_cloud_name_here' bằng tên cloud của bạn
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                },
            }
        );
        return response.data.secure_url;  // Trả về URL ảnh đã upload
    } catch (error) {
        console.error("Lỗi khi upload ảnh lên Cloudinary:", error.response || error.message);
        throw error;  // Ném lỗi để xử lý ở nơi gọi
    }
};

export const uploadFileToCloudinary = async (file, folder = "documents", onProgress) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folder);
    formData.append("public_id", file.name);
    formData.append("resource_type", "raw");

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress?.(percentCompleted);
                },
            }
        );

        return response.data.secure_url;
    } catch (error) {
        console.error("Lỗi khi upload file lên Cloudinary:", error.response?.data || error.message);
        throw error;
    }
};



export const uploadFileToCloudinary2 = async (file, folder = "documents", onProgress) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folder);
    formData.append("resource_type", "auto"); // Cho phép upload mọi loại file

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress?.(percentCompleted);
                },
            }
        );
        return { url: response.data.secure_url, delete_token: response.data.delete_token };
    } catch (error) {
        console.error("Lỗi khi upload file lên Cloudinary:", error.response || error.message);
        throw error;
    }
};