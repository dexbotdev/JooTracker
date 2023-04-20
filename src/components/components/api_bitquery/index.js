import axios from 'axios'
import * as Bitquery from './bitquery'

const lastBarsCache = new Map()
const supportedResolutions = ['1', '3', '5', '15', '30', '60', '120', '240', 'D']

const config = {
  supported_resolutions: supportedResolutions,
}
const getNetwork = (symbolName) => {
  const netx = symbolName.split('-')[0]
  let retnet = ''
  console.log(symbolName)
  console.log(`rrrrrrrr----${netx}`)
  retnet = 'ethereum'

  if (netx === 'Binance' || netx === 'bsc') retnet = 'bsc'
  if (netx === 'Avalanche' || netx === 'avax') retnet = 'avalanche'
  if (netx === 'Fantom' || netx === 'fantom') retnet = 'fantom'
  if (netx === 'Polygon' || netx === 'polygon') retnet = 'matic'

  return retnet
}
export default {
  onReady: (cb) => {
    setTimeout(() => cb(config), 0)
  },

  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    // console.log('====Search Symbols running')
  },
  resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
    const networkName = getNetwork(symbolName)
    const pairSymbol = symbolName.split('-')[1]
    const token0 = symbolName.split('-')[2]
    const token1 = symbolName.split('-')[3]

    console.log(`[networkName]: Method called!!  ${networkName}`)

    console.log(`[pairSymbol]: Method called!!  ${pairSymbol}`)

    console.log(`[token0]: Method called!!  ${token0}`)

    console.log(`[token1]: Method called!!  ${token1}`)

    const query = Bitquery.GET_COIN_INFO.replace('netname', networkName)
      .replace('token0', token0)
      .replace('token1', token1)
    const response = await axios.post(
      Bitquery.endpoint,
      {
        query,
        variables: {
          tokenAddress: token1,
        },
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
        minmov: 1,
        pricescale: 10000000,
        has_daily: true,
        has_empty_bars: false,
        has_intraday: true,
        has_no_volume: false,
        has_seconds: false,
        seconds_multipliers: [1],
        volume: 'hundreds',
        volume_precision: 2,
        data_status: 'streaming',
        resolution: '1',
      }
      // onSymbolResolvedCallback(symbol);
      onSymbolResolvedCallback(symbol)
    }
  },
  getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
    try {
      // periodParams.countBack = 600
      const { from, to, countBack, firstDataRequest } = periodParams

      console.log(new Date(from * 1000).toISOString())
      console.log(new Date(to * 1000).toISOString())

      console.log(`countback returned is ${countBack} ${resolution} ${symbolInfo}`)

      let repeat = true
      const { name, network, srcToken, destToken } = symbolInfo
      const networkName = network
      const pairSymbol = name
      const token0 = srcToken
      const token1 = destToken
      const query = Bitquery.GET_COIN_BARS.replace('barlimit', countBack)
        .replace('from', new Date(from * 1000).toISOString())
        .replace('to', new Date(to * 1000).toISOString())
        .replace('token0', token0)
        .replace('token1', token1) 
        .replace('netname', networkName)
      const response2 = await axios.post(
        Bitquery.endpoint,
        {
          query,
          variables: {
            from: new Date(from * 1000).toISOString(),
            to: new Date(to * 1000).toISOString(),
            interval: Number(resolution),
            tokenAddress: srcToken,
          },
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
        onHistoryCallback(bars.reverse(), { noData: false })
      }

      repeat = true
    } catch (err) {
      console.log({ err })
      //  onErrorCallback(err)
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
    return resolution < 60 ? { resolutionBack: 'D', intervalBack: '1' } : 1
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
