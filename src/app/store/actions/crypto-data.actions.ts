import { createAction, props } from '@ngrx/store';

export const setCryptoData = createAction(
  'cryptoData',
  props<{ cryptoData: [] }>()
);

export const setSellCoin = createAction(
  'setSellCoin',
  props<{ sellCoin: any }>()
);

export const setBuyCoin = createAction('setBuyCoin', props<{ buyCoin: any }>());
