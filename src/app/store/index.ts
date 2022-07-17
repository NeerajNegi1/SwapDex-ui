import { StoreModule } from '@ngrx/store';
import CryptoDataReducer from './reducers/crypto-data.reducer';
import UiReducer from './reducers/ui.reducers';
import UserReducer from './reducers/user.reducer';

export const AppStore = {
  ui: UiReducer,
  user: UserReducer,
  cryptoData: CryptoDataReducer,
};
