import React from 'react'

const RealizedProfits = ({ bookedProfits }) => {
  return (
    <div className="d-flex flex-wrap align-items-center">
      <div className="mr-auto">
        <p className="text-uppercase text-dark font-weight-bold mb-1">Profits (in USDT)</p>
        <p className="text-gray-5 mb-0">Booked in last 1 Month</p>
      </div>
      <p className="text-info font-weight-bold font-size-24 mb-0">
        {parseFloat(bookedProfits).toFixed(4)}
      </p>
    </div>
  )
}

export default RealizedProfits
