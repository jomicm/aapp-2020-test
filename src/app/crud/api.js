const host = 'http://localhost:3001/';
const version  = 'api/v1/';
const db = 'notes-db-app/';
const collection = 'locations/';

const getAPIPath = (_collection = collection, _id = '') => `${host}${version}${db}${_collection}${_id}`;

const getHeaders = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYTdiNjg0M2U0ZWRhODVjNDhmZjVkOSIsInR5cGUiOiJkZXZlbG9wZXIiLCJlbWFpbCI6ImRldkBkZXYuY29tIiwiaWF0IjoxNTg4MDUwMzg5LCJleHAiOjE1OTY2OTAzODl9.eLwnv1UlCgAop0JyEXam-BxhHJFhdlnhVLF134j-pBM';
  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Accept', "application/json");
  headers.set('Content-Type', "application/json");
  return headers;
};

const postDB = (collection, body) => fetch(getAPIPath(collection), { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) });

const getDB = (collection) => fetch(getAPIPath(collection), { method: 'GET', headers: getHeaders() });

const getOneDB = (collection, id) => fetch(getAPIPath(collection, id), { method: 'GET', headers: getHeaders() });

const deleteDB = (collection, id) => fetch(getAPIPath(collection, id), { method: 'DELETE', headers: getHeaders() });

const updateDB = (collection, body, id) => fetch(getAPIPath(collection, id), { method: 'PUT', headers: getHeaders(), body: JSON.stringify(body) });

module.exports = {
  postDB,
  getDB,
  deleteDB,
  getOneDB,
  updateDB
};