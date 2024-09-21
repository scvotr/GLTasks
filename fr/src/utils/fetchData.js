import { getDataFromEndpoint } from "./getDataFromEndpoint"

export const fetchData = async (currentUser, URL, setReqStatus, setDataFromEndpoint) => {
  if (currentUser.login) {
    try {
      setReqStatus({ loading: true, error: null })
      const data = await getDataFromEndpoint(currentUser.token, URL, 'POST', null, setReqStatus)
      setDataFromEndpoint(data)
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }
}
