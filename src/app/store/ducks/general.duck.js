
export const actionTypes = {
  Search: '[Search] Action',
  Alert: '[Alert] Action',
};

const initialGeneralState = {
  globalSearch: {},
  alertControls:{},
};

export const reducer  = (state = initialGeneralState, action) => {
  switch (action.type) {
    case actionTypes.Search: {
      return { globalSearch: action.payload };
    }
    case actionTypes.Alert: {
      return { alertControls: action.payload };
    }
    default:
      return state;
  }
}

export const actions = {
  setGeneralSearch: searchValues => ({ type: actionTypes.Search, payload: searchValues }),
  setAlertControls: alertValues => ({ type: actionTypes.Alert, payload: alertValues }),
};
