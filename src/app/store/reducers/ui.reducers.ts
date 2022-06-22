import { createReducer, on } from "@ngrx/store";
import * as actions from "../actions/ui.actions"


const initialState = {
    toggleNavNetwork: false
};

const UiState = createReducer(
    initialState,
    on(actions.toggleNavNetworkActions, (state) => {
        return {
            ...state,
            toggleNavNetwork: !state.toggleNavNetwork
        }
    })
)


export default function UiReducer(state: any, action:any) {
    return UiState(state, action);
};