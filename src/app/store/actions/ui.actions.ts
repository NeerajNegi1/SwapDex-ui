import { createAction, props } from '@ngrx/store';

export const toggleModelActions = createAction('toggleModel');

export const buySellModeActions = createAction(
  'buySellModeActions',
  props<{ mode: String }>()
);

export const connectWalletNavLoaderActions = createAction(
  'connectWalletNavLoader',
  props<{ connectWalletNavLoader: boolean }>()
);

export const showErrorMessage = createAction(
  'showErrorMessage',
  props<{ msgPayload: any }>()
);
