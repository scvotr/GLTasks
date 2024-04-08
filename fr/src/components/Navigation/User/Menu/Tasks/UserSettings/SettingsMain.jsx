import { useEffect, useState } from "react"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { Typography, Grid, Card, CardContent, Divider } from "@mui/material"

export const SettingsMain = () => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [userData, setUserData] = useState({})
  const [errorPin, setErrorPin] = useState("")

  useEffect(() => {
    setReqStatus({ loading: true, error: null })
    getDataFromEndpoint(currentUser.token, "/user/getUserById", "POST", null, setReqStatus)
      .then(data => {
        setUserData(data)
        setReqStatus({ loading: false, error: null })
      })
      .catch(error => {
        setReqStatus({ loading: false, error: error })
      })
  }, [currentUser])
  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="body1">{(userData && userData.last_name) || ""}</Typography>
          <Typography variant="body1">{userData.first_name}</Typography>
          <Typography variant="body1">{userData.middle_name}</Typography>
        </CardContent>
        <CardContent>
          <Typography variant="body1">{(userData && userData.department) || ""}</Typography>
          <Typography variant="body1">{(userData && userData.subdepartment) || ""}</Typography>
          <Typography variant="body1">{(userData && userData.position) || ""}</Typography>
        </CardContent>
        <CardContent>
          <Typography variant="body1">
            <strong>№ тел.:</strong> {(userData && userData.external_phone) || ""}
          </Typography>
          <Typography variant="body1">
            <strong>№ внутр. тел./факс. :</strong> {(userData && userData.internal_phone) || ""}
          </Typography>
          <Typography variant="body1">
            <strong>№ каб. :</strong> {(userData && userData.office_number) || ""}
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}
