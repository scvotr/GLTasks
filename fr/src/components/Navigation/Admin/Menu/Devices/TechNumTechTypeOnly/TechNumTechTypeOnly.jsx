import { Box, Button, Stack } from "@mui/material"
import { useState } from "react"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { Loader } from "../../../../../FormComponents/Loader/Loader"

export const TechNumTechTypeOnly = ({ generalDeviceData, onClose }) => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  const handleSubmit = async () => {
    try {
      setReqStatus({ loading: true, error: null })
      const extendedDeviceData = {
        ...generalDeviceData,
      }
      await getDataFromEndpoint(currentUser.token, `/admin/devices/emptyDevice/create`, "POST", extendedDeviceData, setReqStatus)
      setReqStatus({ loading: false, error: null })
      onClose()
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Loader reqStatus={reqStatus}>
        <Stack direction="column" spacing={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!generalDeviceData.tech_num}>
            создать
          </Button>
        </Stack>
      </Loader>
    </Box>
  )
}
