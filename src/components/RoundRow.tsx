import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { RoundStates, RoundType } from "../types/types";
import { Round } from "./Round";
import { useDispatch } from "react-redux";
import styles from "./group.module.css";
import {
  generateFinalAndThirdPlace,
  generateQuarterFinal,
  generateSemiFinal,
  goBack,
  saveFinal,
  saveThirdPlace,
} from "../store/new-data-reducer";

type RoundRowProps = {
  roundPrefix: string;
  rounds: Array<RoundType>;
  roundKey: RoundStates;
  handleOpenModal: () => void;
  showSave: boolean;
};

const getRoundInitialState = (rounds: RoundType[]) =>
  rounds.reduce(
    (acc, round) => ({
      ...acc,
      [round.roundId]: null,
    }),
    {}
  );

export const RoundRow = React.memo(
  ({
    rounds,
    roundKey,
    roundPrefix,
    handleOpenModal,
    showSave,
  }: RoundRowProps) => {
    const [roundSelection, setRoundSelection] = useState<{
      [roundId: string]: string;
    }>(getRoundInitialState(rounds));

    const [savePossible, setSavePossible] = useState<boolean>(false);
    const [showErrors, setShowErrors] = useState<boolean>(false);
    const dispatch = useDispatch();

    const selectRoundWinner = useCallback(
      (roundId: number, winner: string) => {
        setRoundSelection({
          ...roundSelection,
          [roundId]: winner,
        });
      },
      [roundSelection]
    );

    useEffect(() => {
      const everythingSelected = Object.keys(roundSelection).every(
        (key) => roundSelection[key] !== null
      );
      setSavePossible(everythingSelected);
    }, [roundSelection]);

    const save = () => {
      if (!savePossible) {
        setShowErrors(true);
        return;
      }

      switch (roundKey) {
        case "roundState":
          dispatch(generateQuarterFinal(roundSelection));
          break;
        case "quarterFinalState":
          dispatch(generateSemiFinal(roundSelection));
          break;
        case "semiFinalState":
          dispatch(generateFinalAndThirdPlace(roundSelection));
          break;
        case "thirdPlaceState":
          dispatch(saveThirdPlace(Object.values(roundSelection)[0]));
          break;
        case "finalState":
          dispatch(saveFinal(Object.values(roundSelection)[0]));
          handleOpenModal();
          break;
      }
    };

    const handleGoBack = () => {
      dispatch(goBack());
    };

    return (
      <>
        <div className={"table"}>
          {rounds.map((el) => (
            <Round
              key={roundPrefix + el.roundId}
              roundId={el.roundId}
              roundName={roundPrefix + el.roundId}
              firstPlayer={el.firstPlayer}
              secondPlayer={el.secondPlayer}
              selectRoundWinner={selectRoundWinner}
              showErrors={showErrors}
              roundWinner={el.winner}
            />
          ))}
        </div>

        {showSave && (
          <div className={styles.button}>
            <Button variant="contained" onClick={save}>
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleGoBack}>
              Go Back
            </Button>
          </div>
        )}
      </>
    );
  }
);
