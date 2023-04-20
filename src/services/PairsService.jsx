import apiClient from './AxiosClient'

class PairsService {
  getPairsByNetwork = (networkName) => {
    return apiClient.get(`/pairs/getPairsByNetwork/${networkName}`)
  }

  getPairs = () => {
    return apiClient.get(`/pairs/activePairs`)
  }

  saveData = (formData) => {
    return apiClient.post('/pairs/createPair', formData)
  }

  deletePair = (record) => {
    return apiClient.delete(`/pairs/deletePair/${record.id}`)
  }
}

export default new PairsService()
