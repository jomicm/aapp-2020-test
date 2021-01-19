// const host = 'http://localhost:3001/';
const host = 'http://159.203.41.87:3001/';
const version  = 'api/v1/';
const db = 'notes-db-app/';
const collection = 'locations/';
const publicReq = 'public/';

const getAPIPath = (
  _collection = collection,
  _id = '',
  isEncrypt = false,
  isPublic =  false
) => `${host}${version}${isPublic ? publicReq : ''}${db}${_collection}${_id}${isEncrypt ? '/encrypt' : ''}`;
const getAPIFilePath = (foldername) => `${host}${version}upload/${foldername}`;


const getHeaders = (isFile = false) => {
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYTdiNjg0M2U0ZWRhODVjNDhmZjVkOSIsInR5cGUiOiJkZXZlbG9wZXIiLCJlbWFpbCI6ImRldkBkZXYuY29tIiwiaWF0IjoxNTg4MDUwMzg5LCJleHAiOjE1OTY2OTAzODl9.eLwnv1UlCgAop0JyEXam-BxhHJFhdlnhVLF134j-pBM';
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYWIzZTg3NjAzOGRjNTZkMDg4NzdjMyIsInR5cGUiOiJkZXZlbG9wZXIiLCJlbWFpbCI6ImFAYS5teCIsImlhdCI6MTU5NzIwNTE3NywiZXhwIjoxNjA1ODQ1MTc3fQ.w29W5N9a9jTilzIJp-5xyD_h7ndq5Mqm937h0ipgCkY';
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYTdiNjg0M2U0ZWRhODVjNDhmZjVkOSIsInR5cGUiOiJkZXZlbG9wZXIiLCJlbWFpbCI6ImRldkBkZXYuY29tIiwiaWF0IjoxNTk3Mzc3MzM0LCJleHAiOjE2MDYwMTczMzR9.BFy6AjKCH83rdIZmKakpElMqYXr-E6L24fUzokJnl9U';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYTdiNjg0M2U0ZWRhODVjNDhmZjVkOSIsInR5cGUiOiJkZXZlbG9wZXIiLCJlbWFpbCI6ImRldkBkZXYuY29tIiwiaWF0IjoxNjA2ODY5MzAxLCJleHAiOjE2MTU1MDkzMDF9.NjUoP4pjXxCcMJn2_1rIdwKCGuRlk78iuCoZhcORsI4';

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
  const {type = '/jpg'} = image;
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
  let additionalParams = '';
  if (queryLike) {
    const qLike = queryLike.map(({ key, value }) => {
      const res = {};
      res[key] = { "$regex" : `(?i).*${value}.*` };
      return res;
    });
    const queryString = JSON.stringify({ "$or": qLike });
    additionalParams += `query=${queryString}`;
  }
  additionalParams = additionalParams ? `?${additionalParams}` : '';
  const reqURL = `${getAPIPath(collection)}${additionalParams}`;
  console.log('reqURL:', reqURL)

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
  getDBComplex
};
