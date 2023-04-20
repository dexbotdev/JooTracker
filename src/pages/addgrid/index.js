import React, { useState, useEffect } from 'react'
import { Input, Slider, Form, Table, Select, Tag, Button, Checkbox, notification } from 'antd'
import { Helmet } from 'react-helmet'
import HeadersHeading from '@vb/widgets/Headers/Heading'
import TokenService from 'services/TokenService'
import PairsService from 'services/PairsService'
import GridService from 'services/GridService'
import { Container, Row, Col, Badge, Toast, ToastBody, ToastHeader } from 'reactstrap'
import WalletService from 'services/WalletService'
import { useHistory } from 'react-router-dom'
import CheckableTag from 'antd/lib/tag/CheckableTag'
import LoadingOverlay from 'react-loading-overlay'
import Status from 'layouts/Main/MenuSimply/Status'

const AddGrid = () => {
  const [form] = Form.useForm()
  const [networks, setNetworks] = useState([])
  const [wallets, setWallets] = useState([])
  const [pairs, setPairs] = useState([])
  const formRef = React.createRef()
  const [neatHidden, setNeatHidden] = useState(true)
  const [srcData, setSrcData] = useState({
    pairSymbol: '',
    networkName: '',
  })
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [walletLabel, setWalletLabel] = useState('USDT')

  const [formData, setFormData] = useState({
    id: 0,
    priceUpperCap: '',
    priceLowerCap: '',
    orderSize: '',
    pairSymbol: '',
    gridCount: '',
    direction: '',
    startPrice: '',
    stopLossPrice: '',
    takeProfitPrice: '',
    token0: '',
    token1: '',
    token0Decimals: '',
    token1Decimals: '',
    network: '',
    slippage: '',
    srcSymbol: '',
    destSymbol: '',
    walletName: '',
    useWalletMargin: 0.0,
    immediateStart: false,
    profitRange: '',
    chainId: '',
  })

  const createGrid = () => {
    console.log(form.getFieldsValue())
    setLoading(true)
    GridService.createGrid(formData)
      .then((response) => {
        if (response.data.code && response.data.code !== 200) {
          notification.error({
            message: 'Error',
            description: response.data.error,
          })
          setLoading(false)
          return
        }
        history.push('/rungrids')
      })
      .catch((error) => {
        notification.error({
          message: 'Error',
          description: error,
        })
      })
  }
  const getPairsByNetwork = (networkName) => {
    PairsService.getPairsByNetwork(networkName).then((response) => {
      setPairs(response.data)
    })
  }

  const loadAutoConfig = () => {
    setLoading(true)
    GridService.getAutoGridParams(srcData.networkName, srcData.pairSymbol)
      .then((response) => {
        console.log(response.data)

        if (response.data.code && response.data.code !== 200) {
          notification.error({
            message: 'Error',
            description: response.data.error,
          })
          setLoading(false)

          return
        }
        const formvals = response.data

        form.setFieldsValue({
          id: 0,
          priceUpperCap: formvals.priceUpperCap,
          priceLowerCap: formvals.priceLowerCap,
          orderSize: formvals.orderSize,
          pairSymbol: formvals.pairSymbol,
          gridCount: formvals.gridCount,
          direction: formvals.direction,
          startPrice: formvals.startPrice,
          stopLossPrice: formvals.stopLossPrice,
          takeProfitPrice: formvals.takeProfitPrice,
          token0: formvals.token0,
          token1: formvals.token1,
          token0Decimals: formvals.token0Decimals,
          token1Decimals: formvals.token1Decimals,
          srcSymbol: formvals.token0Symbol,
          destSymbol: formvals.token1Symbol,
          network: formvals.network,
          slippage: formvals.slippage,
          useWalletMargin: formvals.useWalletMargin,
          walletName: formvals.walletName,
          profitRange: formvals.profitRange,
        })

        setNeatHidden(false)
        setWalletLabel(`Min ${formvals.token1Symbol} Required`)
        setFormData(form.getFieldsValue())
        console.log(formData)
        setLoading(false)
      })
      .catch((error) => {
        // eslint-disable-next-line no-alert

        notification.error({
          message: 'Error',
          description: error,
        })
      })
  }

  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`)
    handleChange('immediateStart', e.target.checked)
  }

  const handleNetChange = (name, value) => {
    handleSrcChange(name, value)
    getPairsByNetwork(value)
  }

  const handleChange = (name, value) => {
    const fieldName = name
    const fieldValue = value
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }))
  }

  const handleSrcChange = (name, value) => {
    const fieldName = name
    const fieldValue = value
    setSrcData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }))
  }

  useEffect(() => {
    TokenService.getListOfNetworks().then((response) => {
      console.log(response.data)
      setNetworks(response.data)
    })

    WalletService.getWallets().then((response) => {
      setWallets(response.data)
    })
  }, [])

  return (
    <div>
      <Helmet title="Grids" />
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="col-lg-12">
              <div className="card-header py-0">
                <div className="card-header-flex align-items-center">
                  <div className="d-flex flex-column justify-content-left mr-auto">
                    <h5 className="mb-0">
                      <strong>Select GRID Pair &nbsp;&nbsp;&nbsp;&nbsp;</strong>
                    </h5>
                  </div>
                  <div>
                    <Form layout="inline" ref={formRef} name="customForm">
                      <Form.Item name="networkName" className="mb-1 mt-1">
                        <Select
                          size="small"
                          placeholder="Select Network"
                          name="networkName"
                          value={srcData.networkName}
                          onSelect={(value) => {
                            handleNetChange('networkName', value)
                          }}
                        >
                          {networks &&
                            networks.map((option, i) => (
                              <Select.Option key={option.chainId} value={option.name}>
                                {option.name}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                      <Form.Item name="pairSymbol" className="mb-1 mt-1">
                        <Select
                          size="small"
                          placeholder="Select Grid Pair"
                          name="pairSymbol"
                          value={srcData.pairSymbol}
                          onSelect={(value) => handleSrcChange('pairSymbol', value)}
                          allowClear
                        >
                          {pairs &&
                            pairs.map((option, i) => (
                              <Select.Option key={option.token0} value={option.pairSymbol}>
                                {option.pairSymbol}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                      <button
                        type="button"
                        className="btn btn-info btn-sm mt-1 mb-1"
                        onClick={loadAutoConfig}
                      >
                        Autogen
                      </button>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
            <LoadingOverlay active={loading} spinner text="Loading your content...">
              <div className="responsive-table">
                <div className="container" hidden={neatHidden}>
                  <div className="mb-5">
                    <div className="vb__utils__docs">
                      <Container fluid>
                        <Form name="customForm" layout="vertical" form={form}>
                          <h6 className="mb-4 mt-3">
                            <Badge color="success">
                              <strong>Grid Parameters</strong>
                            </Badge>
                          </h6>
                          <Row xs="1" sm="2" md="4">
                            <Col>
                              <Form.Item
                                name="priceLowerCap"
                                label={<strong>Lower Range</strong>}
                                className="mb-3"
                              >
                                <Input
                                  placeholder="Lower Range"
                                  style={{ color: 'red', fontWeight: 'bolder' }}
                                  name="priceLowerCap"
                                  onChange={(e) => handleChange('priceLowerCap', e.target.value)}
                                  value={formData.priceLowerCap ? formData.priceLowerCap : ''}
                                />
                              </Form.Item>
                            </Col>
                            <Col>
                              <Form.Item
                                name="priceUpperCap"
                                label={<strong>Upper Range</strong>}
                                className="mb-3"
                              >
                                <Input
                                  placeholder="Upper Range"
                                  style={{ color: 'green', fontWeight: 'bolder' }}
                                  name="priceUpperCap"
                                  value={formData.priceUpperCap}
                                  onChange={(e) => handleChange('priceUpperCap', e.target.value)}
                                />
                              </Form.Item>
                            </Col>
                            <Col>
                              <Form.Item
                                name="startPrice"
                                label={<strong>Start Price</strong>}
                                className="mb-3"
                              >
                                <Input
                                  placeholder="Start Price"
                                  style={{ color: 'green', fontWeight: 'bolder' }}
                                  name="startPrice"
                                  value={formData.startPrice}
                                  onChange={(e) => handleChange('startPrice', e.target.value)}
                                />
                              </Form.Item>
                            </Col>
                            <Col>
                              <Form.Item
                                name="gridCount"
                                label={<strong>Grid Count</strong>}
                                className="mb-3"
                              >
                                <Input
                                  placeholder="Grid Count"
                                  style={{ color: 'red', fontWeight: 'bolder' }}
                                  name="gridCount"
                                  value={formData.gridCount}
                                  onChange={(e) => handleChange('gridCount', e.target.value)}
                                />
                              </Form.Item>
                            </Col>

                            <Col>
                              <Form.Item
                                name="orderSize"
                                label={<strong>Min Order Size</strong>}
                                className="mb-3"
                              >
                                <Input
                                  placeholder="Order Size"
                                  style={{ color: 'red', fontWeight: 'bolder' }}
                                  name="orderSize"
                                  value={formData.orderSize}
                                  onChange={(e) => handleChange('orderSize', e.target.value)}
                                />
                              </Form.Item>
                            </Col>
                            <Col>
                              <Form.Item
                                name="useWalletMargin"
                                label={<strong>{walletLabel}</strong>}
                                className="mb-3"
                              >
                                <Input
                                  placeholder="Amount to Use"
                                  style={{ color: 'red', fontWeight: 'bolder' }}
                                  name="useWalletMargin"
                                  value={formData.useWalletMargin}
                                  onChange={(e) => handleChange('useWalletMargin', e.target.value)}
                                />
                              </Form.Item>
                            </Col>
                            <Col>
                              <Form.Item
                                name="stopLossPrice"
                                label={<strong>StopLoss Price</strong>}
                                className="mb-3"
                              >
                                <Input
                                  placeholder="StopLoss Price"
                                  style={{ color: 'red', fontWeight: 'bolder' }}
                                  name="stopLossPrice"
                                  value={formData.stopLossPrice}
                                  onChange={(e) => handleChange('stopLossPrice', e.target.value)}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          <h6 className="mb-4 mt-3">
                            <Badge color="success">
                              <strong>Grid Config</strong>
                            </Badge>
                          </h6>
                          <div className="mb-5">
                            <Row>
                              <Col>
                                <Form.Item
                                  name="x1"
                                  label=<strong>Estimated Profit Per Grid</strong>
                                  className="mb-3"
                                >
                                  <Badge color="info">
                                    <strong>{formData.profitRange}</strong>
                                  </Badge>
                                </Form.Item>
                              </Col>
                              <Col>
                                <Form.Item
                                  name="x2"
                                  label=<strong>Wallet Name</strong>
                                  className="mb-3"
                                >
                                  <Badge color="info">
                                    <strong>{formData.walletName}</strong>
                                  </Badge>
                                </Form.Item>
                              </Col>
                              <Form.Item name="profitRange" type="hidden">
                                <Input
                                  type="hidden"
                                  name="profitRange"
                                  value={formData.profitRange}
                                />
                              </Form.Item>
                              <Form.Item name="walletName" type="hidden">
                                <Input
                                  type="hidden"
                                  name="walletName"
                                  value={formData.walletName}
                                />
                              </Form.Item>
                              <Form.Item name="token0" type="hidden">
                                <Input type="hidden" name="token0" value={formData.token0} />
                              </Form.Item>
                              <Form.Item name="token1" type="hidden">
                                <Input type="hidden" name="token1" value={formData.token1} />
                              </Form.Item>
                              <Form.Item name="direction" type="hidden">
                                <Input type="hidden" name="direction" value={formData.direction} />
                              </Form.Item>
                              <Form.Item name="active" type="hidden">
                                <Input type="hidden" name="active" value={formData.active} />
                              </Form.Item>
                              <Form.Item name="active" type="hidden">
                                <Input type="hidden" name="active" value={formData.srcSymbol} />
                              </Form.Item>
                              <Form.Item name="active" type="hidden">
                                <Input type="hidden" name="active" value={formData.destSymbol} />
                              </Form.Item>
                              <Form.Item name="token0Decimals" type="hidden">
                                <Input
                                  type="hidden"
                                  name="token0Decimals"
                                  value={formData.token0Decimals}
                                />
                              </Form.Item>
                              <Form.Item name="token1Decimals" type="hidden">
                                <Input
                                  type="hidden"
                                  name="token1Decimals"
                                  value={formData.token1Decimals}
                                />
                              </Form.Item>
                              <Form.Item name="pairSymbol" type="hidden">
                                <Input
                                  type="hidden"
                                  name="pairSymbol"
                                  value={formData.pairSymbol}
                                />
                              </Form.Item>
                              <Form.Item name="network" type="hidden">
                                <Input type="hidden" name="network" value={formData.network} />
                              </Form.Item>
                              <Form.Item name="chainId" type="hidden">
                                <Input type="hidden" name="chainId" value={formData.chainId} />
                              </Form.Item>
                              <Form.Item name="slippage" type="hidden">
                                <Input type="hidden" name="slippage" value={formData.slippage} />
                              </Form.Item>
                            </Row>
                          </div>
                          <div className="border-top text-dark font-size-18 pt-4 text-right">
                            <Button
                              onClick={() => createGrid()}
                              className="btn btn-sm btn-success width-200 mb-2"
                            >
                              Create Grid
                            </Button>
                          </div>
                        </Form>
                      </Container>
                    </div>
                  </div>
                </div>
              </div>
            </LoadingOverlay>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddGrid
