import { createAction, props } from '@ngrx/store';

export const toggleModelActions = createAction('toggleModel');

export const connectWalletNavLoaderActions = createAction(
  'connectWalletNavLoader',
  props<{ connectWalletNavLoader: boolean }>()
);
