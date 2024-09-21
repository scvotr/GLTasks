import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button, Stack } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { Loader } from "../../../../../FormComponents/Loader/Loader"
import { BucketElevatorsAddForm } from "./BucketElevatorsAddForm"

export const BucketElevatorsCreate = ({ generalDeviceData, onClose }) => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  const [beltSelected, setBeltSelected] = useState()
  const [bucketSelected, setBucketSelected] = useState()
  const [gearboxesSelected, setGearboxesSelected] = useState()
  const [driveBeltSelected, setDriveBeltSelected] = useState()
  const [height, setHeight] = useState()
  const [beltLength, setBeltLength] = useState()
  const [bucketQuantity, setBucketQuantity] = useState()
  const [driveBeltsQuantity, setDriveBeltsQuantity] = useState()

  const handleSubmit = async () => {
    try {
      setReqStatus({ loading: true, error: null })
      const extendedDeviceData = {
        ...generalDeviceData,
        height: height,
        belt_brand_id: beltSelected,
        belt_installation_date: "",
        belt_length: beltLength,
        bucket_brand_id: bucketSelected,
        bucket_installation_date: "",
        bucket_quantity: bucketQuantity,
        gearbox_brand_id: gearboxesSelected,
        gearbox_installation_date: "",
        driveBelts_brand_id: driveBeltSelected,
        driveBelts_quantity: driveBeltsQuantity,
        driveBelts_installation_date: "",
      }
      await getDataFromEndpoint(currentUser.token, `/admin/devices/bucketElevators/create`, "POST", extendedDeviceData, setReqStatus)
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
          <BucketElevatorsAddForm
            setHeight={setHeight}
            setBeltSelected={setBeltSelected}
            setBeltLength={setBeltLength}
            setBucketSelected={setBucketSelected}
            setBucketQuantity={setBucketQuantity}
            setGearboxesSelected={setGearboxesSelected}
            setDriveBeltSelected={setDriveBeltSelected}
            setDriveBeltsQuantity={setDriveBeltsQuantity}
          />

          <Button variant="contained" color="primary" onClick={handleSubmit}>
            создать
          </Button>
        </Stack>
      </Loader>
    </Box>
  )
}
