export const getCoinList = async (): Promise<string[]> => {
  const response = await fetch(`${import.meta.env.VITE_API_COINLIST}`);

  const data = await response.json();

  if (data.Data) {
    const coinList = Object.values(data.Data).map(
      (ticker: any) => ticker.Symbol
    );

    return coinList;
  }

  return [];
};
