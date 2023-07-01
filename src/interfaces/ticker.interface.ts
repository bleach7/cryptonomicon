export type ITickers = ITicker[];

export interface ITicker {
  name: string;
  price: number;
  intervalId?: TIntervalID;
}

export type ISeletedTicker = null | string;

export type TIntervalID = ReturnType<typeof setInterval>;
