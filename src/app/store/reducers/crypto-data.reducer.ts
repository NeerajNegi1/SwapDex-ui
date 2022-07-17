import { createReducer, on } from '@ngrx/store';
import * as actions from '../actions/crypto-data.actions';

const initialState = {
  cryptoData: [],
  sellCoin: {},
  buyCoin: {},
};

const CryptoDataState = createReducer(
  initialState,
  on(actions.setCryptoData, (state: any, action: any) => {
    return {
      ...state,
      cryptoData: action.cryptoData,
    };
  }),
  on(actions.setSellCoin, (state: any, action: any) => {
    return {
      ...state,
      sellCoin: action.sellCoin,
    };
  }),
  on(actions.setBuyCoin, (state: any, action: any) => {
    return {
      ...state,
      buyCoin: action.buyCoin,
    };
  })
);

export default function CryptoDataReducer(state: any, action: any) {
  return CryptoDataState(state, action);
}
