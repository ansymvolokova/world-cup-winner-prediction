import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import { newDataReducer } from "./new-data-reducer";
import { userDataReducer } from "./user-data-reducer";

const rootReducer = combineReducers({
  data: newDataReducer,
  userData: userDataReducer,
});

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk, createLogger())
);

export type AppStateType = ReturnType<typeof rootReducer>;
