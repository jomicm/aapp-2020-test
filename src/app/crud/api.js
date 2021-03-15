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

const getAPIPath = (
  _collection = collection,
  _id = '',
  isEncrypt = false,
  isPublic = false,
  isCount = false,
) => `${host}${version}${isPublic ? publicReq : ''}${isCount ? count : ''}${db}${_collection}${_id}${isEncrypt ? '/encrypt' : ''}`;
const getAPIFilePath = (foldername) => `${host}${version}upload/${foldername}`;

const getHeaders = (isFile = false) => {
  const state = store.default.getState();
  const token = state?.auth?.user?.accessToken || REACT_APP_TOKEN;
  
  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);
  if (!isFile) {
    headers.set('Accept', "application/json");
    headers.set('Content-Type', "application/json");
  }
  return headers;
};

const postDB = (collection, body) => fetch(getAPIPath(collection), { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) });

const postDBEncryptPassword = (collection, body) => fetch(getAPIPath(collection, '', true), { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) });

const getDB = (collection) => fetch(getAPIPath(collection), { method: 'GET', headers: getHeaders() });

const getPublicDB = (collection) => fetch(getAPIPath(collection, '', false, true), { method: 'GET', headers: getHeaders() });

const getOneDB = (collection, id) => fetch(getAPIPath(collection, id), { method: 'GET', headers: getHeaders() });

const deleteDB = (collection, id) => fetch(getAPIPath(collection, id), { method: 'DELETE', headers: getHeaders() });

const updateDB = (collection, body, id) => fetch(getAPIPath(collection, id), { method: 'PUT', headers: getHeaders(), body: JSON.stringify(body) });

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
  return fetch(getAPIFilePath(foldername), requestOptions)
};

const getDBComplex = ({
  collection,
  queryExact,
  queryLike,
  sort,
  limit,
  skip,
  fields
}) => {
  let count = 0;
  let additionalParams = '';
  if (queryLike) {
    const qLike = queryLike.map(({ key, value }) => {
      const res = {};
      const isValueBool = typeof value === 'boolean';
      res[key] = isValueBool ? value : { "$regex": `(?i).*${value}.*` };
      return res;
    });
    const queryString = JSON.stringify({ "$or": qLike });
    additionalParams += `query=${queryString}`;
    count++;
  }
  if (typeof skip === 'number') {
    additionalParams += `${count? '&' : '' }skip=${skip}`;
    count++;
  };
  if (typeof limit === 'number') {
    additionalParams += `${count? '&' : '' }limit=${limit}`;
    count++;
  };
  if (Array.isArray(fields)) {
    const res = fields.map(({key, value}) => `"${key}":${value}`).join(',');
    additionalParams += `${count? '&' : '' }fields={${res}}`;
    count++;
  };
  if (Array.isArray(sort)) {
    const res = sort.map(({key, value}) => `"${key}":${value}`).join(',');
    additionalParams += `${count? '&' : '' }sort={${res}}`;
    count++;
  }

  additionalParams = additionalParams ? `?${additionalParams}` : '';
  const reqURL = `${getAPIPath(collection)}${additionalParams}`;
  return fetch(reqURL, { method: 'GET', headers: getHeaders() });
};

const getCountDB = ({
  collection,
  queryLike,
}) => {
  let additionalParams = '';
  if (queryLike) {
    const qLike = queryLike.map(({ key, value }) => {
      const res = {};
      res[key] = { "$regex": `(?i).*${value}.*` };
      return res;
    });
    const queryString = JSON.stringify({ "$or": qLike });
    additionalParams += `query=${queryString}`;
  }
  additionalParams = additionalParams ? `?${additionalParams}` : '';
  const reqURL = `${getAPIPath(collection, '', false, false, count)}${additionalParams}`;
  return fetch(reqURL, { method: 'GET', headers: getHeaders() });
};

module.exports = {
  deleteDB,
  getDB,
  getPublicDB,
  getOneDB,
  postDB,
  postDBEncryptPassword,
  postFILE,
  updateDB,
  getDBComplex,
  getCountDB
};
