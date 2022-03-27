export enum Ratings {
  "G" = "G",
  "PG" = "PG",
  "PG-13" = "PG-13",
  "R" = "R",
  "NC-17" = "NC-17",
}

export interface GroupData {
  name: string;
  id: string;
  warnings?: string;
  codenames?: string[];
  responses?: {
    [codename: string]: {
      rating?: Ratings;
      lines?: string[];
      veils?: string[];
    };
  };
}
