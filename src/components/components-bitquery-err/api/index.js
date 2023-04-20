import axios from 'axios'
import * as Bitquery from './bitquery'

const lastBarsCache = new Map()
const configurationData = {
  supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
}
const getNetwork = (symbolName) => {
  const netx = symbolName.split('-')[0]
  let retnet = ''
  console.log(symbolName)
  console.log(`rrrrrrrr----${netx}`)
  retnet = 'ethereum'

  if (netx === 'Binance') retnet = 'bsc'
  if (netx === 'Avalanche') retnet = 'avalanche'
  if (netx === 'Fantom') retnet = 'fantom'
  if (netx === 'Polygon') retnet = 'matic'

  return retnet
}
export default {
  onReady: (callback) => {
    console.log('[onReady]: Method called!!')
    setTimeout(() => callback(configurationData))
  },
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    // console.log('====Search Symbols running')
  },
  resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
    console.log('[resolveSymbol]: Method called!!')
    const networkName = getNetwork(symbolName)
    const pairSymbol = symbolName.split('-')[1]
    const token0 = symbolName.split('-')[2]
    const token1 = symbolName.split('-')[3]
    const query = Bitquery.GET_COIN_INFO.replace('netname', networkName)
      .replace('token0', token0)
      .replace('token1', token1)
    const response = await axios.post(
      Bitquery.endpoint,
      {
        query,
        variables: {},
        mode: 'cors',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'BQYpjiNNVAPoPk7lNFzrp5AdlZdQlsG6',
        },
      },
    )
    // const coin = response.data.data.ethereum.dexTrades[0].baseCurrency;
    // console.log(response.data.data.ethereum.dexTrades[0].quotePrice);
    console.log(response.data.data.ethereum.dexTrades[0].baseCurrency)

    const coin = response.data.data.ethereum.dexTrades[0].baseCurrency
    if (!coin) {
      onResolveErrorCallback()
    } else {
      const symbol = {
        ticker: symbolName,
        network: networkName,
        srcToken: token0,
        destToken: token1,
        name: `${pairSymbol}`,
        type: 'crypto',
        session: '24x7',
        timezone: 'Asia/Kolkata',
        exchange: 'Dex',
        minmov: 100,
        pricescale: 100000,
        has_daily: true,
        has_intraday: true,
        has_no_volume: false,
        has_seconds: false,
        seconds_multipliers: [1],
        volume: 'hundreds',
        volume_precision: 2,
        data_status: 'streaming',
        resolution: '1m',
      }
      // onSymbolResolvedCallback(symbol);
      onSymbolResolvedCallback(symbol)
    }
  },
  getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
    try {
      if (resolution === '1D') {
        resolution = 1440
      }
      const { countBack, firstDataRequest } = periodParams
      let repeat = true
      const { name, network, srcToken, destToken } = symbolInfo
      const networkName = network
      const pairSymbol = name
      const token0 = srcToken
      const token1 = destToken
      const query = Bitquery.GET_COIN_BARS.replace('barlimit', countBack)
        .replace('netname', networkName)
        .replace('token0', token0)
        .replace('token1', token1)
      if (firstDataRequest && repeat) {
        const response2 = await axios.post(
          Bitquery.endpoint,
          {
            query,
            variables: {},
            mode: 'cors',
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': 'BQYpjiNNVAPoPk7lNFzrp5AdlZdQlsG6',
            },
          },
        )

        const bars = response2.data.data.ethereum.dexTrades.map((el) => ({
          symbol: name,
          time: new Date(el.timeInterval.minute).getTime(), // date string in api response
          low: el.low,
          high: el.high,
          open: Number(el.open),
          close: Number(el.close),
          volume: el.volume,
        }))

        if (bars) {
          onHistoryCallback(bars, { noData: false })
        }
      }
      repeat = false
    } catch (err) {
      console.log({ err })
      onErrorCallback(err)
    }
  },
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback,
  ) => {
    // console.log('=====subscribeBars runnning')
  },
  unsubscribeBars: (subscriberUID) => {
    // console.log('=====unsubscribeBars running')
  },
  calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
    // optional
    // console.log('=====calculateHistoryDepth running')
    // while optional, this makes sure we request 24 hours of minute data at a time
    // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
    return resolution < 60 ? { resolutionBack: 'D', intervalBack: '1' } : undefined
  },
  getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
    // optional
    // console.log('=====getMarks running')
  },
  getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
    // optional
    // console.log('=====getTimeScaleMarks running')
  },
  getServerTime: (cb) => {
    // console.log('=====getServerTime running')
  },
}
