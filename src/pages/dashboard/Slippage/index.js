import React from 'react'

const Slippage = ({ feesPaid }) => {
  return (
    <div className="d-flex flex-wrap align-items-center">
      <div className="mr-auto">
        <p className="text-uppercase text-dark font-weight-bold mb-1">Gas Fees Paid</p>
        <p className="text-gray-5 mb-0">Total in USDT</p>
      </div>
      <p className="text-danger font-weight-bold font-size-24 mb-0">
        -{parseFloat(feesPaid).toFixed(4)}
      </p>
    </div>
  )
}

export default Slippage
