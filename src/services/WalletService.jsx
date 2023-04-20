import apiClient from './AxiosClient'

class WalletService {
  getWallets = () => {
    return apiClient.get('/wallet/wallets')
  }

  getWalletBalanceByNetwork = (networkname) => {
    return apiClient.get('/wallet/balances')
  }

  saveData = (formData) => {
    return apiClient.post('/wallet/createWallet', formData)
  }

  deleteWallet = (record) => {
    return apiClient.delete(`/wallet/delete/${record.id}`)
  }
}

export default new WalletService()
