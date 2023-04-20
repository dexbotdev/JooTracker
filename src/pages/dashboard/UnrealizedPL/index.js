import React from 'react'

const UnrealizedPL = ({ unrealizedPL }) => {
  return (
    <div className="d-flex flex-wrap align-items-center">
      <div className="mr-auto">
        <p className="text-uppercase text-dark font-weight-bold mb-1">Unrealized P&L (USD)</p>
        <p className="text-gray-5 mb-0">All Orders</p>
      </div>
      <p className="text-primary font-weight-bold font-size-24 mb-0">
        {parseFloat(unrealizedPL).toFixed(2)}
      </p>
    </div>
  )
}

export default UnrealizedPL
