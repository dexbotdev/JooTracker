export const endpoint = 'https://graphql.bitquery.io'

export const GET_COIN_INFO = `
{
  ethereum(network: netname) {
    dexTrades(
      options: {desc: ["block.height", "transaction.index"], limit: 1}
      baseCurrency: {is: "token0"}
      quoteCurrency: {is: "token1"}
    )
    {
      block {
        height
        timestamp {
          time(format: "%Y-%m-%d %H:%M:%S")
        }
      }
      transaction {
        index
      }
      baseCurrency {
        name
        symbol
        decimals
      }
      quotePrice
    }
  }
}
`

export const GET_COIN_BARS = `
{
  ethereum(network: netname) {
    dexTrades(
      options: {desc: "timeInterval.minute", limit : barlimit}
      date: {since: "2022-12-01"}
      baseCurrency: {is: "token0"},
      quoteCurrency: {is: "token1"},
     )
    {
      timeInterval {
        minute(count: 1, format: "%Y-%m-%dT%H:%M:%SZ")
      }
      volume: quoteAmount
      high: quotePrice(calculate: maximum)
      low: quotePrice(calculate: minimum)
      open: minimum(of: block, get: quote_price)
      close: maximum(of: block, get: quote_price)
    }
  }
}
`
