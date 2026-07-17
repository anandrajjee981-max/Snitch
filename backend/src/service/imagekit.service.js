import ImageKit from '@imagekit/nodejs';
import { Config } from '../config/config.js';

const client = new ImageKit({
  publicKey: Config.IMAGEKIT_PUBLIC_KEY,
  privateKey: Config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: Config.IMAGEKIT_URL_END_POINT
});

function toUploadFile(buffer, filename) {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    return new File([blob], filename, { type: blob.type });
}

export async function uploadimage({ buffer, filename, folder = 'snitch' }) {
    if (!buffer || !filename) {
        throw new Error('Image buffer and filename are required');
    }

    try {
        console.log('Starting ImageKit upload for:', filename);
        const file = toUploadFile(buffer, filename);
        const response = await client.files.upload({
            file,
            fileName: filename,
            folder,
            useUniqueFileName: true
        });

        console.log('ImageKit upload response:', JSON.stringify(response, null, 2));

        const url = response?.url || response?.filePath || response?.thumbnailUrl;
        if (!url) {
            console.error('No URL found in ImageKit response. Full response:', response);
            throw new Error('ImageKit response missing URL');
        }
        return url;
    } catch (error) {
        console.error('ImageKit Upload Error:', {
            message: error?.message,
            response: error?.response?.data || error?.response,
            status: error?.response?.status,
            fullError: error
        });
        throw new Error(`Image upload failed: ${error?.message || 'Unknown error'}`);
    }
}




