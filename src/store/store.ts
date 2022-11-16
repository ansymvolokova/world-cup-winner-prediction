import { applyMiddleware, combineReducers, createStore } from "redux";
import { newDataReducer } from "./new-data-reducer";
import thunk from "redux-thunk";
import { userDataReducer } from "./user-data-reducer";

const rootReducer = combineReducers({
  data: newDataReducer,
  userData: userDataReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export type AppStateType = ReturnType<typeof rootReducer>;
