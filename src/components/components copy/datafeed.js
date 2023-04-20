/* eslint-disable*/
import { getHistoryData,getAllSymbols, makeApiRequest } from "./helpers.js";
import { subscribeOnStream, unsubscribeFromStream } from "./streaming.js";
import axios from 'axios';

const binanceResolutions = [
  "1s",
  "1m",
  "3m",
  "5m",
  "15m",
  "30m",
  "1h",
  "2h",
  "4h",
  "6h",
  "8h",
  "12h",
  "1d",
  "3d",
  "1w",
  "1M",
];

const getConfigurationData = async () => {
  return {
    supports_marks: true,
    supports_time: true,
    supports_timescale_marks: true,
    supports_time: true,
    supported_resolutions: [
      "1S",
      "1",
      "3",
      "5",
      "15",
      "30",
      "60",
      "120",
      "240",
      "360",
      "480",
      "720",
      "1D",
      "3D",
      "1W",
      "12M",
    ],
    exchanges: [
      {
        value: "PancakeSwap V2",
        name: "PancakeSwap V2",
        desc: "PancakeSwap V2",
      },
    ],
    symbols_types: [
      {
        name: "Dex",
        value: "Dex",
      },
    ],
  };
};

/**
 * @param timescale { Array }. timescaleMark objects
 * @param interval { string }. Klines timescale from the list of Binance Enums
 */
export default class Datafeed {
  constructor(timescaleMarks = [], interval = "1h") {
    this.streaming = null;
    this.timescaleMarks = timescaleMarks;
    this.interval = interval
  }
  onReady = async (callback) => {
    this.configurationData = await getConfigurationData();
    callback(this.configurationData);
  };

  searchSymbols = async (
    userInput,
    exchange,
    symbolType,
    onResultReadyCallback
  ) => {
    const symbols = await getAllSymbols(userInput);
    onResultReadyCallback(symbols);
  };

  resolveSymbol = async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) => {
    if (!symbolName) {
      await onResolveErrorCallback("cannot resolve symbol");
      return;
    }

    const symbolInfo = () => {
      return {
        ticker: symbolName,
        name: symbolName,
        ticker: symbolName,
        description: symbolName,
        type: "crypto",
        session: "24x7",
        timezone: "Asia/Kolkata",
        exchange: "Binance",
        minmov: 100,
        pricescale: 100000,
        has_daily: true,
        has_intraday: true,
        has_no_volume: false,
        has_seconds: true,
        seconds_multipliers: [1],
        volume: "hundreds",
        volume_precision: 9,
        data_status: "streaming",
        resolution: "1",
      };
    };
    const symbol = await symbolInfo();
    onSymbolResolvedCallback(symbol);
  };

  getBars = async (
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback
  ) => {
    const { from, to, firstDataRequest } = periodParams;
    let interval = "1m"; // 1 hour
    // Calculate interval using resolution data
    if (!/[a-zA-Z]$/.test(resolution)) {
      if (parseInt(resolution) >= 60) {
        interval = parseInt(resolution) / 60 + "h";
      } else {
        interval = resolution + "m";
      }
    } else {
      interval = resolution.toLowerCase().replace(/[a-z]\b/g, c => c.toLowerCase())
    }

    let urlParameters = {
      symbol: symbolInfo.name,
      interval: interval,
      startTime: Math.abs(from * 1000),
      endTime: Math.abs(to * 1000),
      limit: 600,
    };

    const query = Object.keys(urlParameters)
      .map((name) => `${name}=${encodeURIComponent(urlParameters[name])}`)
      .join("&");

    try {
      const data = await getHistoryData(symbolInfo.name);
      if ((data.Response && data.Response === "Error") || data.length === 0) {
        // "noData" should be set if there is no data in the requested period.
        onHistoryCallback([], {
          noData: true,
        });
        return;
      }
      let bars = [];
      console.log(data);
      data.forEach((bar) => {
        const unixTimeZero = Date.parse(bar.timeInterval.minute);

          bars = [
            ...bars,
            {
              time: unixTimeZero,
              low: bar.low,
              high: bar.high,
              open: bar.open,
              close: bar.close,
              volume: bar.volume,
            },
          ];
      });
      onHistoryCallback(bars, {
        noData: false,
      });
    } catch (error) {
      console.log("[getBars]: Get error", error);
      onErrorCallback(error);
    }
  };

  getTimescaleMarks(symbolInfo, from, to, onDataCallback, resolution) {
    if (this.timescaleMarks.length > 0) {
      let timescaleMarks = Object.assign([], this.timescaleMarks);
      onDataCallback(timescaleMarks);
    }
  }

  async getServerTime(onServertimeCallback) {
    const data = await makeApiRequest(`api/v3/time`);
    const serverTime = (data.serverTime / 1000)
    onServertimeCallback(serverTime)
  }

  subscribeBars = (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback
  ) => {
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscribeUID,
      onResetCacheNeededCallback,
      this.interval
    );
  };

  unsubscribeBars = (subscriberUID) => {
    unsubscribeFromStream(subscriberUID);
  };
}
