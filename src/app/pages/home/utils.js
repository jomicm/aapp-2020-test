import { getDB, postDB, getOneDB, updateDB } from '../../crud/api';
import { postFILE } from '../../crud/api';

export const getFileExtension = file => {
  if (!file) return '';
  const { type } = file;
  return type.split('/')[1];
};

export const saveImage = (image, folderName, id) => {
  if (image) {
    postFILE(folderName, id, image)
      .then(response => {
        console.log('FIlE uploaded!', response);
      })
      .catch(error => console.log(error));
  }
};

export const getFirstDocCollection = (collectionName) => {
  return getDB(collectionName)
  .then(response => response.json())
  .then(data => {
    if (data.response && Array.isArray(data.response) && data.response.length) {
      return data.response[0]._id;
    }
    return null;
  })
  .catch(error => console.log('error>', error));
};

export const getImageURL = (id, folder, fileExt = '') => {
  return fileExt ? 
    `http://159.203.41.87:3001/uploads/${folder}/${id}.${fileExt}` :
    '';
};

export const getCurrentDateTime = () => {
  const rawDate = new Date()
  const dateFormatted = `${('0' + rawDate.getDate()).slice(-2)}/${('0' + rawDate.getMonth() + 1).slice(-2)}/${rawDate.getFullYear()}`;
  const timeFormatted = `${rawDate.getHours()}:${rawDate.getMinutes()}:${rawDate.getSeconds()}`;

  return { dateFormatted, rawDate, timeFormatted };
};

export const simplePost = (collection, object) => {
  postDB(collection, object)
    .catch((error) => console.error('ERROR', error))
};