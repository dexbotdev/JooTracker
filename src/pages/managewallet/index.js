import React, { useState, useEffect } from 'react'
import { Input, Slider, Form, Table, Select, Tag, Switch, notification } from 'antd'
import { Helmet } from 'react-helmet'
import { Button, Modal, ModalHeader, ModalBody, Badge } from 'reactstrap'
import WalletService from 'services/WalletService'

const WalletManagement = () => {
  const [modalCentered, setModalCentered] = useState(false)
  const [wallets, setWallets] = useState([])
  const [simulation, setSimulation] = useState(false)

  const formItemLayout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 12 },
  }

  const columns = [
    {
      title: 'WalletName',
      dataIndex: 'walletName',
      key: 'walletName',
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      sorter: (a, b) => a.walletName.length - b.walletName.length,
      sortDirections: ['descend'],
      render: (text, record) => (
        <span>
          <Badge color="danger" size="lg" style={{ fontWeight: 'bolder' }}>
            {text}
          </Badge>
        </span>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'walletAddress',
      key: 'walletAddress',
      render: (text, record) => <span>{text}</span>,
    },
    {
      title: 'PrivateKey',
      dataIndex: 'walletPrivateKey',
      key: 'walletPrivateKey',
      maxLength: 15,
      render: (text, record) => (
        <span>
          <Badge color="success" style={{ fontWeight: 'bolder' }}>
            #$&#$*#$@#$*&@#$#*$&^@#$
          </Badge>
        </span>
      ),
    },

    {
      title: 'Wallet Type',
      dataIndex: 'simulation',
      key: 'simulation',
      maxLength: 15,

      filters: [
        {
          text: 'Live',
          value: 'false',
        },
        {
          text: 'Simulated',
          value: 'true',
        },
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.simulation === value,
      sorter: (a, b) => a.simulation.length - b.simulation.length,
      sortDirections: ['descend'],
      render: (text, record) => (
        <span>
          {record.simulation ? (
            <Badge color="info">Simulated</Badge>
          ) : (
            <Badge color="success">Live</Badge>
          )}
        </span>
      ),
    },
    {
      title: 'Action',
      render: (record) => (
        <span>
          <Button
            type="submit"
            onClick={() => deleteWallet(record)}
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

  const toggleCentered = () => {
    setModalCentered(!modalCentered)
  }

  const [formData, setformData] = useState({
    walletName: '',
    walletAddress: '',
    walletPrivateKey: '',
    simulation: false,
  })

  const handleChange = (name, value) => {
    const fieldName = name
    const fieldValue = value
    setformData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }))
  }

  const saveData = () => {
    WalletService.saveData(formData).then((response) => {
      toggleCentered()
      console.log(response.data.code)
      if (response.data.error) {
        notification.error({
          message: 'Error',
          description: `Error :${response.data.error}`,
        })
      } else WalletsData()
    })
  }

  const deleteWallet = (record) => {
    WalletService.deleteWallet(record).then((response) => {
      console.log(response.data.code)
      if (response.data.error) {
        notification.error({
          message: 'Error',
          description: `Error :${response.data.error}`,
        })
      } else WalletsData()
    })
  }

  const onChange = (checked) => {
    setSimulation(checked)
    console.log(`switch to ${checked}`)
    handleChange('simulation', checked)
  }

  const WalletsData = () => {
    WalletService.getWallets().then((response) => {
      setWallets(response.data)
    })
  }

  useEffect(() => {
    WalletsData()
  }, [setWallets])

  return (
    <div>
      <Helmet title="Wallet Management" />
      <div className="row">
        <div className="col-lg-12">
          <div className="card card-top card-top-info">
            <div className="card-header py-0">
              <div className="card-header-flex align-items-center">
                <div className="d-flex flex-column justify-content-center mr-auto">
                  <h5 className="mb-0">
                    <strong>Wallets</strong>
                  </h5>
                </div>
                <div>
                  <Button
                    type="submit"
                    className="btn btn-info btn-sm "
                    onClick={() => toggleCentered()}
                  >
                    Add New
                  </Button>
                </div>
              </div>
            </div>
            <div className="responsive-table">
              <Table
                columns={columns}
                dataSource={wallets}
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

            <Modal isOpen={modalCentered} toggle={toggleCentered} className="card">
              <ModalHeader toggle={() => toggleCentered()}>Add new Wallet</ModalHeader>
              <ModalBody>
                <div className="card-body">
                  <Form {...formItemLayout} labelAlign="right">
                    <Form.Item name="network" label="Wallet Name">
                      <Input
                        placeholder="wallet name"
                        name="walletName"
                        value={formData.walletName ? formData.walletName : ''}
                        onChange={(e) => handleChange('walletName', e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item name="simulation" label="Enable Simulation" className="mb-3">
                      <Switch
                        placeholder="simulation"
                        name="simulation"
                        checked={simulation}
                        onChange={onChange}
                      />
                    </Form.Item>

                    <Form.Item name="walletAddress" label="Address" className="mb-3">
                      <Input
                        placeholder="Address"
                        name="walletAddress"
                        disabled={simulation}
                        value={formData.walletAddress ? formData.walletAddress : ''}
                        onChange={(e) => handleChange('walletAddress', e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item name="walletPrivateKey" label="PrivateKey" className="mb-3">
                      <Input
                        placeholder="PrivateKey"
                        name="walletPrivateKey"
                        disabled={simulation}
                        value={formData.walletPrivateKey ? formData.walletPrivateKey : ''}
                        onChange={(e) => handleChange('walletPrivateKey', e.target.value)}
                      />
                    </Form.Item>
                    <Button
                      type="submit"
                      className="btn btn-sm btn-success px-5"
                      onClick={() => saveData()}
                    >
                      Save
                    </Button>
                  </Form>
                </div>
              </ModalBody>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletManagement
