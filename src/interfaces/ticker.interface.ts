export type ITickers = ITicker[];

export interface ITicker {
  name: string;
  price: number;
  intervalId?: ReturnType<typeof setInterval>;
}

export type ISeletedTicker = null | ITicker;
