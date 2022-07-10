import { createAction, props } from '@ngrx/store';

export const setUserWalletAddress = createAction(
  'userWalletAddress',
  props<{
    userWalletAddress: string;
    walletName: String;
    chainId: String;
  }>()
);

export const setcurrentChainId = createAction(
  'currentChainId',
  props<{
    currentChainId: String;
  }>()
);

export const setChainData = createAction(
  'setChainData',
  props<{
    currentChainBalance: number;
    currentChainSymbol: string;
    currentChainImage: string;
  }>()
);
