import React, { useState, useEffect } from 'react'

const TotalEquityWidget = ({ totalEquity }) => {
  const [equity, setEquity] = useState(totalEquity)
  useEffect(() => {
    setEquity(totalEquity)
  }, [totalEquity])
  return (
    <div className="d-flex flex-wrap align-items-center">
      <div className="mr-auto">
        <p className="text-uppercase text-dark font-weight-bold mb-1">Total Equity (USDT)</p>
        <p className="text-gray-5 mb-0">Total Margin deployed</p>
      </div>
      {totalEquity && (
        <p className="text-success font-weight-bold font-size-24 mb-0">
          {parseFloat(totalEquity).toFixed(4)}
        </p>
      )}
    </div>
  )
}

export default TotalEquityWidget
