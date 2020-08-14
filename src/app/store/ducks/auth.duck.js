import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import { getUserByToken, getUserByTokenReal } from "../../crud/auth.crud";
import * as routerHelpers from "../../router/RouterHelpers";

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API"
};

const initialAuthState = {
  user: undefined,
  authToken: undefined
};

export const toAbsoluteUrl = pathname => process.env.PUBLIC_URL + pathname;

export const reducer = persistReducer(
    { storage, key: "demo1-auth", whitelist: ["user", "authToken"] },
    (state = initialAuthState, action) => {
      switch (action.type) {
        case actionTypes.Login: {
          const { authToken } = action.payload;

          return { authToken, user: undefined };
        }

        case actionTypes.Register: {
          const { authToken } = action.payload;

          return { authToken, user: undefined };
        }

        case actionTypes.Logout: {
          routerHelpers.forgotLastLocation();
          return initialAuthState;
        }

        case actionTypes.UserLoaded: {
          const { user } = action.payload;

          return { ...state, user };
        }

        default:
          return state;
      }
    }
);

export const actions = {
  login: authToken => ({ type: actionTypes.Login, payload: { authToken } }),
  register: authToken => ({
    type: actionTypes.Register,
    payload: { authToken }
  }),
  logout: () => ({ type: actionTypes.Logout }),
  requestUser: user => ({ type: actionTypes.UserRequested, payload: { user } }),
  fulfillUser: user => ({ type: actionTypes.UserLoaded, payload: { user } })
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    // const { data: user } = yield getUserByToken();
    // const tk = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMDE2NWQ0MGU1NzAxMmFmZTgyZmRlYSIsInR5cGUiOiJ1c2VyIiwiZW1haWwiOiJvbmVAb25lLmNvbSIsIm5hbWUiOiJGaXJzdCIsImxhc3ROYW1lIjoiTGFzdCIsImlhdCI6MTU5MzkzNDk1MywiZXhwIjoxNjAyNTc0OTUzfQ.mpNy9DfuOJGU6T3mc2NEzsAAQsY-_bQkEINu8-wu08s';
    const user = yield getUserByTokenReal();

    // console.log('Duck user:', user)

    yield put(actions.fulfillUser(user));
  });
}
