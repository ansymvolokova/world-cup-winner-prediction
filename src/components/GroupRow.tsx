import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@mui/material";
import { generateRound } from "../store/new-data-reducer";
import { GroupType } from "../types/types";
import styles from "./group.module.css";
import { Group } from "./Group";

type GroupRowPropsType = {
  groups: Array<GroupType>;
  showSave: boolean;
};

type GroupRowSelection = {
  [key: string]: { firstFinalist: string; secondFinalist: string };
};

const getSelectionInitialState = (groups: GroupType[]) => {
  return groups.reduce((acc, group) => {
    return {
      ...acc,
      [group.name]: { firstFinalist: null, secondFinalist: null },
    };
  }, {});
};

export const GroupRow = React.memo(
  ({ groups, showSave }: GroupRowPropsType) => {
    const [selection, setSelection] = useState<GroupRowSelection>(
      getSelectionInitialState(groups)
    );

    const [savePossible, setSavePossible] = useState<boolean>(false);
    const [showErrors, setShowErrors] = useState<boolean>(false);
    const dispatch = useDispatch();

    useEffect(() => {
      const everythingSelected = Object.keys(selection).every((key) => {
        return (
          selection[key].firstFinalist !== null &&
          selection[key].secondFinalist !== null
        );
      });

      setSavePossible(everythingSelected);
    }, [selection]);

    const selectGroupFinalist = useCallback(
      (
        groupId: string,
        finalistPosition: "firstFinalist" | "secondFinalist",
        country: string
      ) => {
        setSelection({
          ...selection,
          [groupId]: {
            ...selection[groupId],
            [finalistPosition]: country,
          },
        });
      },
      [selection]
    );

    const save = () => {
      if (!savePossible) {
        setShowErrors(true);
        return;
      }

      const roundGroups = Object.entries(selection).map(
        ([name, { firstFinalist, secondFinalist }]) => {
          return {
            name,
            countries: [firstFinalist, secondFinalist],
          };
        }
      );

      dispatch(generateRound(roundGroups));
    };

    return (
      <div className={styles.tableElement}>
        <div className={"table"}>
          {groups.map((el) => (
            <Group
              key={"group-row" + el.name}
              name={el.name}
              countries={el.countries}
              selectGroupFinalist={selectGroupFinalist}
              showErrors={showErrors}
              groupFirstFinalist={el.firstFinalist}
              groupSecondFinalist={el.secondFinalist}
            />
          ))}
        </div>

        {showSave && (
          <div className={styles.button}>
            <Button variant="contained" onClick={save}>
              Save
            </Button>
          </div>
        )}
      </div>
    );
  }
);
