import { getDB, postDB, getOneDB, updateDB } from '../../crud/api';
import { postFILE } from '../../crud/api';

const {
  REACT_APP_API_SERVER,
  REACT_APP_API_PORT,
  REACT_APP_LOCALHOST,
  REACT_APP_LOCALHOST_PORT
} = process.env;

const apiHost = `${REACT_APP_API_SERVER}:${REACT_APP_API_PORT}`;
const localHost = `${REACT_APP_LOCALHOST}:${REACT_APP_LOCALHOST_PORT}`;

export const hosts = { apiHost, localHost };

export const getFileExtension = file => {
  if (!file) return '';
  const { type } = file;
  return type.split('/')[1];
};

export const saveImage = (image, folderName, id) => {
  if (image) {
    postFILE(folderName, id, image)
      .then(response => {
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
    `${apiHost}/uploads/${folder}/${id}.${fileExt}` :
    '';
};

const findOccurrences = (strFull, strToSearch) => {
  const regex = new RegExp(strToSearch, 'g');
  let result;
  const foundIndexes = [];
  while ((result = regex.exec(strFull))) {
    foundIndexes.push(result.index);
  }

  return foundIndexes;
};

export const getVariables = (html) => {
  const startVar = findOccurrences(html, '%{');
  return startVar.reduce((acu, curr, ix, all) => {
    const subStr = html.slice(curr, all[ix + 1]);
    const endVar = subStr.indexOf('}');

    if (endVar >= 0) {
      const varName = subStr.slice(2, endVar);
      return [...acu, { varName, start: curr, end: curr + endVar }];
    } else {
      return acu;
    }
  }, []);
};

export const getCurrentDateTime = () => {
  const rawDate = new Date();
  const dateFormatted = `${(`0${rawDate.getDate()}`).slice(-2)}/${(`0${rawDate.getMonth() + 1}`).slice(-2)}/${rawDate.getFullYear()}`;
  const timeFormatted = `${`0${rawDate.getHours()}`.slice(-2)}:${`0${rawDate.getMinutes()}`.slice(-2)}:${`0${rawDate.getSeconds()}`.slice(-2)}`;

  return { dateFormatted, rawDate, timeFormatted };
};

export const simplePost = (collection, object) => {
  postDB(collection, object)
    .catch((error) => console.error('ERROR', error))
};
