import { ITicker, ITickers } from "interfaces";

const key = "TICKER_LIST";

export const setTickersToLocalStorage = (tickers: ITickers) => {
  if (tickers) {
    const value = JSON.stringify(tickers);

    localStorage.setItem(key, value);
  }
};

export const getTickersFromLocalStorage = (): ITickers | undefined => {
  const value = localStorage.getItem(key);

  if (value) {
    const data = JSON.parse(value);

    return data;
  }
};

export const deleteTickerFromLocalStorage = (tickerToRemove: ITicker) => {
  const tickersFromLocalStorage = getTickersFromLocalStorage();

  if (tickersFromLocalStorage) {
    const value = tickersFromLocalStorage.filter(
      (tickerItem) => tickerItem.name !== tickerToRemove.name
    );
    setTickersToLocalStorage(value);
  }
};
