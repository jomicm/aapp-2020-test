const store = require('../../app/store/store');

const {
  REACT_APP_API_SERVER,
  REACT_APP_API_PORT,
  REACT_APP_API_VERSION,
  REACT_APP_API_DB,
  REACT_APP_API_COLLECTION,
  REACT_APP_API_PUBLIC_REQ,
  REACT_APP_API_COUNT,
  REACT_APP_TOKEN
} = process.env;

const host = `${REACT_APP_API_SERVER}:${REACT_APP_API_PORT}/`;
const version = REACT_APP_API_VERSION;
const db = `${REACT_APP_API_DB}/`;
const collection = `${REACT_APP_API_COLLECTION}/`;
const publicReq = `${REACT_APP_API_PUBLIC_REQ}/`;
const count = `${REACT_APP_API_COUNT}/`;

const getBaseInfo = () => {
  const state = store.default.getState();
  const creationUserId = state?.auth?.user?.id || '';
  const creationUserFullName = state?.auth?.user?.fullname || '';
  const currentDate = new Date().toISOString();;

  return {
    post: {
      creationUserId,
      creationUserFullName,
      creationDate: currentDate,
      updateDate: currentDate
    },
    update: {
      updateDate: currentDate
    }
  };
};

const getAPIPath = (
  _collection = collection,
  _id = '',
  isEncrypt = false,
  isPublic = false,
  isCount = false,
) => `${host}${version}${isPublic ? publicReq : ''}${isCount ? count : ''}${db}${_collection}${_id}${isEncrypt ? '/encrypt' : ''}`;

const getAPIFilePath = (foldername) => `${host}${version}upload/${foldername}`;

const getHeaders = (isFile = false) => {
  const token = localStorage.getItem('accessToken') || REACT_APP_TOKEN;

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);
  if (!isFile) {
    headers.set('Accept', "application/json");
    headers.set('Content-Type', "application/json");
  }
  return headers;
};

const postDB = (collection, body) => fetch(getAPIPath(collection), { method: 'POST', headers: getHeaders(), body: JSON.stringify(Object.assign(body, getBaseInfo().post)) });

const postDBEncryptPassword = (collection, body) => fetch(getAPIPath(collection, '', true), { method: 'POST', headers: getHeaders(), body: JSON.stringify(Object.assign(body, getBaseInfo().post)) });

const getDB = (collection) => fetch(getAPIPath(collection), { method: 'GET', headers: getHeaders() });

const getPublicDB = (collection) => fetch(getAPIPath(collection, '', false, true), { method: 'GET', headers: getHeaders() });

const getOneDB = (collection, id) => fetch(getAPIPath(collection, id), { method: 'GET', headers: getHeaders() });

const deleteDB = (collection, id) => fetch(getAPIPath(collection, id), { method: 'DELETE', headers: getHeaders() });

const updateDB = (collection, body, id) => fetch(getAPIPath(collection, id), { method: 'PUT', headers: getHeaders(), body: JSON.stringify(Object.assign(body, getBaseInfo().update)) });

const postFILE = (foldername, filename, image) => {
  const { type = '/jpg' } = image;
  const fileName = `${filename}.${type.split('/')[1]}`

  const formData = new FormData();
  formData.append("file", image, fileName);

  const requestOptions = {
    method: 'POST',
    headers: getHeaders(true),
    body: formData,
    redirect: 'follow'
  };
  return fetch(getAPIFilePath(foldername), requestOptions);
};

const urltoFile = (url, filename, type) => {
  const requestOptions = {
    method: 'GET',
    headers: getHeaders(true)
  };

  return (
    fetch(url, requestOptions)
      .then((response) => response.blob())
      .then((blob) => new File([blob], filename, { type }))
      .catch((error) => console.log(error))
  );
}

const getDBComplex = ({
  collection,
  queryExact,
  queryLike,
  sort,
  limit,
  skip,
  fields,
  customQuery,
  condition,
  operator = '$or'
}) => {
  let count = 0;
  let additionalParams = '';
  if (queryLike && !condition) {
    const qLike = queryLike.map(({ key, value }) => {
      const res = {};
      const isValueBool = typeof value === 'boolean';
      res[key] = isValueBool ? value : { "$regex": `(?i).*${value}.*` };
      return res;
    });
    const str = {};
    str[operator] = qLike;
    const queryString = JSON.stringify(str);
    additionalParams += `query=${queryString}`;
    count++;
  } else if (queryExact) {
    const qExact = queryExact.map(({ key, value }) => {
      const res = {};
      res[key] = value;
      return res;
    });
    const str = {};
    str[operator] = qExact;
    const queryString = JSON.stringify(str);
    additionalParams += `query=${queryString}`;
    count++;
  } else if (queryLike && condition) {
    const qLike = queryLike.map(({ key, value }) => {
      const res = {};
      const isValueBool = typeof value === 'boolean';
      res[key] = isValueBool ? value : { "$regex": `(?i).*${value}.*` };
      return res;
    });
    const text = condition.map((e) => JSON.stringify(e)).join(",");
    const queryString = JSON.stringify({ "$and": [{ "$or": qLike }, text] }).replace(/\\+/g, "").replace(/"{/g, "{").replace(/}"/g, "}");
    additionalParams += `query=${queryString}`;
    count++;
  } else if (!queryLike && condition) {
    const text = condition.map((e) => JSON.stringify(e)).join(",");
    const queryString = JSON.stringify({ "$and": [text] }).replace(/\\+/g, "").replace(/"{/g, "{").replace(/}"/g, "}");
    additionalParams += `query=${queryString}`;
    count++;
  }
  if (customQuery){
    additionalParams += `query=${queryExact}`;
    count++;
  }
  if (typeof skip === 'number') {
    additionalParams += `${count ? '&' : ''}skip=${skip}`;
    count++;
  };
  if (typeof limit === 'number') {
    additionalParams += `${count ? '&' : ''}limit=${limit}`;
    count++;
  };
  if (Array.isArray(fields)) {
    const res = fields.map(({ key, value }) => `"${key}":${value}`).join(',');
    additionalParams += `${count ? '&' : ''}fields={${res}}`;
    count++;
  };
  if (Array.isArray(sort)) {
    const res = sort.map(({ key, value }) => `"${key}":${value}`).join(',');
    additionalParams += `${count ? '&' : ''}sort={${res}}`;
    count++;
  }

  additionalParams = additionalParams ? `?${additionalParams}` : '';
  const reqURL = `${getAPIPath(collection)}${additionalParams}`;
  return fetch(reqURL, { method: 'GET', headers: getHeaders() });
};

const getCountDB = ({
  collection,
  condition,
  queryLike,
  queryExact
}) => {
  let additionalParams = '';
  if (queryLike && !condition) {
    const qLike = queryLike.map(({ key, value }) => {
      const res = {};
      res[key] = { "$regex": `(?i).*${value}.*` };
      return res;
    });
    const queryString = JSON.stringify({ "$or": qLike });
    additionalParams += `query=${queryString}`;
  } else if (queryLike && condition) {
    const qLike = queryLike.map(({ key, value }) => {
      const res = {};
      const isValueBool = typeof value === 'boolean';
      res[key] = isValueBool ? value : { "$regex": `(?i).*${value}.*` };
      return res;
    });
    const text = condition.map((e) => JSON.stringify(e)).join(",");
    const queryString = JSON.stringify({ "$and": [{ "$or": qLike }, text] }).replace(/\\+/g, "").replace(/"{/g, "{").replace(/}"/g, "}");
    additionalParams += `query=${queryString}`;
  } else if (!queryLike && condition) {
    const text = condition.map((e) => JSON.stringify(e)).join(",");
    const queryString = JSON.stringify({ "$and": [text] }).replace(/\\+/g, "").replace(/"{/g, "{").replace(/}"/g, "}");
    additionalParams += `query=${queryString}`;
  }
  if (queryExact) {
    const qExact = queryExact.map(({ key, value }) => {
      const res = {};
      res[key] = value;
      return res;
    });
    const queryString = JSON.stringify({ "$or": qExact });
    additionalParams += `query=${queryString}`;
  }
  additionalParams = additionalParams ? `?${additionalParams}` : '';
  const reqURL = `${getAPIPath(collection, '', false, false, count)}${additionalParams}`;
  return fetch(reqURL, { method: 'GET', headers: getHeaders() });
};

const getMessages = ({
  queryLike,
  sort,
  limit,
  skip,
  fields,
  trash,
  userId
}) => {
  let collection = 'messages';
  let count = 0;
  let additionalParams = '';
  if (queryLike) {
    const qLike = queryLike.map(({ key, value }) => {
      const res = {};
      const isValueBool = typeof value === 'boolean';
      res[key] = isValueBool ? value : { "$regex": `(?i).*${value}.*` };
      return res;
    });
    const queryString = JSON.stringify({ "$and": [{ "$or": qLike }, { "to": { "$elemMatch": { "_id": userId } } }, { "status": trash ? "trash" : "new" }] });
    additionalParams += `query=${queryString}`;
    count++;
  } else {
    const queryString = JSON.stringify({ "$and": [{ "to": { "$elemMatch": { "_id": userId } } }, { "status": trash ? "trash" : "new" }] });
    additionalParams += `query=${queryString}`;
    count++;
  }
  if (typeof skip === 'number') {
    additionalParams += `${count ? '&' : ''}skip=${skip}`;
    count++;
  };
  if (typeof limit === 'number') {
    additionalParams += `${count ? '&' : ''}limit=${limit}`;
    count++;
  };
  if (Array.isArray(fields)) {
    const res = fields.map(({ key, value }) => `"${key}":${value}`).join(',');
    additionalParams += `${count ? '&' : ''}fields={${res}}`;
    count++;
  };
  if (Array.isArray(sort)) {
    const res = sort.map(({ key, value }) => `"${key}":${value}`).join(',');
    additionalParams += `${count ? '&' : ''}sort={${res}}`;
    count++;
  }

  additionalParams = additionalParams ? `?${additionalParams}` : '';
  const reqURL = `${getAPIPath(collection)}${additionalParams}`;
  return fetch(reqURL, { method: 'GET', headers: getHeaders() });
};

const getTotalMessages = ({
  queryLike,
  trash,
  userId
}) => {
  let collection = 'messages';
  let additionalParams = '';
  if (queryLike) {
    const qLike = queryLike.map(({ key, value }) => {
      const res = {};
      res[key] = { "$regex": `(?i).*${value}.*` };
      return res;
    });
    const queryString = JSON.stringify({ "$and": [{ "$or": qLike }, { "to": { "$elemMatch": { "_id": userId } } }, { "status": trash ? "trash" : "new" }] });
    additionalParams += `query=${queryString}`;
  } else {
    const queryString = JSON.stringify({ "$and": [{ "to": { "$elemMatch": { "_id": userId } } }, { "status": trash ? "trash" : "new" }] });
    additionalParams += `query=${queryString}`;
  }
  additionalParams = additionalParams ? `?${additionalParams}` : '';
  const reqURL = `${getAPIPath(collection, '', false, false, count)}${additionalParams}`;
  return fetch(reqURL, { method: 'GET', headers: getHeaders() });
};

module.exports = {
  deleteDB,
  getDB,
  getMessages,
  getPublicDB,
  getOneDB,
  getTotalMessages,
  postDB,
  postDBEncryptPassword,
  postFILE,
  updateDB,
  getDBComplex,
  getCountDB,
  urltoFile
};
