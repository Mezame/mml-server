import { Blob } from "node:buffer";

/* https://stackoverflow.com/a/63309110/20135116 */
function isValidWebUrl(url: string) {

    const regEx = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;

    return regEx.test(url);

}

function validateMangaCoverImage(fileAsDataURL: string | undefined) {

    const imageType = ['jpg', 'jpeg', 'png'];
  
    const isFileAsDataURLValid = (fileAsDataURL == '' ||
      fileAsDataURL == undefined ||
      !/[A-Za-z0-9+/=]/.test(fileAsDataURL!) ||
      !fileAsDataURL!.startsWith('data:image/') ||
      !imageType.includes(fileAsDataURL!.slice(fileAsDataURL!.indexOf('data:image/') + 11,
        fileAsDataURL!.indexOf(';base64,')
      ))
    ) ? false : true;
  
    if (!isFileAsDataURLValid) {
  
      console.log('image is not valid');
  
      return false;
  
    } else {
  
      const blob = new Blob([fileAsDataURL!]);
  
      if (blob.size > 1 * 1024 * 1024) {
  
        console.log('image exceeds 1MB file limit size');
  
        return false
  
      } else { return true };
  
    }
  
  }

export { isValidWebUrl, validateMangaCoverImage };