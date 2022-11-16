import React, { useState } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { RoundType } from "../types/types";
import styles from "./group.module.css";

type RoundProps = RoundType & {
  selectRoundWinner: (roundId: number, winner: string) => void;
  showErrors: boolean;
  roundName: string;
  roundWinner: string | undefined;
};

export const Round = React.memo(
  ({
    roundName,
    roundId,
    firstPlayer,
    secondPlayer,
    selectRoundWinner,
    showErrors,
    roundWinner,
  }: RoundProps) => {
    const [winner, setWinner] = useState<string>("");

    const onWinnerChangeHandler = (e: SelectChangeEvent) => {
      setWinner(e.target.value);
      selectRoundWinner(roundId, e.target.value);
    };

    return (
      <div className={styles.round}>
        <h4>{roundName}</h4>
        <p>{` First player (${firstPlayer.id}): ${firstPlayer.country}`}</p>
        <p>{`Second player (${secondPlayer.id}): ${secondPlayer.country}`}</p>

        <FormControl fullWidth sx={{ m: 1, minWidth: 60 }}>
          <InputLabel>Winner</InputLabel>

          <Select
            autoWidth
            label="select winner"
            onChange={onWinnerChangeHandler}
            value={roundWinner || winner}
            disabled={!!roundWinner}
          >
            <MenuItem value={firstPlayer.country}>
              {firstPlayer.country}
            </MenuItem>
            <MenuItem value={secondPlayer.country}>
              {secondPlayer.country}
            </MenuItem>
          </Select>
        </FormControl>

        {showErrors && !winner && (
          <FormHelperText error>Please choose round winner</FormHelperText>
        )}
      </div>
    );
  }
);
