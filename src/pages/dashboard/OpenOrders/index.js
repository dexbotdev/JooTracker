import React, { useState,useEffect } from 'react'
import { Alert, Table, Spin } from 'antd'
import  getScanLink  from 'utils/getScanLink'

const myOrdersColumns = [
  {
    title: 'Order Date',
    dataIndex: 'orderCreated',
    key: 'orderCreated',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status', 
    sorter: (a, b) => a.status.length - b.status.length,
    sortDirections: ['descend'],
  },
  {
    title: 'Trade Time',
    dataIndex: 'orderExecuted',
    key: 'orderExecuted',
  },

  {
    title: 'Trade Hash',
    dataIndex: 'tnxHash',
    key: 'tnxHash',
    render: (text,record) => (
      <a href={getScanLink(record.network,record.tnxHash)}>{text.substring(0,5)}</a>
    ),
  },
  {
    title: 'Type',
    dataIndex: 'direction',
    key: 'direction',
    render: (value) => (
      <span style={{ color: value === 'SELL' ? '#f75535' : '#00a45b' , fontWeight:'bolder' }}>{value}</span>
    ),
  },
  {
    title: 'Bid/Ask',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Units Total',
    dataIndex: 'size',
    key: 'size',
  }
]



const OpenOrdersTable = ({ordersList}) => {

  const [orders,setOrders] = useState(ordersList);


  useEffect(() => {
    setOrders(ordersList);
  }, [ordersList ]);


  return (
    <div>

      {orders && (
        <div className="table-responsive text-nowrap">
          <Table
            columns={myOrdersColumns}
            dataSource={orders}
            pagination={{ position: 'bottom' }}
            size="small"
          />
        </div>
      )}
    </div>
  )
}

export default OpenOrdersTable
