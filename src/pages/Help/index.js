import React from 'react'
import { Helmet } from 'react-helmet'
import HeadersCardHeader3 from '@vb/widgets/Headers/CardHeader3'
import Steps from './Steps'

const ReadMeFirst = () => {
  return (
    <div>
      <Helmet title="Basic Guidelines to Use GridMantis" />
      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="card">
            <div className="card-header py-0">
              <HeadersCardHeader3 data={{ title: '📎 Basic Guidelines to Use GridMantis 📎' }} />
            </div>
            <div className="card-body">
              <div style={{ fontSize: '18px', margin: '20px' }}>
                <p className="mb-2">
                  <span role="img" aria-label="">
                    📍 Steps to follow to trade on Gridmantis
                  </span>
                </p>
                <p>
                  As soon as you fireup Gridmantis, these are the first primary steps you have to
                  complete in order to trade on GridMantis.
                  <br />
                </p>
                <Steps />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReadMeFirst
