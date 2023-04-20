import apiClient from "./AxiosClient";

class TokenService {
  getListOfNetworks = () => {
    return apiClient.get("/tokens/networks");
  };

  getTokensByChainId = (chainId) => {
    return apiClient.get(`/tokens/tokens/${chainId}`);
  };

  getTokensData = () => {
    return apiClient.get("/tokens/tokens");
  };

  saveData=(formData)=>{
    return apiClient.post("/tokens/addToken", formData);
  }
}

export default new TokenService();
