/* eslint-disable*/

import { useEffect, useRef } from "react";
import axios from "axios";

export async function getHistoryData(symbol){
  const response = await axios.get(`/api/v1/history/get/${symbol}`,
  {headers: {'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials':true}});
  return response.data;
}

export async function makeApiRequest(path) {
  try {
    const response = await fetch(`https://api.bybit.com/${path}`);
     return response.json();
  } catch (error) {
    throw new Error(` request error: ${error.status}`);
  }
}

export async function getAllSymbols(symbol) {
  const newSymbols = [];
  try {
    const data = await makeApiRequest(`/spot/v3/public/symbols`);
    data.result.list.forEach(item => {
      const symbolsrched = `${item.baseCoin}${item.quoteCoin}`;
      if (symbolsrched === symbol) {
        newSymbols.push({
          symbol: item.name,
          full_name: `${item.baseCoin}/${item.quoteCoin}`,
          description: `${item.name}`,
          exchange: "Bybit",
          ticker: item.name,
          type: "Crypto",
        });
      }
    });
  } catch (e) {
    return newSymbols
  }
  return newSymbols;
}

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
