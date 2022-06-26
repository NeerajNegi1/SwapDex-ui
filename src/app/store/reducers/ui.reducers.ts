import { createReducer, on } from '@ngrx/store';
import * as actions from '../actions/ui.actions';

const initialState = {
  toggleModel: false,
  connectWalletNavLoader: false,
};

const UiState = createReducer(
  initialState,
  on(actions.toggleModelActions, (state) => {
    return {
      ...state,
      toggleModel: !state.toggleModel,
    };
  }),
  on(actions.connectWalletNavLoaderActions, (state, action) => {
    return {
      ...state,
      connectWalletNavLoader: action.connectWalletNavLoader,
    };
  })
);

export default function UiReducer(state: any, action: any) {
  return UiState(state, action);
}
