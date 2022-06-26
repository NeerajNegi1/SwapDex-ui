import { createReducer, on } from '@ngrx/store';
import * as actions from '../actions/user.actions';

const initialState = {
  userWalletAddress: '',
  isWalletConnected: false,
  walletName: '',
};

const UserState = createReducer(
  initialState,
  on(actions.setUserWalletAddress, (state: any, action: any) => {
    return {
      ...state,
      userWalletAddress: action.userWalletAddress,
      walletName: action.walletName,
      isWalletConnected: true,
    };
  })
);

export default function UserReducer(state: any, action: any) {
  return UserState(state, action);
}
