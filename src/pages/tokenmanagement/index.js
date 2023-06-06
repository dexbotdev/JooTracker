// eslint-disable

import React, { useState, useEffect } from 'react'
import { Input, Slider, Form, Table, Select, Tag, notification } from 'antd'
import { Helmet } from 'react-helmet'
import HeadersHeading from '@vb/widgets/Headers/Heading'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap'
import TokenService from 'services/TokenService'
import LoadingOverlay from 'react-loading-overlay'
import axios from 'axios'
import style from '../license/info/style.module.scss'
import Parse from 'parse'
import { initializeParse, useParseQuery } from '@parse/react'

const Tokenmanagement = () => {
  const [networks, setNetworks] = useState()
  const [tokens, setTokens] = useState()
  const MyTrades = Parse.Object.extend('TokenTracker')

  const parseQuery = new Parse.Query('TokenTracker')
   const { results } = useParseQuery(parseQuery)

  const [pairs, setPairs] = useState([])
  const [tradesData, setTradesData] = useState([])
  const [subpairs, setSubpairs] = useState([])
  const [quote, setQuote] = useState(0.0)
  const [fdv, setFdv] = useState(0.0)

  const [mytrades, setMytrades] = useState([])

  const dexlink = (record) => { 
    return `https://dexscreener.com/ethereum/${record.pairAddress}`;
  }
  const colorbadge = (record) => {
    if (record.networkName === 'ethereum') return 'info'

    if (record.networkName === 'bsc') return 'warning'

    if (record.networkName === 'polygon') return 'primary'

    if (record.networkName === 'avalanche') return 'danger'

    return 'success'
  }

  const categoryList = [
    {
      text: 'Low Marketcap',
      value: 'low',
    },
    {
      text: 'Medium Marketcap',
      value: 'med',
    },
    {
      text: 'High Marketcap',
      value: 'high',
    },
  ]
  const formItemLayout = {
    labelCol: {
      xs: { span: 250 },
      sm: { span: 40 },
    },
    wrapperCol: {
      xs: { span: 250 },
      sm: { span: 120 },
    },
  }
  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'tokenSymbol',
      key: 'tokenSymbol',
      render: (text, record) => (
        <span>
        <Badge color={colorbadge(record)} size="lg" style={{ fontWeight: 'bolder' }}>
          {record.tokenSymbol}
        </Badge><br/>
          <Badge color='info' size="xs" style={{ fontWeight: 'bolder',color:"#ffffff" }}>
            <a href={dexlink(record)} style={{ fontWeight: 'bolder',color:"#ffffff" }} target='blank'>{record.tokenAddress}</a>
          </Badge>
        </span>
      ),
    },
    {
      title: 'Marketcap ( USDT)',
      dataIndex: 'currmarketcap',
      key: 'currmarketcap',
      render: (text, record) => (
        <span>
        <Badge color={colorbadge(record)} size="sm" style={{ fontWeight: 'bolder' }}>
          {record.currmarketcap}
        </Badge> 
        </span>
      ),
    },
    {
      title: 'Statistics',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => (
        <span>
          <div className="col-lg-12">
            <div className={`${style.item}`}>
              <span className={style.title}>Buy Price (usd) : &nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className={style.title}>{record.priceUsd} </span>
            </div>
          </div>
          <div className="col-lg-12">
            <div className={`${style.item}`}>
              <span className={style.title}>Sell Price (usd) : &nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className={style.title}>{record.sold ? record.sellPrice : '-'} </span>
            </div>
          </div>
          <div className="col-lg-12">
            <div className={`${style.item}`}>
              <span className={style.title}>Current Price (usd) : &nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className={style.title}>{record.currPrice} </span>
            </div>
          </div>
          <div className="col-lg-12">
            <div className={`${style.item}`}>
              <span className={style.title}>Profit (usd) : &nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className={style.title}>{calcProfit(record)} </span>
            </div>
          </div>
          <div className="col-lg-12">
            <div className={`${style.item}`}>
              <span className={style.title}>After Sale profit (usd) : &nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className={style.title}>{calcProfitX(record)} </span>
            </div>
          </div>
        </span>
      ),
    },
    {
      title: 'Action',
      render: (record) => (
        <span>
        <Button
          type="submit"
          onClick={() => sellToken(record)}
          className="btn btn-danger btn-sm"
          disabled={record.sold}
        >
          <small>
            <i className="fe fe-trash mr-2" />
          </small>
          Sell
        </Button>
        <Button
          type="submit"
          onClick={() => deleteTrade(record)}
          className="btn btn-danger btn-sm"
        >
          <small>
            <i className="fe fe-trash mr-2" />
          </small>
          Delete
        </Button>
      </span>
      ),
    },
  ]

  const deleteTrade = async (record) => {
    await axios
      .get(`https://api.dexscreener.com/latest/dex/search?q=${record.pairAddress}`)
      .then((response) => {
        const price = response.data.pairs[0].priceUsd

        const tradeUpdate = new MyTrades()
        tradeUpdate.set('objectId', record.objectId) 

        tradeUpdate.set('sold', false)
        tradeUpdate.set('track', false)
        tradeUpdate.save()
      })
      .then(async () => {
        await getPairsF()
      })
  }
  const sellToken = async (record) => {
    await axios
      .get(`https://api.dexscreener.com/latest/dex/search?q=${record.pairAddress}`)
      .then((response) => {
        const price = response.data.pairs[0].priceUsd

        const tradeUpdate = new MyTrades()
        tradeUpdate.set('objectId', record.objectId) 

        tradeUpdate.set('sold', true)
        tradeUpdate.set('sellPrice', price)
        tradeUpdate.save()
      })
      .then(async () => {
        await getPairsF()
      })
  }

  const calcProfitX = (record) => {
    return record.sold === true
      ? `${Number((100 * (record.sellPrice - record.priceUsd)) / record.priceUsd).toFixed(2)} %`
      : 'Not Sold'
  }

  const calcProfit = (record) => {
    return record.track === true
      ? `${Number(record.currPrice / record.priceUsd).toFixed(2)} X`
      : 'Not Sold'
  }

  const [formData, setformData] = useState({
    networkName: '',
    tokenSymbol: '',
    marketcap: '',
    category: '',
    quantity: 0,
    tokenPrice: 0,
    pairAddress: '',
    tokenAddress: '',
  })

  const getPairsF = async () => {
    const trades = []
    const results = await parseQuery.findAll()
    if (results)
      for (let i = 0; i < results.length; i++) {
        const pairConfig = results[i]

        console.log(pairConfig.get('track')+":"+pairConfig.get('tokenName'))

        const myTrade = results[i].toJSON()

        if (pairConfig.get('track') === true) trades.push(myTrade)
      }

    setTradesData(trades)
  }

  useEffect(() => {
    const setPrelimsdata = async () => {
      await getPairsF()
    }

    setPrelimsdata()
  }, [results])

  return (
    <div>
      <Helmet title="Token Management" />
      <div className="row">
        <div className="col-lg-12">
          <div className="card card-top card-top-info">
            <div className="card-header py-0">
              <div className="card-header-flex align-items-center">
                <div className="d-flex flex-column justify-content-center mr-auto">
                  <h5 className="mb-0">
                    <strong>My Portfolio</strong>
                  </h5>
                </div>
              </div>
            </div>
            <div className="responsive-table">
              <Table
                columns={columns}
                key="id"
                dataSource={tradesData}
                bordered
                size="small"
                pagination={{
                  position: ['bottomCenter'],
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tokenmanagement
