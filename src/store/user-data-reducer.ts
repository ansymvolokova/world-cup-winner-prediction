import { DataState } from "../types/types";
import { Dispatch } from "redux";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { resetSelection } from "./new-data-reducer";

export type User = { id: string; name: string };

const setUserNames = (users: User[]) => ({
  type: "SET-USERS",
  users,
});

const setSelection = (selection: DataState, userName: string) => ({
  type: "SET-SELECTION",
  selection,
  userName,
});

export const requestUserList = (): any => {
  return async (dispatch: Dispatch) => {
    const result = await axios.get(
      `https://world-cup-2022.classmethodeurope.workers.dev/`
    );

    const users = result.data.map(
      (result: { name: string; metadata: { name: string } }) => {
        return {
          id: result.name,
          name: result.metadata.name,
        };
      }
    );

    dispatch(setUserNames(users));
  };
};

export const requestSelection = (id: string | undefined): any => {
  return async (dispatch: Dispatch) => {
    const result = await axios.get(
      `https://world-cup-2022.classmethodeurope.workers.dev/?id=${id}`
    );

    dispatch(setSelection(result.data.selection, result.data.name));
  };
};

export const submitSelection = (name: string, selection: DataState): any => {
  return async (dispatch: Dispatch) => {
    await axios.post(`https://world-cup-2022.classmethodeurope.workers.dev/`, {
      id: uuidv4(),
      name,
      selection,
    });

    dispatch(resetSelection());
    dispatch(requestUserList());
  };
};

export type UserDataState = {
  users: User[];
  userName: string | null;
  selection: DataState | null;
};

const initialState: UserDataState = {
  users: [],
  userName: null,
  selection: null,
};

export const userDataReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET-USERS": {
      return { ...state, users: action.users };
    }
    case "SET-SELECTION": {
      return {
        ...state,
        selection: action.selection,
        userName: action.userName,
      };
    }
    default:
      return state;
  }
};
