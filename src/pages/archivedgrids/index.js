import React, { useState, useEffect } from 'react'
import { Table, Tag, notification } from 'antd'
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

  const colorbadge = (record) => {
    if (record.network === 'Ethereum') return 'info'

    if (record.network === 'Binance') return 'warning'

    if (record.network === 'Polygon') return 'primary'

    if (record.network === 'Avalanche') return 'danger'

    return 'success'
  }

  const actualprofit = (record) => {
    const profit =
      Number(record.token0Price) * Number(record.token0Balance) +
      Number(record.token1Price) *
        Number(
          new BigNumber(record.useWalletMargin)
            .minus(new BigNumber(record.token1Balance))
            .toString(),
        )

    const loss = Number(record.gasUsedInNetworkCurrency) * Number(record.gasPriceInUSD)

    const result = profit - loss

    return result
  }

  const profitColor = (record) => {
    const profit = actualprofit(record)
    const usedUSD = Number(record.token1Price) * Number(record.useWalletMargin)
    if (usedUSD > profit) return 'red'

    return 'green'
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => (
        <span>
          <Tag color="red" style={{ fontWeight: 'bolder', fontSize: '11px' }}>
            {record.id}
          </Tag>
        </span>
      ),
    },
    {
      title: 'Symbol',
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
      title: 'Status',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text, record) => (
        <div className="col-auto">
          <div>{record.status}</div>
        </div>
      ),
    },

    {
      title: 'Reason if Failed',
      dataIndex: 'failReason',
      key: 'failReason',
      render: (text, record) => (
        <div className="col-auto">
          <div>{record.failReason}</div>
        </div>
      ),
    },

    {
      title: 'Margin',
      dataIndex: 'useWalletMargin',
      key: 'useWalletMargin',
      render: (text, record) => (
        <div className="col-auto">
          <div>
            <div>
              <Badge color="success">{record.token1Symbol}</Badge> :{' '}
              {new BigNumber(record.useWalletMargin).toFixed(6)}{' '}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Used Gas Fee (USD)',
      dataIndex: 'gasCostUSD',
      key: 'gasCostUSD',
      render: (text, record) => (
        <div className="col-auto">
          <div style={{ fontWeight: 'bolder', fontSize: '12px', color: 'red' }}>
            {(Number(record.gasUsedInNetworkCurrency) * Number(record.gasPriceInUSD)).toFixed(6)}
          </div>
        </div>
      ),
    },

    {
      title: 'Grid Balances',
      dataIndex: 'failReason',
      key: 'failReason',
      render: (text, record) => (
        <div className="col-auto">
          <div>
            <Badge color="info">{record.token0Symbol}</Badge> :{' '}
            {new BigNumber(record.token0Balance).toFixed(6)}{' '}
          </div>
          <div>
            <Badge color="success">{record.token1Symbol}</Badge> :{' '}
            {new BigNumber(record.useWalletMargin)
              .minus(new BigNumber(record.token1Balance))
              .toFixed(6)}{' '}
          </div>
        </div>
      ),
    },

    {
      title: 'Portfolio Value (USD)',
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
  ]

  const generateGridError = (error) =>
    notification.error({
      message: 'Error',
      description: `Error Creating Grid ${error}`,
    })

  const getAllGrids = () => {
    GridService.getAllGrids().then((response) => {
      setGrids(response.data)
    })
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
              <Table columns={columns} dataSource={grids} bordered size="small" ellipsis />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RunGrids
