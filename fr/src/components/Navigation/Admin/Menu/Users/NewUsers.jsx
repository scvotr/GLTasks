import { useCallback, useEffect, useState } from "react"
import { AppBar, Toolbar, Typography } from "@mui/material"
import { useAuthContext } from "../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../utils/getDataFromEndpoint"

export const NewUsers = () => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [allUsers, setAllUsers] = useState([])
  console.log(allUsers)

  const fetchData = useCallback(async () => {
    if (currentUser.login) {
      try {
        setReqStatus({ loading: true, error: null })
        const data = await getDataFromEndpoint(currentUser.token, "/admin/getAllUsers", "POST", null, setReqStatus)
        setAllUsers(data)
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error.message })
      }
    }
  }, [currentUser])

  useEffect(() => {fetchData()}, [fetchData])

  return (
    <>
      <AppBar
        position="static"
        sx={{
          mt: 2,
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          border: "1px solid #e0e0e0",
          borderRadius: "5px",
        }}>
        <Toolbar>
          <Typography>Пользователи: </Typography>
        </Toolbar>
      </AppBar>
    </>
  )
}
