import React, { useEffect } from "react";
import "./App.css";
import { Table } from "./components/Table";
import { List, ListItem } from "@mui/material";
import { Route, Routes, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { requestUserList, UserDataState } from "./store/user-data-reducer";
import { AppStateType } from "./store/store";

function App() {
  const dispatch = useDispatch();

  const { users } = useSelector<AppStateType, UserDataState>(
    (state) => state.userData
  );

  useEffect(() => {
    dispatch(requestUserList());
  }, [dispatch]);

  return (
    <>
      <div className="App">
        <div className="menu">
          <List>
            <ListItem>
              <Link to={`/new`}>New selection</Link>
            </ListItem>
            {users.length
              ? users.map((user) => (
                  <ListItem key={user.id}>
                    <Link to={`/${user.id}`}>{user.name}'s selection</Link>
                  </ListItem>
                ))
              : null}
          </List>
        </div>

        <div className="content">
          <h1 className={"text"}>World Cup 2022 in Qatar</h1>
          <Routes>
            <Route path={"/:id"} element={<Table />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
