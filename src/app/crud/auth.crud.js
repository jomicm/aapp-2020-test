import axios from "axios";

const {
  REACT_APP_API_SERVER,
  REACT_APP_API_PORT,
  REACT_APP_API_VERSION,
  REACT_APP_API_DB,
  REACT_APP_API_COLLECTION
} = process.env;

export const LOGIN_URL = "api/auth/login";
export const REGISTER_URL = "api/auth/register";
export const REQUEST_PASSWORD_URL = "api/auth/forgot-password";
export const REAL_LOGIN_URL = '';
export const ME_URL = "api/me";
export const GET_USER_TOKEN_URL = 'users/getuserbytoken';

const host = `${REACT_APP_API_SERVER}:${REACT_APP_API_PORT}/`;
const getUserTokenPath = `${host}${GET_USER_TOKEN_URL}`;

const version = REACT_APP_API_VERSION;
const db = `${REACT_APP_API_DB}/`;
const collection = `${REACT_APP_API_COLLECTION}/`;

const getAPIPath = (_collection = collection, _id = '', isEncrypt = false, isUserValidation = false) =>
  `${host}${version}${db}${_collection}${_id}${isEncrypt ? '/encrypt' : ''}${isUserValidation ? '/validuser' : ''}`;

const getHeaders = () => {
  const headers = new Headers();
  headers.set('Accept', "application/json");
  headers.set('Content-Type', "application/json");
  return headers;
};

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
