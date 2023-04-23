import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Tabs, Slider, Form, Table, Select, Input, notification } from 'antd'
import HeadersCardHeader from '@vb/widgets/Headers/CardHeader'
import LoadingOverlay from 'react-loading-overlay'
import axios from 'axios'
import TokenService from 'services/TokenService'
import PairsService from 'services/PairsService'
import { ConsoleSqlOutlined } from '@ant-design/icons'
import { Button, Modal, ModalHeader, ModalBody, Badge } from 'reactstrap'
import classnames from 'classnames'
import { Link, withRouter } from 'react-router-dom'
import style from './6/style.module.scss'
import Parse from 'parse/node';

const { Search, TextArea } = Input
const formItemLayout = {
  labelCol: {
    xs: { span: 560 },
    sm: { span: 40 },
  },
  wrapperCol: {
    xs: { span: 560 },
    sm: { span: 120 },
  },
}
const SearchAndAddPairs = () => {
  const [networks, setNetworks] = useState([])
  const [tokens, setTokens] = useState([])
  const [pairs, setPairs] = useState([])
  const [activeTab, setActiveTab] = useState('1')
  const [isActive, setIsActive] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [pairsMap, setPairsMap] = useState([])



  const PairConfig = Parse.Object.extend("PairConfig");

  const colorbadge = (record) => {
    if (record.chainId === 'ethereum') return 'dark'

    if (record.chainId === 'bsc') return 'warning'

    if (record.chainId === 'polygon') return 'primary'
    if (record.chainId === 'arbitrum') return 'danger'


    return 'info'
  }

  const colorbadgeByChainId = (record) => {
    if (record.chainId === 'ethereum') return 'dark'

    if (record.chainId === 'bsc') return 'warning'

    if (record.chainId === 'polygon') return 'primary'
    if (record.chainId === 'arbitrum') return 'danger'


    return 'info'
  }

  const columns = [
    {
      title: 'Network',
      dataIndex: 'chainId',
      key: 'chainId',
      render: (text, record) => (
        <span>
          <Badge color={colorbadge(record)} style={{ fontWeight: 'bolder' }}>
            {record.chainId}
          </Badge>
        </span>
      ),
    },
    {
      title: 'Symbol',
      dataIndex: 'pairSymbol',
      key: 'pairSymbol',
      render: (text, record) => (
        <span>
          <Badge color={colorbadge(record)} style={{ fontWeight: 'bolder', fontSize: '14px' }}>
            {record.token0Symbol}{record.token1Symbol}
          </Badge>
          <br />
          <Badge className="mb-0" style={{ fontWeight: 'bolder' }}>
            {record.dexId}
          </Badge>
        </span>
      ),
    },
    {
      title: 'Liquidity',
      dataIndex: 'liquidity',
      key: 'liquidity',
      render: (text, record) => <span>{record.liquidity}</span>,
    },
    {
      title: 'FDV',
      dataIndex: 'fdv',
      key: 'fdv',
      render: (text, record) => <span>{record.fdv}</span>,
    },
  ]

  const deletePair = (record) => {
     
  }

  const slippagesteps = {
    5: '0.05',
    10: '0.1',
    50: '0.5',
    100: '1',
  }

  const [formData, setformData] = useState({
    token0Symbol: '',
    token1Symbol: '',
    networkName: '',
    symbol: '',
    slippage: '50',
    address: '',
  })
 
  
  const getPairs = async () => {
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
        pairAddress:pairConfig.get('pairAddress')

      }

      tokensDat.push(token);

    }

    setPairs(tokensDat);

  }
  



  useEffect(() => {
    const getPairsF = async () => {
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
          pairAddress:pairConfig.get('pairAddress')

        }

        tokensDat.push(token);

      }

      setPairs(tokensDat);

    }

    getPairsF()


  }, [PairConfig])

  const addNewPair = async (record) => {
    const pairConfig1 = {
      token0Symbol: record.baseToken.symbol,
      token0Address: record.baseToken.address,
      token1Symbol: record.quoteToken.symbol,
      token1Address: record.quoteToken.address,
      dexId: record.dexId,
      chainId: record.chainId,
      liquidity: record.liquidity.quote,
      fdv: record.fdv,
      pairAddress:record.pairAddress
    }

    setIsActive(true)
    const pairConfig = new PairConfig();
    // define the attributes you want for your Object
    pairConfig.set('token0Symbol', record.baseToken.symbol);
    pairConfig.set('token0Address', record.baseToken.address);
    pairConfig.set('token1Symbol', record.quoteToken.symbol);
    pairConfig.set('token1Address', record.quoteToken.address);
    pairConfig.set('dexId', record.dexId);
    pairConfig.set('chainId', record.chainId);
    pairConfig.set('liquidity', record.liquidity.quote);
    pairConfig.set('fdv', record.fdv);
    pairConfig.set('pairAddress', record.pairAddress);
    pairConfig.set('tokenSymbol', record.baseToken.symbol+record.quoteToken.symbol);
    // save it on Back4App Data Store
    await pairConfig.save().then((created) => {
      console.log(created.id);
    }, (error) => {
      console.log(error);
    });


    setIsActive(false)
    getPairs()
  }

  const searchPairs = async (txt) => {
    setSearchValue(txt)
    if (txt.length >= 3) {
      setIsActive(true)
      await axios.get(`https://api.dexscreener.com/latest/dex/search?q=${txt}`).then((response) => {

        const pairsmap = [];

        response.data.pairs.forEach((pairItem)=>{
          if(pairItem.dexId ==='uniswap') pairsmap.push(pairItem);
        })
        setPairsMap(pairsmap)
        setIsActive(false)
      })
    } else {
      setPairsMap([])
    }
  }



  return (
    <div>
      <Helmet title="Search and Add Pairs" />
      <div className="row">
        <div className="col-lg-4 col-md-12">
          <div className="card card-top card-top-success">
            <div className="card-header py-0">
              <HeadersCardHeader data={{ title: 'Search and Add Pair' }} />
            </div>
            <div className="card-header py-0 mb-4 mt-4">
              <Form {...formItemLayout} labelAlign="right">
                <Search
                  placeholder="input symbol/pair"
                  value={searchValue}
                  onChange={(e) => searchPairs(e.target.value)}
                  enterButton
                  fullWidth
                />
              </Form>
              <div>
                <LoadingOverlay active={isActive} spinner text="Loading the Pair Details...">
                  {pairsMap &&
                    pairsMap.map((item, index) => (
                      <ul className="list-unstyled mb-0">
                        <li className={style.item}>
                          <div className="mr-2">
                            <div>
                              <Badge color={colorbadgeByChainId(item?.chainId)}>
                                {item?.chainId}
                              </Badge>
                            </div>
                            <div className="text-muted">{item?.dexId}</div>
                          </div>
                          <div className="ml-auto text-right text-nowrap">
                            <div>
                              {item?.baseToken?.symbol}/{item?.quoteToken?.symbol}
                            </div>
                            <div className="text-success">Liq:{item?.liquidity?.quote}</div>
                            <div className="text-success">Vol(24Hr): {item?.volume?.h24}</div>
                          </div>
                          <div className="ml-auto text-right text-nowrap">
                            <span>
                              <Button
                                type="submit"
                                onClick={() => addNewPair(item)}
                                className="btn btn-sm btn-danger"
                              >
                                <medium>
                                  <i className="fe fe-plus mr-2" />
                                </medium>
                              </Button>
                            </span>
                          </div>
                        </li>
                      </ul>
                    ))}
                </LoadingOverlay>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-8 col-md-12">
          <div className="card card-top card-top-success">
            <div className="card-header py-0">
              <HeadersCardHeader data={{ title: 'Added Pairs' }} />
            </div>
            <div className="card-body">
              <div className="responsive-table">
                <Table columns={columns} dataSource={pairs} bordered size="small" ellipsis />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchAndAddPairs
