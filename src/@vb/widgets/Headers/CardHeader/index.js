import React from 'react'

const Header = ({ data }) => {
  return (
    <div className="card-header-flex">
      <div className="d-flex flex-column justify-content-center mr-auto">
        <h5 className="mb-0">
          <strong>{data.title}</strong>
        </h5>
      </div>
      <div className="d-flex flex-column justify-content-center" /> 
    </div>
  )
}

Header.defaultProps = {
  data: {
    title: 'Basic header',
  },
}

export default Header
