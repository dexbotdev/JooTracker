import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Input, Select, Table, Form, notification } from 'antd'
import { Button } from 'reactstrap'
import LicenseInfo from './info'
import SysService from 'services/SysService'

const { Option } = Select

const License = () => {
  const [form] = Form.useForm()
  const [licenseReqs, setLicenseReqs] = useState([])

  const columns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Subscription',
      dataIndex: 'subscriptionType',
      key: 'subscriptionType',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'licenseEnabled',
      key: 'licenseEnabled',
      maxLength: 15,
      render: (text) => (
        <h6 style={{ color: text ? 'green' : 'red' }}>{text ? 'Enabled' : 'Disabled'}</h6>
      ),
    },

    {
      title: 'Requested Date',
      dataIndex: 'requestedDt',
      key: 'requestedDt',
      maxLength: 18,
      sortDirections: ['descend'],
      render: (text, record) => <span>{text}</span>,
    },
    {
      title: 'Action',
      render: (record) => (
        <span>
          <Button
            type="submit"
            onClick={() => deleteLicenseReq(record)}
            className="btn btn-sm btn-danger"
          >
            <small>
              <i className="fe fe-trash mr-2" />
            </small>
            Remove
          </Button>
        </span>
      ),
    },
  ]

  const deleteLicenseReq = (record) => {
    SysService.deleteLicRequest(record).then((response) => {
      console.log(response.data.code)
      if (response.data.error) {
        notification.error({
          message: 'Error',
          description: `Error :${response.data.error}`,
        })
      } else LicenseReq()
    })
  }

  const LicenseReq = () => {
    SysService.getAllRequests().then((response) => {
      setLicenseReqs(response.data)
    })
  }

  const [formData, setFormData] = useState({
    id: 0,
    discordId: '',
    product: 'GRIDMANTIS_BASIC',
    subscriptionType: '',
    tnxHashPayment: '',
  })
  const requestLicense = () => {
    if (licenseReqs.length > 0) {
      notification.error({
        message: 'Error',
        description: 'Delete Existing request to raise a new one.',
      })
      return
    }
    SysService.requestLicense(formData)
      .then((response) => {
        if (response.data.productName === undefined) {
          notification.error({
            message: 'Error',
            description: response.data.error,
          })
        } else LicenseReq()
      })
      .catch((error) => {
        notification.error({
          message: 'Error',
          description: error,
        })
      })
    LicenseReq()
  }
  const handleChange = (name, value) => {
    const fieldName = name
    const fieldValue = value
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }))
  }

  useEffect(() => {
    LicenseReq()
  }, [setLicenseReqs])

  return (
    <div>
      <Helmet title="My Subscriptions" />
      <div className="row">
        <div className="col-lg-12">
          <div className="card card-top card-top-info">
            <div className="card-body">
              <Form ref={form} name="customForm" layout="vertical">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <Form.Item name="discordId" label="">
                          <Input
                            placeholder="Discord ID"
                            name="discordId"
                            value={formData.discordId}
                            onChange={(e) => handleChange('discordId', e.target.value)}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <Form.Item name="subscriptionType" label="">
                          <Select
                            size="default"
                            placeholder="Select SubsciptionType"
                            style={{ width: '100%' }}
                            name="subscriptionType"
                            value={formData.subscriptionType}
                            onSelect={(value) => handleChange('subscriptionType', value)}
                          >
                            <Option key="TRIAL">TRIAL</Option>
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <Form.Item name="tnxHashPayment" label="">
                          <Input
                            placeholder="Tnx Hash"
                            name="tnxHashPayment"
                            value={formData.tnxHashPayment}
                            onChange={(e) => handleChange('tnxHashPayment', e.target.value)}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <Button
                          type="submit"
                          className="btn btn-info btn-sm"
                          onClick={() => requestLicense()}
                        >
                          Send License Request
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
            <div className="card-body">
              <LicenseInfo />
            </div>

            <div className="card card-top card-top-info">
              <div className="responsive-table">
                <Table
                  columns={columns}
                  dataSource={licenseReqs}
                  bordered
                  size="small"
                  ellipsis
                  pagination={{
                    position: 'bottomRight',
                    current: 1,
                    pageSize: 5,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default License
