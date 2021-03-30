
export const actionTypes = {
  Search: '[Search] Action',
  Loading: '[Loading] Action',
  CustomAlert: '[CustomAlert] Action',
  SavedAlert: '[SavedAlert] Action',
  UpdatedAlert: '[UpdatedAlert] Action',
  DeletedAlert: '[DeletedAlert] Action',
  ErrorAlert: '[ErrorAlert] Action',
  FillFieldsAlert: '[FillFieldsAlert] Action',
  SelectValuesAlert: '[SelectValuesAlert] Action',
};

const initialGeneralState = {
  globalSearch: {},
  alertControls: {},
  generalLoading: {
    active: false
  }
};

export const reducer = (state = initialGeneralState, action) => {
  switch (action.type) {
    case actionTypes.Search: {
      return { ...state, globalSearch: action.payload };
    }
    case actionTypes.Loading: {
      return { ...state, generalLoading: action.payload };
    }
    case actionTypes.CustomAlert: {
      return { ...state, alertControls: action.payload };
    }
    case actionTypes.SavedAlert: {
      return {
        ...state, alertControls: {
          open: true,
          message: 'Saved!',
          type: 'success'
        }
      };
    }
    case actionTypes.UpdatedAlert: {
      return {
        ...state, alertControls: {
          open: true,
          message: 'Updated Successfully!',
          type: 'success'
        }
      };
    }
    case actionTypes.DeletedAlert: {
      return {
        ...state, alertControls: {
          open: true,
          message: 'Deleted Successfully!',
          type: 'success'
        }
      };
    }
    case actionTypes.ErrorAlert: {
      return {
        ...state, alertControls: {
          open: true,
          message: 'Something went wrong, please try again later',
          type: 'error'
        }
      };
    }
    case actionTypes.FillFieldsAlert: {
      return {
        ...state, alertControls: {
          open: true,
          message: 'Please fill out missing fields',
          type: 'warning'
        }
      };
    }
    case actionTypes.SelectValuesAlert: {
      return {
        ...state, alertControls: {
          open: true,
          message: 'Select values before saving',
          type: 'warning'
        }
      };
    }
    default:
      return state;
  }
}

export const actions = {
  setGeneralSearch: searchValues => ({ type: actionTypes.Search, payload: searchValues }),
  setGeneralLoading: loadingValues => ({ type: actionTypes.Loading, payload: loadingValues }),
  showCustomAlert: alertValues => ({ type: actionTypes.CustomAlert, payload: alertValues }),
  showSavedAlert: () => ({ type: actionTypes.SavedAlert }),
  showUpdatedAlert: () => ({ type: actionTypes.UpdatedAlert }),
  showDeletedAlert: () => ({ type: actionTypes.DeletedAlert }),
  showErrorAlert: () => ({ type: actionTypes.ErrorAlert }),
  showFillFieldsAlert: () => ({ type: actionTypes.FillFieldsAlert }),
  showSelectValuesAlert: () => ({ type: actionTypes.SelectValuesAlert }),
};
