import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageStorageUrl = './public/images/';
const throttling = 300;
const privateKey = fs.readFileSync('./certs/private.key');
const publicKey = fs.readFileSync('./certs/public.key');

export { 
    __filename,
    __dirname, 
    imageStorageUrl, 
    throttling,
    privateKey,
    publicKey
};