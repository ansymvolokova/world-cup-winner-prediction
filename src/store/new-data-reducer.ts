import {
  GroupType,
  NewDataState,
  RoundType,
  WinnerSelection,
} from "../types/types";

export const generateRound = (groups: GroupType[]) => ({
  type: "ROUND",
  groups,
});

export const generateQuarterFinal = (selection: WinnerSelection) => ({
  type: "QUARTER-FINAL",
  selection,
});

export const generateSemiFinal = (selection: WinnerSelection) => ({
  type: "SEMI-FINAL",
  selection,
});

export const generateFinalAndThirdPlace = (selection: WinnerSelection) => ({
  type: "FINAL-AND-THIRD-PLACE",
  selection,
});

export const saveThirdPlace = (winner: string) => ({
  type: "SAVE-THIRD-PLACE",
  winner,
});

export const saveFinal = (winner: string) => ({
  type: "SAVE-FINAL",
  winner,
});

export const resetSelection = () => ({
  type: "RESET-SELECTION",
});

export const goBack = () => ({
  type: "GO-BACK",
});

const generateRoundsFromGroups = (groups: GroupType[]): RoundType[] => {
  // [1, 2, 3, 4, 5, 6, 7, 8] --- GroupType[]
  let groupIndex = 1;

  const splitIntoTwoParts = (arr: GroupType[]) => {
    return [arr.slice(0, arr.length / 2), arr.slice(arr.length / 2)];
  };

  const generateNeighbours = (
    slicedGroups: GroupType[],
    reverseResult: boolean
  ) => {
    const neighbours: RoundType[] = [];

    for (let i = 0; i < slicedGroups.length - 1; i += 2) {
      const first = slicedGroups[i];
      const second = slicedGroups[i + 1];

      neighbours.push({
        roundId: groupIndex,
        firstPlayer: { country: first.countries[0], id: `1${first.name}` },
        secondPlayer: { country: second.countries[1], id: `2${second.name}` },
      });

      groupIndex++;
    }

    return reverseResult ? neighbours.reverse() : neighbours;
  };

  const generated = splitIntoTwoParts(groups) // [[1, 2, 3, 4] [5, 6, 7, 8]] --- GroupType[][]
    .map((part, index) => [
      generateNeighbours(part, false), // [[[1, 2], [4, 3]], [[5, 6], [7, 8]]] --- RoundType[][][]
      generateNeighbours([...part].reverse(), !index), // [[[1, 2], [4, 3]], [[5, 6], [7, 8]]] --- RoundType[][][]
    ]) // [[[1, 2], [4, 3]], [[5, 6], [7, 8]]] --- RoundType[][][]
    .flat(); // [[1, 2], [4, 3] [5, 6], [7, 8]] --- RoundType[][]

  const centerIndex = generated.length / 2;
  generated[centerIndex - 1] = generated.splice(
    centerIndex,
    1,
    generated[centerIndex - 1]
  )[0]; // [[1, 2], [5, 6], [4, 3], [7, 8]] --- RoundType[][]

  return generated.flat(); // [1, 2, 5, 6, 4, 3, 7, 8] --- RoundType[]
};

const generateRounds = (
  rounds: RoundType[],
  order?: { [id: number]: number }
): RoundType[] => {
  let roundIndex = 1;

  const newRounds = [];

  for (let i = 0; i < rounds.length - 1; i += 2) {
    const first = rounds[i] as RoundType;
    const second = rounds[i + 1] as RoundType;

    newRounds.push({
      firstPlayer: { country: first.winner, id: first.roundId.toString() },
      secondPlayer: { country: second.winner, id: second.roundId.toString() },
      roundId: order ? order[roundIndex] : roundIndex,
    });

    roundIndex++;
  }

  return newRounds;
};

const setRoundWinners = (
  rounds: RoundType[],
  winnerSelection: { [roundId: string]: string }
): RoundType[] => {
  return rounds.map((round) => {
    return {
      ...round,
      winner: winnerSelection[round.roundId],
    };
  });
};

export const initialState: NewDataState = {
  selectionState: [
    {
      name: "A",
      countries: ["Qatar", "Ecuador", "Senegal", "Netherlands"],
    },
    {
      name: "B",
      countries: ["England", "Iran", "USA", "Wales"],
    },
    {
      name: "C",
      countries: ["Argentina", "Saudi Arabia", "Mexico", "Poland"],
    },
    {
      name: "D",
      countries: ["France", "Australia", "Denmark", "Tunisia"],
    },
    {
      name: "E",
      countries: ["Spain", "Costa Rica", "Germany", "Japan"],
    },
    {
      name: "F",
      countries: ["Belgium", "Canada", "Morocco", "Croatia"],
    },
    {
      name: "G",
      countries: ["Brazil", "Serbia", "Switzerland", "Cameroon"],
    },
    {
      name: "H",
      countries: ["Portugal", "Ghana", "Uruguay", "South Korea"],
    },
  ],
  roundState: [],
  quarterFinalState: [],
  semiFinalState: [],
  thirdPlaceState: [],
  finalState: [],
  roundsToDisplay: [],
};

export const newDataReducer = (
  state: NewDataState = initialState,
  action: any
) => {
  switch (action.type) {
    case "ROUND":
      const groups = action.groups as GroupType[];

      // set finalists to existing groups
      const updatedSelectionState = state.selectionState.map((group) => {
        const actionGroup = groups.find((g) => g.name === group.name);

        const [firstFinalist, secondFinalist] = actionGroup.countries;

        return {
          ...group,
          firstFinalist,
          secondFinalist,
        };
      });

      return {
        ...state,
        selectionState: updatedSelectionState,
        roundState: generateRoundsFromGroups(groups),
        roundsToDisplay: ["roundState"],
      };

    case "QUARTER-FINAL": {
      const updatedRoundState = setRoundWinners(
        state.roundState,
        action.selection
      );

      const roundOrder: { [id: number]: number } = {
        1: 2,
        2: 1,
        3: 4,
        4: 3,
      };

      return {
        ...state,
        roundState: updatedRoundState,
        quarterFinalState: generateRounds(updatedRoundState, roundOrder),
        roundsToDisplay: [...state.roundsToDisplay, "quarterFinalState"],
      };
    }
    case "SEMI-FINAL": {
      const updatedQuarterFinalState = setRoundWinners(
        state.quarterFinalState,
        action.selection
      );

      return {
        ...state,
        quarterFinalState: updatedQuarterFinalState,
        semiFinalState: generateRounds(updatedQuarterFinalState),
        roundsToDisplay: [...state.roundsToDisplay, "semiFinalState"],
      };
    }

    case "FINAL-AND-THIRD-PLACE": {
      const updatedSemiFinalState = setRoundWinners(
        state.semiFinalState,
        action.selection
      );

      const [firstLoser, secondLoser] = updatedSemiFinalState.map((round) => {
        const country =
          round.winner === round.firstPlayer.country
            ? round.secondPlayer.country
            : round.firstPlayer.country;

        return {
          roundId: round.roundId,
          country,
        };
      }, {});

      return {
        ...state,
        semiFinalState: updatedSemiFinalState,
        thirdPlaceState: [
          {
            firstPlayer: {
              country: firstLoser.country,
              id: firstLoser.roundId,
            },
            secondPlayer: {
              country: secondLoser.country,
              id: secondLoser.roundId,
            },
            roundId: 1,
          },
        ],
        finalState: generateRounds(updatedSemiFinalState),
        roundsToDisplay: [...state.roundsToDisplay, "thirdPlaceState"],
      };
    }

    case "SAVE-THIRD-PLACE": {
      return {
        ...state,
        thirdPlaceState: [
          {
            ...state.thirdPlaceState[0],
            winner: action.winner,
          },
        ],
        roundsToDisplay: [...state.roundsToDisplay, "finalState"],
      };
    }
    case "SAVE-FINAL": {
      return {
        ...state,
        finalState: [
          {
            ...state.finalState[0],
            winner: action.winner,
          },
        ],
      };
    }

    case "RESET-SELECTION": {
      return initialState;
    }

    case "GO-BACK": {
      const rowsList = state.roundsToDisplay.slice(0, -1);

      if (rowsList.length === 0) {
        const resetSelectionState = state.selectionState.map((group) => {
          return {
            ...group,
            firstFinalist: null,
            secondFinalist: null,
          };
        });

        return {
          ...state,
          selectionState: resetSelectionState,
          roundsToDisplay: rowsList,
        } as NewDataState;
      }

      const previousRoundRow = rowsList[rowsList.length - 1];

      const resetRound = state[previousRoundRow].map((round) => {
        return {
          ...round,
          winner: null,
        };
      });

      return {
        ...state,
        roundsToDisplay: rowsList,
        [previousRoundRow]: resetRound,
      } as NewDataState;
    }

    default:
      return state;
  }
};
