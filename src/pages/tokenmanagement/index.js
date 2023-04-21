// eslint-disable

import React, { useState, useEffect } from 'react'
import { Input, Slider, Form, Table, Select, Tag, notification } from 'antd'
import { Helmet } from 'react-helmet'
import HeadersHeading from '@vb/widgets/Headers/Heading'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap'
import TokenService from 'services/TokenService'
import LoadingOverlay from 'react-loading-overlay'
import Parse from 'parse/node';
import axios from 'axios'
import style from '../license/info/style.module.scss'

const Tokenmanagement = () => {
  const [modalCentered, setModalCentered] = useState(false)
  const [networks, setNetworks] = useState()
  const [tokens, setTokens] = useState()
  const PairConfig = Parse.Object.extend("PairConfig");
  const MyTrades = Parse.Object.extend("MyTrades");
  const [pairs, setPairs] = useState([])
  const [tradesData, setTradesData] = useState([])
  const [subpairs, setSubpairs] = useState([])
  const [quote, setQuote] = useState(0.000);
  const [fdv, setFdv] = useState(0.000);

  const [mytrades, setMytrades] = useState([]);

  const colorbadge = (record) => {
    if (record.networkName === 'ethereum') return 'info'

    if (record.networkName === 'bsc') return 'warning'

    if (record.networkName === 'polygon') return 'primary'

    if (record.networkName === 'avalanche') return 'danger'

    return 'success'
  }

  const categoryList = [
    {
      text: "Low Marketcap",
      value: "low"
    },
    {
      text: "Medium Marketcap",
      value: "med"
    },
    {
      text: "High Marketcap",
      value: "high"
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
      title: 'Network',
      dataIndex: 'networkName',
      key: 'networkName',

      maxLength: 15,

      filters: [
        {
          text: 'Ethereum',
          value: 'ethereum',
        },
        {
          text: 'Binance',
          value: 'bsc',
        },
        {
          text: 'Arbitrum',
          value: 'arbitrum',
        },
        {
          text: 'Polygon',
          value: 'polygon',
        },
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.chainId === value,
      sorter: (a, b) => a.chainId.length - b.chainId.length,
      sortDirections: ['descend'],
      render: (text, record) => (
        <span>
          <Badge color={colorbadge(record)} style={{ fontWeight: 'bolder' }}>
            {record.networkName}
          </Badge>
        </span>
      ),
    },
    {
      title: 'Symbol',
      dataIndex: 'tokenSymbol',
      key: 'tokenSymbol',
      render: (text, record) => (
        <span>
          <Badge color={colorbadge(record)} size="lg" style={{ fontWeight: 'bolder' }}>
            {record.tokenSymbol}
          </Badge>
        </span>
      ),
    },
    {
      title: 'Marketcap',
      dataIndex: 'fdv',
      key: 'fdv',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      maxLength: 15,

      filters: [
        {
          text: 'High',
          value: 'high',
        },
        {
          text: 'Medium',
          value: 'med',
        },
        {
          text: 'Low',
          value: 'low',
        }
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.category === value,
      sorter: (a, b) => a.category.length - b.category.length,
      sortDirections: ['descend'],
      render: (text, record) => (
        <span>
          <Badge color={colorbadge(record)} style={{ fontWeight: 'bolder' }}>
            {record.category}
          </Badge>
        </span>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Invested Amnt (in USD)',
      dataIndex: 'investedAmount',
      key: 'investedAmount',
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
              <span className={style.title}>{record.buyPrice} </span>
            </div>
          </div>
          <div className="col-lg-12">
            <div className={`${style.item}`}>
              <span className={style.title}>Sell Price (usd) : &nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className={style.title}>{record.sellPrice} </span>
            </div>
          </div>
          <div className="col-lg-12">
            <div className={`${style.item}`}>
              <span className={style.title}>Profit (usd) : &nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className={style.title}>{calcProfit(record)} </span>
            </div>
          </div>
        </span>
      ),
    },
    {
      title: 'Action',
      render: (record) => (
        <span>
          <Button type="submit" onClick={() => sellToken(record)} className="btn btn-danger btn-sm" disabled={record.sold}>
            <small>
              <i className="fe fe-trash mr-2" />
            </small>
            Sell
          </Button>
        </span>)

    },
  ]


  const calcProfit = (record) => {

    return record.sold === true ? `${Number(100 * (record.sellPrice - record.buyPrice) / record.buyPrice).toFixed(2)} %` : 'Not Sold';
  }

  const sellToken = async (record) => {
    await axios.get(`https://api.dexscreener.com/latest/dex/search?q=${record.pairAddress}`).then((response) => {

      console.log(response);
      const price = response.data.pairs[0].priceUsd;

      console.log(record.objectId)
      const query = new Parse.Query(MyTrades);

      const tradeUpdate = new MyTrades();
      tradeUpdate.set("objectId", record.objectId);

      tradeUpdate.set('sold', true);
      tradeUpdate.set('sellPrice', price);
      tradeUpdate.save();
    }).then(async (response) => {
      await getPairsF();
    })
  }
  const toggleCentered = () => {
    setModalCentered(!modalCentered)
  }

  const marks = {
    3: '3',
    6: '6',
    18: '18',
  }

  const [formData, setformData] = useState({
    networkName: '',
    tokenSymbol: '',
    marketcap: '',
    category: '',
    quantity: 0,
    tokenPrice: 0,
    pairAddress: '',
  })


  const handleChange = async (name, value) => {
    const fieldName = name
    const fieldValue = value
    setformData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }))

    if (fieldName === 'networkName') {

      const currTokenList = [];
      setSubpairs(currTokenList);

      const n = tokens;
      tokens.forEach((data) => {
        if (data.chainId === value) {
          currTokenList.push(data);
        }
      })

      console.log(value)
      console.log(currTokenList)
      console.log(pairs)
      setSubpairs(currTokenList);
    }

    if (fieldName === 'tokenSymbol') {
      await axios.get(`https://api.dexscreener.com/latest/dex/search?q=${value}`).then((response) => {

        console.log(response);
        const price = response.data.pairs[0].priceUsd;
        setQuote(price);
        setFdv(response.data.pairs[0].fdv);

        const n = tokens;
        tokens.forEach((data) => {
          if (data.pairAddress === value) {
            setformData((prevState) => ({
              ...prevState,
              'tokenSymbol': data.token0Symbol + data.token1Symbol
            }))
            setformData((prevState) => ({
              ...prevState,
              'pairAddress': value,
            }))


          }
        })

      })
    }

  }

  const getPairsF = async () => {
    const query = new Parse.Query(MyTrades);
    const results = await query.findAll();

    const tradesDat = [];
    for (let i = 0; i < results.length; i++) {
      const pairConfig = results[i];

      console.log(pairConfig.id)
      const myTrade = {
        objectId: pairConfig.id,
        networkName: pairConfig.get('networkName'),
        tokenSymbol: pairConfig.get('tokenSymbol'),
        category: pairConfig.get('category'),
        quantity: pairConfig.get('quantity'),
        quote: pairConfig.get('quote'),
        fdv: pairConfig.get('fdv'),
        investedAmount: pairConfig.get('investedAmount'),
        buyPrice: pairConfig.get('buyPrice'),
        sellPrice: pairConfig.get('sellPrice'),
        sold: pairConfig.get('sold'),
        pairAddress: pairConfig.get('pairAddress')

      }

      tradesDat.push(myTrade);

    }

    setTradesData(tradesDat);

  }

  const saveData = async () => {

    const pairConfig = new MyTrades();
    // define the attributes you want for your Object
    pairConfig.set('networkName', formData.networkName);
    pairConfig.set('tokenSymbol', formData.tokenSymbol);
    pairConfig.set('pairAddress', formData.pairAddress);
    pairConfig.set('category', formData.category);
    pairConfig.set('quantity', formData.quantity);
    pairConfig.set('buyPrice', quote);
    pairConfig.set('sellPrice', null);
    pairConfig.set('profit', 0);
    pairConfig.set('sold', false);
    pairConfig.set('fdv', fdv);
    pairConfig.set('investedAmount', parseFloat(formData.quantity * quote));
    // save it on Back4App Data Store
    await pairConfig.save().then((created) => {
      console.log(created.id);
    }, (error) => {
      console.log(error);
    });
    toggleCentered();
  }


  useEffect(() => {

    const setPrelimsdata = async () => {
      const query = new Parse.Query(PairConfig);
      const results = await query.findAll();
      const tokensDat = [];

      for (let i = 0; i < results.length; i++) {
        const pairConfig = results[i];

        const token = {
          token0Symbol: pairConfig.get('token0Symbol'),
          token0Address: pairConfig.get('token0Address'),
          token1Symbol: pairConfig.get('token1Symbol'),
          token1Address: pairConfig.get('token1Address'),
          dexId: pairConfig.get('dexId'),
          chainId: pairConfig.get('chainId'),
          liquidity: pairConfig.get('liquidity'),
          fdv: pairConfig.get('fdv'),
          pairAddress: pairConfig.get('pairAddress'),
        }

        tokensDat.push(token);

      }

      setTokens(tokensDat);

      const networksData = []
      const networksTest = []

      results.forEach((data) => {
        if (!networksTest.includes(data.get('chainId'))) {
          networksData.push({ text: data.get('chainId'), value: data.get('chainId') });
          networksTest.push(data.get('chainId'));
        }
      })
      setNetworks(networksData);
      await getPairsF();

    }


    setPrelimsdata();

  }, [])

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
                <div>
                  <Button
                    type="submit"
                    className="btn btn-sm btn-info"
                    onClick={() => toggleCentered()}
                  >
                    Add New Trade
                  </Button>
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
            <Modal isOpen={modalCentered} toggle={toggleCentered} className="card">
              <ModalHeader toggle={() => toggleCentered()}>Add new Trade</ModalHeader>
              <ModalBody>
                <div className="card-body">
                  <Form {...formItemLayout} labelAlign="right">
                    <Form.Item name="network" label="Network *">
                      <Select
                        size="default"
                        placeholder="Select Network"
                        name="networkName"
                        required
                        value={formData.networkName ? formData.networkName : ''}
                        onChange={(value) => handleChange('networkName', value)}
                        style={{ width: '100%' }}
                      >
                        {networks &&
                          networks.map((option, i) => (
                            <Select.Option key={option.text} value={option.text}>
                              {option.value}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="token" label="Symbol/Pair *">
                      <Select
                        size="default"
                        placeholder="Select Symbol"
                        name="tokenSymbol"
                        required
                        value={formData.tokenSymbol ? formData.tokenSymbol : ''}
                        onChange={(value) => handleChange('tokenSymbol', value)}
                        style={{ width: '100%' }}
                      >
                        {subpairs &&
                          subpairs.map((option, i) => (
                            <Select.Option key={option.pairAddress} value={option.pairAddress}>
                              {option.token0Symbol}{option.token1Symbol}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="category" label="Category *">
                      <Select
                        size="default"
                        placeholder="Select Category"
                        name="category"
                        required
                        value={formData.category ? formData.category : ''}
                        onChange={(value) => handleChange('category', value)}
                        style={{ width: '100%' }}
                      >
                        {categoryList &&
                          categoryList.map((option, i) => (
                            <Select.Option key={option.text} value={option.value}>
                              {option.text}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="quantity" label="Token Quantity *">
                      <Input
                        placeholder="Token Quantity"
                        name="quantity"
                        onChange={(e) => handleChange('quantity', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>

                    <div className="col-lg-12 mt-5 mb-15">
                      <div className={`${style.item} mb-xl-0 mb-15`}>
                        <span className={style.title}>Token Price (usd) : &nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span className={style.title}>{quote} </span>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="btn btn-info px-5"
                      onClick={() => saveData()}
                    >
                      Buy Token
                    </Button>
                  </Form>
                </div>
              </ModalBody>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tokenmanagement
