import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import SysService from 'services/SysService'

const Status = () => {
  const [status, setStatus] = useState()

  useEffect(() => {
    SysService.getAppStatus().then((response) => {
      console.log(response.data)
      setStatus(response.data)
    })
  }, [])

  return (
    <div>
      <FormattedMessage id="topBar.status" />
      {status && (
        <span className="ml-2 p-1 badge bg-danger text-white font-size-12 text-uppercase">
          {status}
        </span>
      )}
    </div>
  )
}

export default Status
