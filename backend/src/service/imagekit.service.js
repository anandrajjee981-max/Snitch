import ImageKit from '@imagekit/nodejs';
import { Config } from '../config/config.js';
const client = new ImageKit({
  privateKey: Config.IMAGEKIT_PRIVATE_KEY, 
});

export async function uploadimage(buffer , filename , folder='snitch'){
    const result = await client.files.upload({
        file:ImageKit.toFile(buffer),
        filename,
        folder
    })
    return result
}




