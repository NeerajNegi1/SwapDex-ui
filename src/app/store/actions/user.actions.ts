import { createAction, props } from '@ngrx/store';

export const setUserWalletAddress = createAction(
  'userWalletAddress',
  props<{ userWalletAddress: string; walletName: String }>()
);
