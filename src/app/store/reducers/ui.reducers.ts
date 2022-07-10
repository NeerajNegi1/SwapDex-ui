import { createReducer, on } from '@ngrx/store';
import * as actions from '../actions/ui.actions';

const initialState = {
  toggleModel: false,
  connectWalletNavLoader: false,
  mode: '',
  showerror: {
    state: false,
    message: '',
  },
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
  }),
  on(actions.buySellModeActions, (state: any, action: any) => {
    return {
      ...state,
      mode: action.mode,
    };
  }),
  on(actions.showErrorMessage, (state: any, action: any) => {
    return {
      ...state,
      showerror: action.msgPayload,
    };
  })
);

export default function UiReducer(state: any, action: any) {
  return UiState(state, action);
}
