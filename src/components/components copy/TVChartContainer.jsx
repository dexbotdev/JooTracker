/* eslint-disable*/

import React, { useEffect, useRef, useState } from "react";
import { widget } from "../charting_library";
import Datafeed from "./datafeed"
import PropTypes from "prop-types";
import { useImmer } from "use-immer";


export default function TVChartContainer({
  symbol = "XRPUSDT",
  interval = "1",
  libraryPath = "../charting_library/",
  timescaleMarks = [],
  timezone = "Asia/Kolkata",
  orderLines = [],
  height = "calc(100vh - 80px)",
  onTick,
  getLatestBar,
}) {
  const containerRef = useRef(null);

  const [chartOrderLines, setChartOrderLines] = useImmer([]);
  const [widgetState, setWidgetState] = useImmer(null);
  const [symbolState] = useState(null)
  const prevTimescaleMarks = useRef(timescaleMarks);

  useEffect(() => {
    if (!widgetState) {
      initializeChart("1");
    }

    if (orderLines && orderLines.length > 0) {
      updateOrderLines(orderLines);
    }

    if (widgetState && symbol !== symbolState) {
      widgetState.setSymbol(symbol, interval);
    }

    if (widgetState && prevTimescaleMarks.current && timescaleMarks !== prevTimescaleMarks.current) {
      widgetState._options.datafeed.timescaleMarks = timescaleMarks
      prevTimescaleMarks.current = timescaleMarks
    }

  }, [orderLines, timescaleMarks]);

  const initializeChart = (interval) => {
    const widgetOptions = {
      symbol: symbol,
      datafeed:  new Datafeed(symbol,interval),
      interval: interval,
      container: containerRef.current,
      library_path: libraryPath,
      locale: "en",
      client: 'tradingview.com',
      user: 'public_user_id',
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      enabled_features: ['use_localstorage_for_settings'],
      symbol_search_request_delay: 1000,
      data_status: "streaming",
      overrides: {
        "mainSeriesProperties.showCountdown": true,
        "paneProperties.background": "#fff",
        "paneProperties.vertGridProperties.color": "#fff",
        "paneProperties.horzGridProperties.color": "#fff",
        "scalesProperties.textColor": "#000",
        "mainSeriesProperties.candleStyle.wickUpColor": "#2196f3",
        "mainSeriesProperties.candleStyle.upColor": "#2196f3",
        "mainSeriesProperties.candleStyle.borderUpColor": "#2196f3",
        "mainSeriesProperties.candleStyle.wickDownColor": "#000",
        "mainSeriesProperties.candleStyle.downColor": "#000",
        "mainSeriesProperties.candleStyle.borderDownColor": "#000",
      },
    };
    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {

      tvWidget.subscribe("onTick", (event) => onTick(event));
      setWidgetState(tvWidget);

      // get latest bar for last price
      const prices = async () => {
        const data = await tvWidget.activeChart().exportData({
          includeTime: false,
          includeSeries: true,
          includedStudies: [],
        });
        getLatestBar(data.data[data.data.length - 1]);
      };
      prices();
    });
  };

  const updateOrderLines = (orderLines) => {
    if (chartOrderLines && chartOrderLines.length > 0) {
      chartOrderLines.forEach((item) => {
        orderLines.forEach(order => {
          if (item.id == order.id) {
            item
              .setText(order.text)
              .setTooltip(order.tooltip)
              .setQuantity(order.quantity)
              .setPrice(order.price);
          }
        })

      });
    } else {
      if (widgetState && orderLines && orderLines.length > 0) {
        orderLines.forEach((order) => {
          const lineStyle = order.lineStyle || 0;
          let chartOrderLine = widgetState
            .chart()
            .createOrderLine()
            .setText(order.text)
            .setTooltip(order.tooltip)
            .setQuantity(order.quantity)
            .setQuantityFont("inherit 14px Arial")
            .setQuantityBackgroundColor(order.color)
            .setQuantityBorderColor(order.color)
            .setLineStyle(lineStyle)
            .setLineLength(25)
            .setLineColor(order.color)
            .setBodyFont("inherit 14px Arial")
            .setBodyBorderColor(order.color)
            .setBodyTextColor(order.color)
            .setPrice(order.price);

          // set custom id easier search
          chartOrderLine.id = order.id

          setChartOrderLines((draft) => {
            draft.push(chartOrderLine);
            return draft;
          });
        });
      }
    }
  };

  return <div ref={containerRef} style={{ height: height }} />
}

TVChartContainer.propTypes = {
  apiKey: PropTypes.string,
  symbol: PropTypes.string,
  interval: PropTypes.string,
  libraryPath: PropTypes.string,
  timescaleMarks: PropTypes.array,
  orderLines: PropTypes.array,
  height: PropTypes.string,
  onTick: PropTypes.func,
  getLatestBar: PropTypes.func,
};
