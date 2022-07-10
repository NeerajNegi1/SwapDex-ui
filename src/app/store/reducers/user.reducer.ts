import { createReducer, on } from '@ngrx/store';
import * as actions from '../actions/user.actions';

const initialState = {
  userWalletAddress: '',
  isWalletConnected: false,
  walletName: '',
  currentChainId: '',
  currentChainBalance: 0,
  currentChainSymbol: '',
  currentChainImage: '',
};

const UserState = createReducer(
  initialState,
  on(actions.setUserWalletAddress, (state: any, action: any) => {
    return {
      ...state,
      userWalletAddress: action.userWalletAddress,
      walletName: action.walletName,
      isWalletConnected: true,
      currentChainId: parseInt(action.chainId, 16),
    };
  }),
  on(actions.setcurrentChainId, (state: any, action: any) => {
    return {
      ...state,
      currentChainId: parseInt(action.currentChainId, 16),
    };
  })
);

export default function UserReducer(state: any, action: any) {
  return UserState(state, action);
}
