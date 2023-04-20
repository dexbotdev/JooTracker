import React, { useState, useEffect } from 'react'
import { Table, Tag, notification, Tooltip, Divider } from 'antd'
import { Helmet } from 'react-helmet'
import GridService from 'services/GridService'
import { Link, withRouter } from 'react-router-dom'
import { Button, Badge } from 'reactstrap'
import styles from '../dashboard/Breadcrumbs2/style.module.scss'
import Status from 'layouts/Main/MenuSimply/Status'
import BigNumber from 'bignumber.js'

BigNumber.config({ DECIMAL_PLACES: 6 })

const RunGrids = () => {
  const [grids, setGrids] = useState([])
  const [activeExpRow, setActiveExpRow] = React.useState()

  const nettag = (record) => {
    if (record.network === 'Ethereum') return 'ethereum'

    if (record.network === 'Binance') return 'bsc'

    if (record.network === 'Polygon') return 'polygon'

    if (record.network === 'Avalanche') return 'avalanche'
    if (record.network === 'Fantom') return 'fantom'
    
    
    return 'bsc';

     
  }

  const colorbadge = (record) => {
    if (record.network === 'Ethereum') return 'info'

    if (record.network === 'Binance') return 'warning'

    if (record.network === 'Polygon') return 'primary'

    if (record.network === 'Avalanche') return 'danger'

    return 'info'
  }

  const errorDisplay = (text) => {
    try {
      return JSON.parse(text)?.code
    } catch (error) {
      return text
    }
  }

  const profitamnt = (record) => {
    const profit =
      Number(record.token0Price) * Number(record.token0Balance) +
      Number(record.token1Price) * Number(record.token1Balance)

    const loss = Number(record.gasUsedInNetworkCurrency) * Number(record.gasPriceInUSD)

    const result = profit - loss

    const shek = Number(result) - Number(record.token1Price) * Number(record.useWalletMargin)
    return shek
  }

  const profitpctg = (record) => {
    const profit =
      Number(record.token0Price) * Number(record.token0Balance) +
      Number(record.token1Price) * Number(record.token1Balance)

    const loss = Number(record.gasUsedInNetworkCurrency) * Number(record.gasPriceInUSD)

    const result = profit - loss

    const shek =
      (Number(result) - Number(record.token1Price) * Number(record.useWalletMargin)) /
      (Number(record.token1Price) * Number(record.useWalletMargin))
    return shek * 100
  }

  const actualprofit = (record) => {
    const profit =
      Number(record.token0Price) * Number(record.token0Balance) +
      Number(record.token1Price) * Number(record.token1Balance)

    const loss = Number(record.gasUsedInNetworkCurrency) * Number(record.gasPriceInUSD)

    const result = profit - loss

    return result
  }

  const getLink = (record) => {

    return `https://dexscreener.com/${nettag(record)}/${record.token0}`;
  }

  const profitColor = (record) => {
    const profit = actualprofit(record)
    const usedUSD = Number(record.token1Price) * Number(record.useWalletMargin)
    if (usedUSD > profit) return 'red'

    return 'green'
  }
  const columns = [
    {
      title: 'Pair',
      dataIndex: 'pairSymbol',
      key: 'pairSymbol',
      render: (text, record) => (
        <span>
          <Badge color="white" style={{ fontWeight: 'bolder', fontSize: '11px', color: 'black' }}>
            {record.pairSymbol}
          </Badge>
          <br />
          <Badge
            color={colorbadge(record)}
            style={{ fontWeight: 'bolder', fontSize: '6px', color: 'black' }}
          >
            {record.network}
          </Badge>
        </span>
      ),
    },

    {
      title: 'Value (USD)',
      dataIndex: 'val',
      key: 'val',
      render: (text, record) => (
        <div className="col-auto">
          <div>
            <Badge color="light">
              <span style={{ fontWeight: 'bolder', fontSize: '14px', color: profitColor(record) }}>
                {isNaN(actualprofit(record).toFixed(5)) ? '...' : actualprofit(record).toFixed(5)}
              </span>
            </Badge>
          </div>
        </div>
      ),
    },

    {
      title: 'Change %ge',
      dataIndex: 'profit',
      key: 'profit',
      render: (text, record) => (
        <div className="col-auto">
          <div>
            <Badge color="light">
              <span style={{ fontWeight: 'bolder', fontSize: '14px', color: profitColor(record) }}>
                {isNaN(profitpctg(record).toFixed(5)) ? '...' : profitpctg(record).toFixed(5)} {'%'}
              </span>
              <br />
              <br />
              <span style={{ fontWeight: 'bolder', fontSize: '14px', color: profitColor(record) }}>
                {'($'}
                {isNaN(profitamnt(record).toFixed(5)) ? '...' : profitamnt(record).toFixed(5)} {')'}
              </span>
            </Badge>
          </div>
        </div>
      ),
    },

    {
      title: 'Status',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text, record) => (
        <div className="col-auto" style={{ fontWeight: 'bolder', fontSize: '11px' }}>
          <div>{record.status}</div>
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <div className="mb-2">
          <Tooltip placement="top" title="Restart Grid">
            <Button className="btn btn-sm btn-info mr-2" onClick={() => restartGrid(record)}>
              <i className="fe fe-disc" />
            </Button>
          </Tooltip>
          <Tooltip placement="top" title="Terminate Grid">
            <Button className="btn btn-sm btn-danger mr-2" onClick={() => terminateGrid(record)}>
              <i className="fe fe-trash" />
            </Button>
          </Tooltip>
          <Tooltip placement="top" title="Chart">
            <a className="btn btn-sm btn-green mr-2" href={getLink(record)} target="_blank" rel="noreferrer">
              <i className="fa fa-line-chart" />
            </a>
          </Tooltip>
        </div>
      ),
    },
  ]

  const getAllGrids = () => {
    GridService.getAllActiveGrids().then((response) => {
      const modifiedData = response.data.map((item) => ({
        ...item,
        key: item.id,
      }))
      setGrids(modifiedData)
    })
  }
  const restartGrid = (record) => {
    GridService.restartGrid(record)
      .then((response) => {
        getAllGrids()
      })
      .catch((error) => {
        notification.error({
          message: 'Error',
          description: `Error Retstarting Grid ${error}`,
        })
      })
    getAllGrids()
  }

  const terminateGrid = (record) => {
    GridService.terminateGrid(record)
      .then((response) => {
        getAllGrids()
      })
      .catch((error) => {
        notification.error({
          message: 'Error',
          description: `Error Terminating Grid ${error}`,
        })
      })
    getAllGrids()
  }

  useEffect(() => {
    getAllGrids()
  }, [])

  return (
    <div>
      <Helmet title="Grids" />

      <div className="row">
        <div className="col-lg-12">
          <div className="card card-top card-top-info">
            <div className={styles.subbar}>
              <div className={`${styles.amount} mr-auto text-nowrap d-none d-md-block`}>
                <Status />
              </div>
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
                onClick={() => getAllGrids()}
                aria-hidden="true"
              >
                <i className="fe fe-refresh-cw" />
              </a>
            </div>
            <div className="responsive-table">
              <Table
                rowkey="id"
                columns={columns}
                dataSource={grids}
                bordered
                size="small"
                ellipsis
                pagination={{
                  position: ['bottomCenter'],
                }}
                expandable={{
                  expandedRowRender: (record) => (
                    <div className="row">
                      <div className="col-lg-1">
                        <div className="mb-5" />
                      </div>
                      <div className="col-lg-5">
                        <div className="mb-5">
                          <dl className="row">
                            <dt className="col-sm-6">Upper Range</dt>
                            <dd className="col-sm-6">{record.priceUpperCap}</dd>

                            <dt className="col-sm-6">Lower Range</dt>
                            <dd className="col-sm-6">{record.priceLowerCap}</dd>
                            <dt className="col-sm-6">Grid Count</dt>
                            <dd className="col-sm-6">{record.gridCount}</dd>
                            <dt className="col-sm-6">Used Wallet Margin</dt>
                            <dd className="col-sm-6">
                              {record.useWalletMargin} {record.token1Symbol}{' '}
                            </dd>
                          </dl>
                        </div>
                      </div>
                      <div className="col-lg-5">
                        <div className="mb-9">
                          <dl className="row">
                            <dt className="col-sm-3">Started on</dt>
                            <dd className="col-sm-9">{record.createdDate}</dd>

                            <dt className="col-sm-3">Started Price</dt>
                            <dd className="col-sm-9">{record.startPrice}</dd>
                            <dt className="col-sm-3">Network</dt>
                            <dd className="col-sm-9">{record.network}</dd>
                            <dt className="col-sm-3">Slippage</dt>
                            <dd className="col-sm-9">{record.slippage} </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  ),
                  rowExpandable: (record) => true,
                  expandedRowKeys: activeExpRow,
                  onExpand: (expanded, record) => {
                    const keys = []
                    if (expanded) {
                      keys.push(record.id)
                    }
                    console.log(keys)
                    setActiveExpRow(keys)
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RunGrids
