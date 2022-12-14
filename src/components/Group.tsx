import React, { useEffect, useState } from "react";
import styles from "./group.module.css";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

type GroupPropsType = {
  name: string;
  countries: string[];
  selectGroupFinalist: (
    groupId: string,
    finalistPosition: "firstFinalist" | "secondFinalist",
    country: string
  ) => void;
  showErrors: boolean;
  groupFirstFinalist: string;
  groupSecondFinalist: string;
};

export const Group = React.memo(
  ({
    name,
    selectGroupFinalist,
    countries,
    showErrors,
    groupFirstFinalist,
    groupSecondFinalist,
  }: GroupPropsType) => {
    const [firstFinalist, setFirstFinalist] = useState<string>("");
    const [secondFinalist, setSecondFinalist] = useState<string>("");
    const [showAlreadySelectedError, setShowAlreadySelectedError] =
      useState<boolean>(false);

    useEffect(() => {
      if (groupFirstFinalist === undefined) {
        setFirstFinalist("");
        selectGroupFinalist(name, "firstFinalist", null);
      }
    }, [groupFirstFinalist]);

    useEffect(() => {
      if (groupSecondFinalist === undefined) {
        setSecondFinalist("");
        selectGroupFinalist(name, "secondFinalist", null);
      }
    }, [groupSecondFinalist]);

    const onFirstWinnerChangeHandler = (e: SelectChangeEvent) => {
      const finalist = e.target.value;

      setFirstFinalist(finalist);

      if (finalist !== secondFinalist) {
        selectGroupFinalist(name, "firstFinalist", finalist);
        setShowAlreadySelectedError(false);
      } else {
        setShowAlreadySelectedError(true);
      }
    };

    const onSecondWinnerChangeHandler = (e: SelectChangeEvent) => {
      const finalist = e.target.value;

      setSecondFinalist(finalist);

      if (finalist !== firstFinalist) {
        selectGroupFinalist(name, "secondFinalist", finalist);
        setShowAlreadySelectedError(false);
      } else {
        setShowAlreadySelectedError(true);
      }
    };

    return (
      <div>
        <h4 className={styles.text}>
          Group <span>{name}</span>
        </h4>

        <div className={styles.selectBlock}>
          <div>
            <span>{`1${name}`}</span>
          </div>
          <div>
            <FormControl fullWidth sx={{ m: 1, minWidth: 90 }}>
              <InputLabel>First finalist</InputLabel>

              <Select
                autoWidth
                label="Country"
                onChange={onFirstWinnerChangeHandler}
                value={groupFirstFinalist || firstFinalist}
                disabled={!!groupFirstFinalist}
              >
                {countries.map((el) => (
                  <MenuItem key={"first" + name + el} value={el}>
                    {el}
                  </MenuItem>
                ))}
              </Select>

              {showErrors && !firstFinalist && (
                <FormHelperText error>Select first finalist</FormHelperText>
              )}

              {showAlreadySelectedError && (
                <FormHelperText error>
                  This finalist is selected in {`2${name}`}
                </FormHelperText>
              )}
            </FormControl>
          </div>
        </div>

        <div className={styles.selectBlock}>
          <div>
            <span>{`2${name}`}</span>
          </div>
          <div>
            <FormControl fullWidth sx={{ m: 1, minWidth: 90 }}>
              <InputLabel>Second finalist</InputLabel>

              <Select
                autoWidth
                label="Country"
                onChange={onSecondWinnerChangeHandler}
                value={groupSecondFinalist || secondFinalist}
                disabled={!!groupSecondFinalist}
              >
                {countries.map((el) => (
                  <MenuItem key={"second" + name + el} value={el}>
                    {el}
                  </MenuItem>
                ))}
              </Select>

              {showErrors && !secondFinalist && (
                <FormHelperText error>select second finalist</FormHelperText>
              )}

              {showAlreadySelectedError && (
                <FormHelperText error>
                  This finalist is selected in {`1${name}`}
                </FormHelperText>
              )}
            </FormControl>
          </div>
        </div>
      </div>
    );
  }
);
