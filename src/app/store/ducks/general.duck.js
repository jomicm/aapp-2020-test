
export const actionTypes = {
  Search: '[Search] Action',
  Alert: '[Alert] Action',
  Loading: '[Loading] Action',
};

const initialGeneralState = {
  globalSearch: {},
  alertControls:{},
  generalLoading:{
    active: false
  }
};

export const reducer  = (state = initialGeneralState, action) => {
  switch (action.type) {
    case actionTypes.Search: {
      return { ...state, globalSearch: action.payload };
    }
    case actionTypes.Alert: {
      return { ...state, alertControls: action.payload };
    }
    case actionTypes.Loading: {
      return { ...state, generalLoading: action.payload };
    }
    default:
      return state;
  }
}

export const actions = {
  setGeneralSearch: searchValues => ({ type: actionTypes.Search, payload: searchValues }),
  setAlertControls: alertValues => ({ type: actionTypes.Alert, payload: alertValues }),
  setGeneralLoading: loadingValues => ({ type: actionTypes.Loading, payload: loadingValues }),
};
