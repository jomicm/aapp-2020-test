import axios from "axios";

const host = 'http://159.203.41.87:3001/';
// const host = 'http://localhost:3001/';
const version  = 'api/v1/';
const db = 'notes-db-app/';
const collection = 'locations/';

const getAPIPath = (_collection = collection, _id = '', isEncrypt = false, isUserValidation = false) =>
  `${host}${version}${db}${_collection}${_id}${isEncrypt ? '/encrypt' : ''}${isUserValidation ? '/validuser' : ''}`;
const getUserTokenPath = 'http://159.203.41.87:3001/users/getuserbytoken';
// const getUserTokenPath = 'http://localhost:3001/users/getuserbytoken';
const getHeaders = () => {
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYTdiNjg0M2U0ZWRhODVjNDhmZjVkOSIsInR5cGUiOiJkZXZlbG9wZXIiLCJlbWFpbCI6ImRldkBkZXYuY29tIiwiaWF0IjoxNTg4MDUwMzg5LCJleHAiOjE1OTY2OTAzODl9.eLwnv1UlCgAop0JyEXam-BxhHJFhdlnhVLF134j-pBM';
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYTdiNjg0M2U0ZWRhODVjNDhmZjVkOSIsInR5cGUiOiJkZXZlbG9wZXIiLCJlbWFpbCI6ImRldkBkZXYuY29tIiwiaWF0IjoxNTk3Mzc3MzM0LCJleHAiOjE2MDYwMTczMzR9.BFy6AjKCH83rdIZmKakpElMqYXr-E6L24fUzokJnl9U';
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYTdiNjg0M2U0ZWRhODVjNDhmZjVkOSIsInR5cGUiOiJkZXZlbG9wZXIiLCJlbWFpbCI6ImRldkBkZXYuY29tIiwiaWF0IjoxNTk3Mzc3MzM0LCJleHAiOjE2MDYwMTczMzR9.BFy6AjKCH83rdIZmKakpElMqYXr-E6L24fUzokJnl9U';
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYTdiNjg0M2U0ZWRhODVjNDhmZjVkOSIsInR5cGUiOiJkZXZlbG9wZXIiLCJlbWFpbCI6ImRldkBkZXYuY29tIiwiaWF0IjoxNjA2ODY5MzAxLCJleHAiOjE2MTU1MDkzMDF9.NjUoP4pjXxCcMJn2_1rIdwKCGuRlk78iuCoZhcORsI4';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYTdiNjg0M2U0ZWRhODVjNDhmZjVkOSIsInR5cGUiOiJkZXZlbG9wZXIiLCJlbWFpbCI6ImRldkBkZXYuY29tIiwiaWF0IjoxNjE1NTExMDU4LCJleHAiOjE2MjQxNTEwNTh9.zTKbXAlfJ0slH9TDkkdS-dch8NecYv2nEbeKwtJmnGY';
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNzJiZGJlYjM2NDQ4NTRmN2M0MDdiYSIsInR5cGUiOiJ1c2VyIiwiZW1haWwiOiJqdWFuQGp1YW4uY29tIiwibmFtZSI6Ikp1YW4iLCJsYXN0TmFtZSI6IlBlcmV6IiwiaWF0IjoxNjAxMzU1OTQ1LCJleHAiOjE2MDk5OTU5NDV9.ER6Hz8jsEsxAXZU57o8bNvmhZ401UYVJv1QWjTm4QfM"
  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Accept', "application/json");
  headers.set('Content-Type', "application/json");
  return headers;
};

export const LOGIN_URL = "api/auth/login";
export const REGISTER_URL = "api/auth/register";
export const REQUEST_PASSWORD_URL = "api/auth/forgot-password";

export const REAL_LOGIN_URL = ''

export const ME_URL = "api/me";

export function login(email, password) {
  return axios.post(LOGIN_URL, { email, password });
}

export function register(email, fullname, username, password) {
  return axios.post(REGISTER_URL, { email, fullname, username, password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(ME_URL);
}

export const getUserByTokenReal = body => fetch(getUserTokenPath, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) });

export const loginReal = (collection, body) => fetch(getAPIPath(collection, '', false, true), { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) });
