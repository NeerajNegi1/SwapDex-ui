import { StoreModule } from "@ngrx/store";
import UiReducer from "./reducers/ui.reducers";

export const AppStore = StoreModule.forRoot({
  ui: UiReducer,
});
