export const loadTickers = async (
  tickerNames: string[]
): Promise<ILoadTickerResponse> => {
  const tickers = tickerNames.join(",");

  const response = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/pricemulti?fsyms=${tickers}&tsyms=USD&api_key=${
      import.meta.env.VITE_API_KEY
    }`
  );

  const data: ILoadTickerData = await response.json();

  const formatData: ILoadTickerResponse = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value.USD])
  );

  return formatData;
};

interface ILoadTickerResponse {
  [cryptoName: string]: number;
}

interface ILoadTickerData {
  [cryptoName: string]: IPrice;
}

interface IPrice {
  USD: number;
}
