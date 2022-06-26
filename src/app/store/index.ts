import { StoreModule } from '@ngrx/store';
import UiReducer from './reducers/ui.reducers';
import UserReducer from './reducers/user.reducer';

export const AppStore = StoreModule.forRoot({
  ui: UiReducer,
  user: UserReducer,
});
