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
  currentChainName: '',
};

const UserState = createReducer(
  initialState,
  on(actions.setUserWalletAddress, (state: any, action: any) => {
    return {
      ...state,
      userWalletAddress: action.userWalletAddress,
      walletName: action.walletName,
      isWalletConnected: true,
      currentChainId: parseInt(action.chainId),
    };
  }),
  on(actions.setcurrentChainId, (state: any, action: any) => {
    return {
      ...state,
      currentChainId: parseInt(action.currentChainId),
    };
  }),
  on(actions.setChainData, (state: any, action: any) => {
    return {
      ...state,
      currentChainBalance: action.currentChainBalance,
      currentChainSymbol: action.currentChainSymbol,
      currentChainImage: action.currentChainImage,
      currentChainName: action.currentChainName,
    };
  })
);

export default function UserReducer(state: any, action: any) {
  return UserState(state, action);
}
