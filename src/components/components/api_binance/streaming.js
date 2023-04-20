/* eslint-disable*/

const channelToSubscription = new Map()

function setupSockets(subRequest) {
  const socket = new WebSocket('wss://stream.bybit.com/contract/usdt/public/v3')
  window.socket = socket
  socket.onopen = (event) => {
    socket.send(JSON.stringify(subRequest))
  }

  socket.onclose = (reason) => {
    console.log('[socket] Disconnected:', reason)
  }

  socket.onerror = (error) => {
    console.log('[socket] Error:', error)
  }

  socket.onmessage = (e) => {
    const data = JSON.parse(e.data)

    const topic = data.topic
    const r = data.data
    if (r == undefined) {
      // skip all non-TRADE events
      return
    }

    const channelString = topic.split('.')[2]
    const subscriptionItem = channelToSubscription.get(channelString)
    if (subscriptionItem === undefined) {
      return
    }
    const bar = {
      time: r[0].start,
      open: r[0].open,
      high: r[0].high,
      low: r[0].low,
      close: r[0].close,
      volume: r[0].volume,
    }

    // send data to every subscriber of that symbol
    subscriptionItem.handlers.forEach((handler) => handler.callback(bar))
  }
}

export function subscribeOnStream(
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscribeUID,
  onResetCacheNeededCallback,
  interval,
) {
  const channelString = `${symbolInfo.name.toUpperCase()}`
  const handler = {
    id: subscribeUID,
    callback: onRealtimeCallback,
  }

  console.log(channelString)

  let subscriptionItem = channelToSubscription.get(channelString)
  if (subscriptionItem) {
    // already subscribed to the channel, use the existing subscription
    subscriptionItem.handlers.push(handler)
    return
  }
  subscriptionItem = {
    subscribeUID,
    resolution,
    handlers: [handler],
  }
  const subRequest = {
    op: 'subscribe',
    args: ['kline.1.' + channelString],
  }
  channelToSubscription.set(channelString, subscriptionItem)
  setupSockets(subRequest)
}

export function unsubscribeFromStream(subscriberUID) {
  // find a subscription with id === subscriberUID
  // eslint-disable-next-line no-restricted-syntax
  for (const channelString of channelToSubscription.keys()) {
    const subscriptionItem = channelToSubscription.get(channelString)
    const handlerIndex = subscriptionItem.handlers.findIndex(
      (handler) => handler.id === subscriberUID,
    )

    if (handlerIndex !== -1) {
      // remove from handlers
      subscriptionItem.handlers.splice(handlerIndex, 1)

      if (subscriptionItem.handlers.length === 0) {
        // unsubscribe from the channel, if it was the last handler
        console.log('[unsubscribeBars]: Unsubscribe from streaming. Channel:', channelString)
        const subRequest = {
          op: 'unsubscribe',
          args: ['kline.1.' + channelString],
        }
        window.socket.send(JSON.stringify(subRequest))
        channelToSubscription.delete(channelString)
        window.socket = undefined
        break
      }
    }
  }
}
