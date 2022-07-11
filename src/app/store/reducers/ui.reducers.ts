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
  snackbar: {
    state: false,
    message: '',
  },
  isSwapStarted: false,
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
  }),
  on(actions.showSnackbar, (state: any, action: any) => {
    return {
      ...state,
      snackbar: {
        state: action.state,
        message: action.message,
      },
    };
  }),
  on(actions.showSnackbar, (state: any, action: any) => {
    return {
      ...state,
      isSwapStarted: action.state,
    };
  })
);

export default function UiReducer(state: any, action: any) {
  return UiState(state, action);
}
