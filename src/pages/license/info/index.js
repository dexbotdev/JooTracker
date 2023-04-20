import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import SysService from 'services/SysService'
import Status from 'layouts/Main/MenuSimply/Status'

const LicenseInfo = () => {
  const [license, setLicense] = useState()

  const LicenseReq = () => {
    SysService.getCurrentLicense().then((response) => {
      setLicense(response.data)
    })
  }

  useEffect(() => {
    LicenseReq()
  }, [setLicense])

  return (
    <div className="row">
      <div className="col-lg-3">
        <div className={`${style.item} mb-xl-0 mb-3`}>
          <span className={style.icon}>
            <i className="fe fe-home" />
          </span>
          <div className={style.desc}>
            <span className={style.title}>Subscription</span>
            <p>
              {license && license.product ? license.product : ''}{' '}
              {license && license.subscriptionType ? license.subscriptionType : <Status />}
            </p>
          </div>
          <div className={`${style.line} bg-primary`} />
        </div>
      </div>
      <div className="col-lg-3">
        <div className={`${style.item} mb-xl-0 mb-3`}>
          <span className={style.icon}>
            <i className="fe fe-command" />
          </span>
          <div className={style.desc}>
            <span className={style.title}>Discord ID</span>
            <p>{license && license.discordId ? license.discordId : 'Not Configured'}</p>
          </div>
          <div className={`${style.line} bg-primary`} />
        </div>
      </div>
      <div className="col-lg-3">
        <div className={`${style.item} mb-xl-0 mb-3`}>
          <span className={style.icon}>
            <i className="fe fe-star" />
          </span>
          <div className={style.desc}>
            <span className={style.title}>Issue Date</span>
            <p>{license && license.licAwarded ? license.licAwarded : 'Under Review'}</p>
          </div>
          <div className={`${style.line} bg-primary`} />
        </div>
      </div>
      <div className="col-lg-3">
        <div className={`${style.item} mb-xl-0 mb-3`}>
          <span className={style.icon}>
            <i className="fe fe-database" />
          </span>
          <div className={style.desc}>
            <span className={style.title}>Expiry Date</span>
            <p>{license && license.expiryDate ? license.expiryDate : 'Under Review'}</p>
          </div>
          <div className={`${style.line} bg-primary`} />
        </div>
      </div>
    </div>
  )
}

export default LicenseInfo
