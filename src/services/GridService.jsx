import apiClient from './AxiosClient'

class GridService {
  getAutoGridParams = (networkName, pairSymbol) => {
    return apiClient.get(`/grid/getAutoGridParams/${networkName}/${pairSymbol}`)
  }

  createGrid = (formData) => {
    return apiClient.post('/grid/createGrid', formData)
  }

  generateGrid = (formData) => {
    return apiClient.post('/grid/generateGrid', formData)
  }

  activateGrid = (id) => {
    return apiClient.get(`/grid/toggleGridStatus/${id}`)
  }

  startGrid = (formData) => {
    return apiClient.post('/grid/startTrades', formData)
  }

  terminateGrid = (formData) => {
    return apiClient.post('/grid/terminateGrid', formData)
  }

  restartGrid = (formData) => {
    return apiClient.post('/grid/restartGrid', formData)
  }

  getAllGrids = () => {
    return apiClient.get('/grid/allArchivedGrids')
  }

  getAllActiveGrids = () => {
    return apiClient.get('/grid/allActiveGrids')
  }

  getHistoryData = (pairSymbol) => {
    return apiClient.get(`/history/get/${pairSymbol}`)
  }

  loadOpenOrders = (pairSymbol, network) => {
    return apiClient.get(`/gridorders/getAllOrders/${pairSymbol}/${network}`)
  }

  getProfitLoss = () => {
    return apiClient.get('/gridorders/getProfitLoss')
  }
}

export default new GridService()
