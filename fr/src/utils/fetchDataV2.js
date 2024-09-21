import { getDataFromEndpoint } from "./getDataFromEndpoint"

export const fetchDataV2 = async (currentUser, URL, setResponse, setDataFromEndpoint) => {
  if (currentUser.login) {
    try {
      setResponse({ loading: true })
      const data = await getDataFromEndpoint(currentUser.token, URL, 'POST', null, setResponse)
      setDataFromEndpoint(data)
      setResponse({ loading: false })
    } catch (error) {
      setResponse({ loading: false, error: error.message })
    }
  }
}
