import { Box, Button, Stack } from "@mui/material"
import { Loader } from "../../../../../FormComponents/Loader/Loader"
import { BucketElevatorsAddForm } from "./BucketElevatorsAddForm"
import { useState } from "react"

export const BucketElevatorEditForm = ({ data, onClose }) => {
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [beltSelected, setBeltSelected] = useState()
  const [bucketSelected, setBucketSelected] = useState()
  const [gearboxesSelected, setGearboxesSelected] = useState()
  const [driveBeltSelected, setDriveBeltSelected] = useState()
  const [height, setHeight] = useState()
  const [beltLength, setBeltLength] = useState()
  const [bucketQuantity, setBucketQuantity] = useState()
  const [driveBeltsQuantity, setDriveBeltsQuantity] = useState()
  const [motor, setMotor] = useState()

  const dataToUpdate = {
    device_id: data.device_id,
    department_id: data.department_id,
    workshop_id: data.workshop_id,
    type_id: data.type_id,
    tech_num: data.tech_num,
    // -----------------
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
    motor_config_id: motor,
  }

  const handleSubmit = async () => {
    console.log("dataToUpdate", dataToUpdate)
    onClose()
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
            setMotor={setMotor}
            data={data}
          />

          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Изменить
          </Button>
        </Stack>
      </Loader>
    </Box>
  )
}
