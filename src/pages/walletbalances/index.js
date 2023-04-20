import React, { useState, useEffect } from 'react'
import { Input, Slider, Form, Table, Select, Tag, Switch, notification } from 'antd'
import { Helmet } from 'react-helmet'
import { Button, Modal, ModalHeader, ModalBody, Badge } from 'reactstrap'
import WalletService from 'services/WalletService'
import Breadcrumbs2 from './Breadcrumbs2'
import HeadersHeading2 from '@vb/widgets/Headers/Heading2'

const WalletBalances = () => {
  const [wallets, setWallets] = useState([])
  const [usdTotals, setUsdTotals] = useState()

  const colorbadge = (record) => {
    if (record.networkName === 'Ethereum') return 'info'

    if (record.networkName === 'Binance') return 'warning'

    if (record.networkName === 'Polygon') return 'primary'

    if (record.networkName === 'Avalanche') return 'danger'

    return 'success'
  }

  const columns = [
    {
      title: 'Network',
      dataIndex: 'networkName',
      key: 'networkName',
      render: (text, record) => (
        <span>
          <Badge color={colorbadge(record)} size="lg" style={{ fontWeight: 'bolder' }}>
            {text}
          </Badge>
        </span>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'walletAddress',
      key: 'walletAddress',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Currency',
      dataIndex: 'symbol',
      key: 'symbol',
      maxLength: 15,
      render: (text, record) => (
        <span>
          <Badge color={colorbadge(record)} size="lg" style={{ fontWeight: 'bolder' }}>
            {text}
          </Badge>
        </span>
      ),
    },

    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      maxLength: 18,
      sortDirections: ['descend'],
      render: (text, record) => <span>{text}</span>,
    },

    {
      title: 'USDT Equivalent',
      dataIndex: 'usdEq',
      key: 'usdEq',
      maxLength: 18,

      sortDirections: ['descend'],
      render: (text, record) => <span>{text}</span>,
    },
  ]
  const WalletsData = () => {
    WalletService.getWalletBalanceByNetwork('Binance').then((response) => {
      setWallets(response.data)

      let total = 0
      for (let i = 0; i < response.data.length; i += 1) {
        total += Number(response.data[i].usdEq)
      }
      setUsdTotals(total)
    })
  }

  useEffect(() => {
    WalletsData()
  }, [setUsdTotals])

  return (
    <div>
      <Helmet title="My Portfolio" />
      <div className="row">
        <div className="col-lg-12">
          <div className="card card-top card-top-info">
            <Breadcrumbs2 usdTotals={usdTotals} />
            <div className="responsive-table">
              <Table columns={columns} dataSource={wallets} bordered size="small" ellipsis />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletBalances
