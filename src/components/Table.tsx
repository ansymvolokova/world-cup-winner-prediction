import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppStateType } from "../store/store";
import {
  requestSelection,
  submitSelection,
  UserDataState,
} from "../store/user-data-reducer";
import {
  GroupType,
  NewDataState,
  RoundStates,
  RoundType,
} from "../types/types";
import { RoundRow } from "./RoundRow";
import { BasicModal } from "./Modal";
import { GroupRow } from "./GroupRow";

const roundPrefix: Record<string, string> = {
  roundState: "Round of 16 - ",
  quarterFinalState: "Quarter Final ",
  semiFinalState: "Semi-Final ",
  thirdPlaceState: "Third place ",
  finalState: "Final ",
};

export const Table = () => {
  const dispatch = useDispatch();
  const params = useParams();

  // new selection data
  const newDataState = useSelector<AppStateType, NewDataState>(
    (state) => state.data
  );
  // user's selection data
  const userDataState = useSelector<AppStateType, UserDataState>(
    (state) => state.userData
  );

  const [showSave, setShowSave] = useState(false);
  const [data, setData] = useState<{
    selectionState: GroupType[];
    rows: [RoundStates, RoundType[]][];
  }>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (params.id !== "new") {
      dispatch(requestSelection(params.id));
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    const { roundsToDisplay, ...newData } = newDataState;
    const { userName, selection: userData } = userDataState;

    const stateData = params.id === "new" ? newData : userData;

    if (stateData) {
      const { selectionState, ...roundStates } = stateData;

      const rows = Object.entries(roundStates).filter(
        ([roundState, rounds]) => {
          return (
            rounds.length > 0 &&
            ((params.id === "new" &&
              roundsToDisplay.includes(roundState as RoundStates)) ||
              params.id !== "new")
          );
        }
      ) as [RoundStates, RoundType[]][];

      setData({ selectionState, rows });
      setShowSave(params.id === "new");
    }
  }, [params.id, newDataState, userDataState]);

  const handleOpenModal = useCallback(() => setOpenModal(true), []);
  const handleCloseModal = useCallback(() => setOpenModal(false), []);

  const sendSelection = useCallback(
    (name: string) => {
      const { roundsToDisplay, ...newData } = newDataState;
      dispatch(submitSelection(name, newData));
      handleCloseModal();
    },
    [dispatch, handleCloseModal, newDataState]
  );

  return (
    data && (
      <div>
        {(params.id === "new" || userDataState.userName) && (
          <h2 className={"text"}>
            {params.id === "new"
              ? "New Selection"
              : userDataState.userName + "'s Selection"}
          </h2>
        )}

        <GroupRow
          groups={data.selectionState}
          showSave={showSave && data.rows.length === 0}
        />

        {data.rows.map(([roundKey, rounds], index) => (
          <RoundRow
            roundKey={roundKey}
            roundPrefix={roundPrefix[roundKey]}
            rounds={rounds}
            key={roundKey}
            handleOpenModal={handleOpenModal}
            showSave={showSave && index === data.rows.length - 1}
          />
        ))}

        {openModal && (
          <BasicModal
            open={openModal}
            handleClose={handleCloseModal}
            submit={sendSelection}
          />
        )}
      </div>
    )
  );
};
