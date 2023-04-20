/* eslint-disable*/

import React, { useEffect, useRef, useState } from 'react'
import { widget } from '../charting_library'
import Datafeed from './api_bitquery'
import PropTypes from 'prop-types'
import { useImmer } from 'use-immer'

export default function TVChartContainer({
  symbol = 'BTCUSDT',
  interval = '1',
  grid = '',
  libraryPath = '/charting_library/',
  timescaleMarks,
  orderLines,
  height = 'calc(100vh - 80px)',
  onTick,
  getLatestBar,
}) {
  const containerRef = useRef(null)

  const [chartOrderLines, setChartOrderLines] = useState([])
  const [widgetState, setWidgetState] = useState(null)
  const [symbolState] = useState(null)
  const prevTimescaleMarks = useRef(timescaleMarks)

  useEffect(() => {
    if (!widgetState) {
      initializeChart('1')
    }

  
    if (orderLines && orderLines.length > 0) {
      updateOrderLines(orderLines)

      orderLines.forEach((element) => {
        if (element.startingOrder === true) {
          console.log(element)
        }
      })
    }

    if (widgetState && symbol !== symbolState) {
      widgetState.setSymbol(symbol, interval)
    }

    if (
      widgetState &&
      prevTimescaleMarks.current &&
      timescaleMarks !== prevTimescaleMarks.current
    ) {
      widgetState._options.datafeed.timescaleMarks = timescaleMarks
      prevTimescaleMarks.current = timescaleMarks
    }
  }, [orderLines, timescaleMarks])

  const initializeChart = (interval) => {
    const widgetOptions = {
      symbol: symbol,
      datafeed: Datafeed,
      grid: grid,
      interval: interval,
      container: containerRef.current,
      library_path: libraryPath,
      timezone: 'Asia/Kolkata',
      locale: 'en',
      theme: 'dark',
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      enabled_features: [
        'show_logo_on_all_charts',
        'use_localstorage_for_settings',
        'header_resolutions',
        'timeframes_toolbar',
        'header_chart_type',
      ],
      disabled_features: [
        'header_settings',
        'header_compare',
        'left_toolbar',
        'header_symbol_search',
      ],
      /* disabled_features: ['use_localstorage_for_settings',
      "volume_force_overlay", "left_toolbar", "show_logo_on_all_charts",
       "caption_buttons_text_if_possible",
     "header_indicators", "header_compare", "compare_symbol", "header_screenshot",
     "header_widget_dom_node", "header_saveload", "header_undo_redo",
      "header_interval_dialog_button", "show_interval_dialog_on_key_press",
       "header_symbol_search",  "header_widget"],*/
      symbol_search_request_delay: 1000,
      overrides: {
        volumePaneSize: 'small',
        'mainSeriesProperties.barStyle.dontDrawOpen': false,
      },
    }
    const tvWidget = new widget(widgetOptions)

    tvWidget.onChartReady(() => {
      tvWidget.subscribe('onTick', (event) => onTick(event))
      setWidgetState(tvWidget)

      // get latest bar for last price
      const prices = async () => {
        const data = await tvWidget.activeChart().exportData({
          includeTime: true,
          includeSeries: true,
          includedStudies: [],
        })

        console.log(data.data)
        getLatestBar(data.data[0])
      }
      prices()
    })
  }

  const updateGridStart = (gridstartTime) => {
    if (widgetState && orderLines && gridstartTime) {
      widgetState.chart().createShape({ time: gridstartTime / 1000 }, { shape: 'arrow_up' })
    }
  }

  const updateOrderLines = (orderLines) => {
    if (chartOrderLines && chartOrderLines.length > 0) {
      chartOrderLines.forEach((item) => {
        orderLines.forEach((order) => {
          if (item.id == order.id) {
            item
              .setText(order.text)
              .setTooltip(order.tooltip)
              .setQuantity(order.quantity)
              .setPrice(order.price)
          }
        })
      })
    } else {
      if (widgetState && orderLines && orderLines.length > 0) {
        orderLines.forEach((order) => {
          const lineStyle = order.lineStyle || 0
          let chartOrderLine = widgetState
            .chart()
            .createOrderLine()
            .setText(order.text)
            .setTooltip(order.tooltip)
            .setQuantity(order.quantity)
            .setQuantityFont('inherit 14px Arial')
            .setQuantityBackgroundColor(order.color)
            .setQuantityBorderColor(order.color)
            .setLineStyle(lineStyle)
            .setLineLength(25)
            .setLineColor(order.color)
            .setBodyFont('inherit 14px Arial')
            .setBodyBorderColor(order.color)
            .setBodyTextColor(order.color)
            .setPrice(order.price)

          // set custom id easier search
          chartOrderLine.id = order.id

          setChartOrderLines((draft) => {
            draft.push(chartOrderLine)
            return draft
          })
        })
      }
    }
  }

  return <div ref={containerRef} style={{ height: height }} />
}

TVChartContainer.propTypes = {
  apiKey: PropTypes.string,
  symbol: PropTypes.string,
  grid: PropTypes.string,
  interval: PropTypes.string,
  libraryPath: PropTypes.string,
  timescaleMarks: PropTypes.array,
  orderLines: PropTypes.array,
  height: PropTypes.string,
  onTick: PropTypes.func,
  getLatestBar: PropTypes.func,
}
