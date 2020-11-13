import _ from 'lodash/fp';

import {
  GET_CLAIM_DETAIL,
  SET_CLAIM_DETAIL,
  SET_CLAIMS_UNAVAILABLE,
} from '../actions/index.jsx';

const initialState = {
  detail: null,
  loading: true,
};

export default function claimDetailReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CLAIM_DETAIL: {
      return _.assign(state, {
        detail: action.claim,
        loading: false,
      });
    }
    case GET_CLAIM_DETAIL: {
      return _.set('loading', true, state);
    }
    case SET_CLAIMS_UNAVAILABLE: {
      return _.assign(state, {
        detail: null,
        loading: false,
      });
    }
    default:
      return state;
  }
}
