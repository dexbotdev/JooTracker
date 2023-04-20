import apiClient from './AxiosClient'

class SysService {
  getAppStatus = () => {
    return apiClient.get('/system/status')
  }

  requestLicense = (formData) => {
    return apiClient.post('/system/requestLicense', formData)
  }

  requestLicenseCnt = () => {
    return apiClient.post('/system/getRequestsCount')
  }

  getCurrentLicense = () => {
    return apiClient.get('/system/getCurrentLicense')
  }

  getAllRequests = () => {
    return apiClient.get('/system/getAllRequests')
  }

  deleteLicRequest = (record) => {
    return apiClient.delete(`/system/deleteLicRequest/?id=${record.id}`)
  }
}

export default new SysService()
