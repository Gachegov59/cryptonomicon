const API_KEY = `2db7452caf2bef2a6e3e0a9b2561ae6122646eef7beec9b92c800beac6fa27ec`;
const tickersHandlers = new Map();

const loadTickers = () => {
  // debugger;
  if (tickersHandlers.size === 0) {
    return;
  }

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickersHandlers.keys(),
    ].join(",")}&tsyms=USD&api_key=${API_KEY}`,
  )
    .then((r) => r.json())
    .then((rawData) => {
      // {XBS: {USD: 2.804}}}
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD]), // {XBS: 2.804}
      );

      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handler = tickersHandlers.get(currency) ?? [];
        handler.forEach((fn) => fn(newPrice));
      });
    });
};

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeToTicker = (ticker) => {
  tickersHandlers.delete(ticker);
};

setInterval(loadTickers, 5000);

//подсказки
export const getCoins = fetch(
  `https://min-api.cryptocompare.com/data/all/coinlist?summary=true`,
).then((r) => r.json());

window.tickers = tickersHandlers;
