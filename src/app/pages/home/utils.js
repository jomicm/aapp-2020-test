import { getDB, postDB, getOneDB, updateDB } from '../../crud/api';
import { postFILE } from '../../crud/api';

const {
  REACT_APP_API_SERVER,
  REACT_APP_API_PORT,
  REACT_APP_LOCALHOST,
  REACT_APP_LOCALHOST_PORT
} = process.env;

const host = `${REACT_APP_API_SERVER}:${REACT_APP_API_PORT}`;

export const environmentVariables = () => {
  return {
    apiHost: `${REACT_APP_API_SERVER}:${REACT_APP_API_PORT}`,
    localHost: `${REACT_APP_LOCALHOST}:${REACT_APP_LOCALHOST_PORT}`
  };
};

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
    `${host}/uploads/${folder}/${id}.${fileExt}` :
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

export const ChangeFormatDate = () => {
  const dateToFormat = new Date();
  return {
    currentDate:
      `${(`0${dateToFormat.getDate()}`)
        .slice(-2)}/${(`0${dateToFormat.getMonth() + 1}`)
          .slice(-2)}/${dateToFormat.getFullYear()}`,
    currentTime:
      `${`0${dateToFormat.getHours()}`
        .slice(-2)}:${`0${dateToFormat.getMinutes()}`
          .slice(-2)}:${`0${dateToFormat.getSeconds()}`
            .slice(-2)}`,
    dateWithoutFormat: dateToFormat
  };
};
