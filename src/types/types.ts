export type GroupType = {
  name: string;
  countries: string[];
  firstFinalist?: string;
  secondFinalist?: string;
};

export type RoundType = {
  firstPlayer: { country: string; id: string };
  secondPlayer: { country: string; id: string };
  roundId: number;
  winner?: string;
};

export type RoundStates =
  | "roundState"
  | "quarterFinalState"
  | "semiFinalState"
  | "thirdPlaceState"
  | "finalState";

export type DataState = {
  selectionState: GroupType[];
} & Record<RoundStates, RoundType[]>;

export type NewDataState = DataState & { roundIndexToDisplay: number };

export type WinnerSelection = {
  [roundId: string]: string;
};
