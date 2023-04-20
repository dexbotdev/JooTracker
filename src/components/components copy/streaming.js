/* eslint-disable*/

const channelToSubscription = new Map();

function setupSockets(subRequest) {
  const socket = new WebSocket("wss://stream.bybit.com/contract/usdt/public/v3");
  window.socket = socket;
  socket.onopen = (event) => {
    console.log("[socket] Connected");
    socket.send(JSON.stringify(subRequest));
  };

  socket.onclose = (reason) => {
    console.log("[socket] Disconnected:", reason);
  };

  socket.onerror = (error) => {
    console.log("[socket] Error:", error);
  };

  socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.e == undefined) {
      // skip all non-TRADE events
      return;
    }
    const {
      s: symbol,
      t: start,
      T: end,
      i: interval,
      o: open,
      c: close,
      h: high,
      l: low,
      v: volume,
      n: trades,
      q: turnover,
    } = data.k;

    const channelString = `${symbol.toLowerCase()}@kline_${interval}`;
    const subscriptionItem = channelToSubscription.get(channelString);
    if (subscriptionItem === undefined) {
      return;
    }
    const bar = {
      time: start,
      open: open,
      high: high,
      low: low,
      close: close,
      volume: volume,
    };
    // send data to every subscriber of that symbol
    subscriptionItem.handlers.forEach((handler) => handler.callback(bar));
  };
}

export function subscribeOnStream(
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscribeUID,
  onResetCacheNeededCallback,
  interval
) {
  const channelString = `${symbolInfo.name.toUpperCase()}`;
  const handler = {
    id: subscribeUID,
    callback: onRealtimeCallback,
  };
  let subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem) {
    // already subscribed to the channel, use the existing subscription
    subscriptionItem.handlers.push(handler);
    return;
  }
  subscriptionItem = {
    subscribeUID,
    resolution,
    handlers: [handler],
  };
   const subRequest = {
    op: "subscribe",
    args: ["kline.1."+channelString]
  };
  channelToSubscription.set(channelString, subscriptionItem);
  setupSockets(subRequest);
}

export function unsubscribeFromStream(subscriberUID) {
  // find a subscription with id === subscriberUID
  // eslint-disable-next-line no-restricted-syntax
  for (const channelString of channelToSubscription.keys()) {
    const subscriptionItem = channelToSubscription.get(channelString);
    const handlerIndex = subscriptionItem.handlers.findIndex(
      (handler) => handler.id === subscriberUID
    );

    if (handlerIndex !== -1) {
      // remove from handlers
      subscriptionItem.handlers.splice(handlerIndex, 1);

      if (subscriptionItem.handlers.length === 0) {
        // unsubscribe from the channel, if it was the last handler
        console.log(
          "[unsubscribeBars]: Unsubscribe from streaming. Channel:",
          channelString
        );
        const subRequest = {
          op: "unsubscribe",
          args: ["kline.1."+channelString]
        };
        window.socket.send(JSON.stringify(subRequest));
        channelToSubscription.delete(channelString);
        window.socket = undefined;
        break;
      }
    }
  }
}
