import ImageKit from 'imagekit';
import dotenv from 'dotenv';
dotenv.config();

let imagekitInstance = null;

if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
    imagekitInstance = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
} else {
    console.warn('⚠️ ImageKit environment variables not set. Media uploads will use mock/fallback storage.');
}

export const getAuthParameters = () => {
    if (!imagekitInstance) {
        return {
            token: 'mock-token',
            expire: Date.now() + 3600000,
            signature: 'mock-signature'
        };
    }
    return imagekitInstance.getAuthenticationParameters();
};

export const uploadToImageKit = async (fileBuffer, fileName, folder = 'pingup') => {
    if (!imagekitInstance) {
        // Fallback: Return data URL or placeholder if ImageKit is unconfigured
        const base64 = fileBuffer.toString('base64');
        return {
            url: `data:image/jpeg;base64,${base64}`,
            fileId: `mock_${Date.now()}`,
            name: fileName
        };
    }

    return await imagekitInstance.upload({
        file: fileBuffer,
        fileName: fileName || `img_${Date.now()}.jpg`,
        folder: `/${folder}`,
        transformation: {
            pre: 'q-80'
        }
    });
};

export default imagekitInstance;

