
export const actionTypes = {
  Search: "[Search] Action",
};

const initialGeneralState = {
  globalSearch: {},
};

export const reducer  = (state = initialGeneralState, action) => {
  switch (action.type) {
    case actionTypes.Search: {
      return { globalSearch: action.payload };
    }

    default:
      return state;
  }
}

export const actions = {
  setGeneralSearch: searchValues => ({ type: actionTypes.Search, payload: searchValues }),
};
