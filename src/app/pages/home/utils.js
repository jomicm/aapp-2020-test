import { getDB, postDB } from '../../crud/api';
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
  }, []) || [];
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

export const getLocationPath = async (locationId, returnId = false) => {
  const allLocations = await getAllLocations();
  const firstLocation = allLocations.find(({ id }) => id === locationId);
  const response = recursiveLocationPath(firstLocation, allLocations, returnId);
  
  if (!returnId) {
    return response;
  } else {
    return response.split('/');
  }
};

const getAllLocations = async () => {
  return await getDB('locationsReal/')
    .then(response => response.json())
    .then(data => {
      const filtered = data.response.map(({ _id: id, name, parent }) => ({ id, name, parent }))
      return filtered;
    })
    .catch(error => console.log(error));
}

const recursiveLocationPath = (currentLocation, allLocations, returnId = false) => {
  const { name, parent, id} = currentLocation;
  if (parent === 'root' && !returnId) {
    return name;
  }
  else if (parent === 'root' && returnId) {
    return id;
  }
  else {
    const newLocation = allLocations.find(({ id }) => id === parent);
    if(returnId){
      return recursiveLocationPath(newLocation, allLocations, returnId).concat('/', id);
    }
    else {
      return recursiveLocationPath(newLocation, allLocations, returnId).concat('/', name);
    }
    ;
  }
};

export const verifyCustomFields = (customFieldsTab) => {
  let flag = true;
  if (!Object.keys(customFieldsTab).length) return true;
  const RightAndLeft = ['right', 'left'];
  const customInitialValue = ['singleLine', 'multiLine', 'date', 'dateTime', 'imageUpload', 'currency', 'percentage', 'email', 'decimal', 'richText', 'url', 'formula'];
  const customSelectedItem = ['dropDown', 'radioButtons'];
  const customSelectedOptions = ['checkboxes', 'decisionBox'];
  const customOther = ['fileUpload'];
  Object.keys(customFieldsTab).map((tabName) => {
    RightAndLeft.map((side) => {
      customFieldsTab[tabName][side].forEach(({ content, values: { mandatory, initialValue, fileExt, selectedItem, selectedOptions } }) => {
        if (!flag || !mandatory) return;
        if (customInitialValue.includes(content)) {
          if (content === 'richText') {
            flag = initialValue.length > 8;
          } else if (!initialValue) {
            flag = false;
          }
        } else if (customSelectedItem.includes(content)) {
          if (!selectedItem) {
            flag = false;
          }
        } else if (customSelectedOptions.includes(content)) {
          if (!selectedOptions || !selectedOptions?.length) {
            flag = false;
          }
        } else if (customOther.includes(content)) {
          if (content === 'fileUpload') {
            if (!fileExt) {
              flag = false;
            }
          }
        }
      });
    })
  });

  return flag;
};

export const verifyRepeatedValues = (customFieldsTab) => {
  let data = [];
  const customInitialValue = ['singleLine', 'multiLine', 'date', 'dateTime', 'currency', 'percentage', 'email', 'decimal', 'url'];
  const RightAndLeft = ['right', 'left'];
  if (!Object.keys(customFieldsTab).length) return true;

  Object.keys(customFieldsTab).map((tabName) => {
    RightAndLeft.map((side) => {
      customFieldsTab[tabName][side].forEach((customField) => {
        if (!customInitialValue.includes(customField.content)) return;
        if (customField.values.repeated) {
          data.push(customField);
        }
      });
    })
  });
  
  console.log(data);
};
