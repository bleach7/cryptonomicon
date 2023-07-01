export const getTickerPrice = async (
  tickerName: string
): Promise<number | undefined> => {
  const response = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/price?fsym=${tickerName}&tsyms=USD&api_key=${
      import.meta.env.VITE_API_KEY
    }`
  );

  const data = await response.json();

  if (data.USD) {
    return data.USD as number;
  }
};
