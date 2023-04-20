/* eslint-disable*/

import React, { useEffect, useState, useCallback } from 'react'
import { Form, Select, Tooltip, Button } from 'antd'
import HeadersCardHeader from '@vb/widgets/Headers/CardHeader'
import CryptoCryptoLoadTable from '@vb/widgets/Crypto/CryptoLoadTable'
import { Link, withRouter } from 'react-router-dom'
import { useImmer } from 'use-immer'
import { TVChartContainer } from 'components/components'
import TotalEquityWidget from './EquityWidget'
import OpenOrdersTable from './OpenOrders'
import GridService from 'services/GridService'
import UnrealizedPL from './UnrealizedPL'
import Slippage from './Slippage'
import RealizedProfits from './RealizedProfits'
import AppPartialsDoHead from '@vb/widgets/AppPartials/DoHead'
import General22 from '@vb/widgets/WidgetsGeneral/22'
import styles from '../dashboard/Breadcrumbs2/style.module.scss'

function roundTime(ts) {
  const time = new Date(ts * 1000)
  time.setMinutes(0)
  time.setSeconds(0)
  time.setMilliseconds(0)
  const roundFloor = time.getTime() / 1000
  return roundFloor
}

const Dashboard = () => {
  const [network, setNetwork] = useState('bsc')
  const [grids, setGrids] = useState()
  const [openOrders, setOpenOrders] = useState()
  const [form] = Form.useForm()
  const [testTimeMarks, setTestTimeMarks] = useState([])
  const [activeTab, setActiveTab] = useState(1)

  const [formData, setformData] = useState({
    network: '',
    pairSymbol: '',
    token0: '',
    token1: '',
  })
  const [currentPrice, setCurrentPrice] = useState(0)
  const [pairSymbol, setPairSymbol] = useState('DOGEUSDT')
  const [orderLines, setOrderLines] = useImmer([])
  const [symbolState, setSymbolState] = useState() // 'bsc-DOGEUSDT-0xbA2aE424d960c26247Dd6c32edC70B295c744C43-0x55d398326f99059fF775485246999027B3197955')
  const [valChanged, setValChanged] = useState(false)
  const [chartVisible, setChartVisible] = useState(true)

  const [totalEquity, setTotalEquity] = useState()

  const [unrealizedPL, setUnrealizedPL] = useState()

  const [feesPaid, setFeesPaid] = useState()

  const [bookedProfits, setBookedProfits] = useState()
  const [changed, setChanged] = useState(false)

  const toggleChart = () => {
    setChartVisible(!chartVisible)
  }

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }
  useEffect(() => {
    if (valChanged) handlePairChange(symbolState, network)
  }, [valChanged, symbolState, network])

  const handleChange = (value) => {
    const pairSymbolNew = value.split('-')[1]
    const net = value.split('-')[0]
    const token0 = value.split('-')[2]
    const token1 = value.split('-')[3]
    setSymbolState(`${net}-${pairSymbolNew}-${token0}-${token1}`)
    setPairSymbol(pairSymbolNew)
    setOrderLines([])
    setNetwork(net)
    setValChanged(true)
  }

  const handlePairChange = (value, net) => {
    if (symbolState === null) return

    const pairSymbolNew = value.split('-')[1]
    console.log(net)
   
    GridService.loadOpenOrders(pairSymbolNew, net).then((response) => {
      console.log(response.data)
      if (response.data) {
        const ordersList = response.data
        setOpenOrders(ordersList)
        ordersList.forEach((order) => {
          setOrderLines((draft) => {
            if (order.direction === 'BUY' && order.status === 'NEWORDER')
              draft.push({
                id: order.id,
                text: order.direction,
                tooltip: ['Active'],
                quantity: order.size,
                price: order.price,
                color: 'green',
              })
            else if (order.direction === 'BUY' && order.status === 'ORDEREXECUTED')
              draft.push({
                id: order.id,
                text: order.direction,
                tooltip: ['Active'],
                quantity: order.size,
                price: order.price,
                color: 'blue',
              })

            else if (order.direction === 'SELL' && order.status === 'NEWORDER')
              draft.push({
                id: order.id,
                text: order.direction,
                tooltip: ['Active'],
                quantity: order.size,
                price: order.price,
                color: 'red',
              })
            else if (order.direction === 'SELL' && order.status === 'ORDEREXECUTED')
              draft.push({
                id: order.id,
                text: order.direction,
                tooltip: ['Active'],
                quantity: order.size,
                price: order.price,
                color: 'orange',
              })
            return draft
          })
        })
      }
    })
  }

  const loadpL = () => { }

  const handleTick = (ohlc) => {
    setCurrentPrice(ohlc.close)
  }
  const getLatestBar = (bar) => {
    setCurrentPrice(bar[3])
    setTestTimeMarks([
      {
        id: 'tsm4',
        time: roundTime(1662301800),
        color: 'blue',
        label: 'B',
        tooltip: ['Safety Order 4'],
      },
    ])
  }

  useEffect(() => {
    /*GridService.getProfitLoss().then((response) => {
      setTotalEquity(String(response.data.data.totalEquity))
      setUnrealizedPL(response.data.data.unrealizedPL)
      setFeesPaid(response.data.data.feesPaid)
      setBookedProfits(response.data.data.bookedProfits)
    }) */
    GridService.getAllActiveGrids().then((response) => {
      setGrids(response.data)
    })
  }, [])

  // subscribe to websocket for the future price update

  return (
    <div>
      {/* <div className="row">
        <div className="col-lg-3 col-md-12">
          <div className="card">
            <div className="card-body">
              <TotalEquityWidget totalEquity={totalEquity} />
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-12">
          <div className="card">
            <div className="card-body">
              <UnrealizedPL unrealizedPL={unrealizedPL} />
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-12">
          <div className="card">
            <div className="card-body">
              <Slippage feesPaid={feesPaid} />
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-12">
          <div className="card">
            <div className="card-body">
              <RealizedProfits bookedProfits={bookedProfits} />
            </div>
          </div>
        </div>
  </div> */}
      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="card  card-top card-top-info">
            <div className="card-header py-0">
              <div className="card-header-flex">
                <div className="d-flex flex-column justify-content-center mr-auto">
                  <h5 className="mb-0 mt-3">
                    <Form name="pairForm" form={form}>
                      <Form.Item name="network" label="Select Grid Pair">
                        <Select
                          size="small"
                          placeholder="Select Grid Pair"
                          name="symbol"
                          onChange={handleChange}
                          style={{ width: '150px', fontWeight: 'bolder' }}
                        >
                          {grids &&
                            grids.map((option, i) => (
                              <Select.Option
                                key={i}
                                value={`${option.network}-${option.pairSymbol}-${option.token0}-${option.token1}`}
                                style={{ width: '150px', fontWeight: 'bolder' }}
                              >
                                {`${option.pairSymbol}`}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Form>
                  </h5>
                </div>
                <div className={styles.subbar}>
                  <Link
                    type="button"
                    className="btn btn-info  btn-sm btn-with-addon  mr-3 ml-auto d-none d-sm-flex"
                    to="/addgrid"
                  >
                    <span className="btn-addon">
                      <i className="btn-addon-icon fe fe-plus-square" />
                    </span>
                    New GRID
                  </Link>

                  <a
                    className="btn btn-sm btn-light mr-2"
                    onClick={() => toggleChart()}
                    aria-hidden="true"
                  >
                    <i className="fe fe-sun" />
                  </a>
                </div>
              </div>
            </div>
            <div className="card-body" hidden={!chartVisible}>
              {symbolState && (
                <TVChartContainer
                  symbol={symbolState}
                  interval="1h"
                  timescaleMarks={testTimeMarks}
                  orderLines={orderLines}
                  changed={valChanged}
                  onTick={handleTick}
                  getLatestBar={getLatestBar}
                />
              )}
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="col-lg-12">
                <HeadersCardHeader data={{ title: 'OrderBook' }} />
                {/* * <div className="mb-5">
                  <Nav pills justified>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '1' })}
                        onClick={() => {
                          toggle('1')
                        }}
                      >
                        Open Orders
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '2' })}
                        onClick={() => {
                          toggle('2')
                        }}
                      >
                        Filled Orders
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '3' })}
                        onClick={() => {
                          toggle('3')
                        }}
                      >
                        Failed Orders
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <div className="card-body">
                        <CryptoCryptoLoadTable />
                      </div>
                    </TabPane>
                    <TabPane tabId="2">
                      <div className="card-body">
                        <CryptoCryptoLoadTable />
                      </div>
                    </TabPane>
                    <TabPane tabId="3">
                      <div className="card-body">
                        <CryptoCryptoLoadTable />
                      </div>
                    </TabPane>
                  </TabContent>
                      </div> * */}
              </div>
            </div>
            <div className="card-body">
              {openOrders && <OpenOrdersTable ordersList={openOrders} />}
            </div>
          </div>
        </div>
      </div>
      <div />
    </div>
  )
}

export default Dashboard
