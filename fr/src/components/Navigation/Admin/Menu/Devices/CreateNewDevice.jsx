import { useEffect, useState } from "react"
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import { Loader } from "../../../../FormComponents/Loader/Loader"
import { useDeviceData } from "./useDeviceData"
import { BucketElevatorsCreate } from "./BucketElevators/BucketElevatorsCreate"
import { v4 as uuidv4 } from "uuid"

export const CreateNewDevice = ({ onClose }) => {
  const { useAllDeviceTypes, useGroupedWorkflowsByDep, useReqStatus } = useDeviceData()
  const [selectedDepartment, setSelectedDepartment] = useState([])
  const [selectedWorkshop, setSelectedWorkshop] = useState("")
  const [selectedDeviceType, setSelectedDeviceType] = useState("")
  const [technoNumber, setTechnoNumber] = useState("")
  const [deviceId, setDeviceId] = useState("")

  const handleDepartmentChange = e => {
    const selected = useGroupedWorkflowsByDep[e.target.value]
    setSelectedDepartment({
      name: e.target.value,
      id: selected ? selected[0].department_id : "",
    })
    setSelectedWorkshop("") // Сбросить выбранный цех
    setSelectedDeviceType("") // Сбросить выбранный тип
  }

  useEffect(() => {
    setSelectedWorkshop("")
    setSelectedDeviceType("")
  }, [selectedDepartment])

  const handleDeviceTypeChange = value => {
    setSelectedDeviceType(value)
    setDeviceId(uuidv4()) // Генерируйте device_id при выборе типа устройства
  }

  const generalDeviceData = {
    device_id: deviceId,
    department_id: selectedDepartment.id,
    workshop_id: selectedWorkshop,
    type_id: selectedDeviceType,
    tech_num: technoNumber,
  }

  const deviceTypeComponents = {
    1: { title: "Нория", component: <BucketElevatorsCreate generalDeviceData={generalDeviceData} onClose={onClose}/> },
    2: { title: "Вентилятор", component: "" }, // замените FanComponent на ваш компонент
    3: { title: "Транспортер", component: "" }, // замените TransporterComponent на ваш компонент
    4: { title: "Конвейер", component: "" }, // замените ConveyorComponent на ваш компонент
    5: { title: "Сепаратор", component: "" }, // замените SeparatorComponent на ваш компонент
    6: { title: "БЗО", component: "" }, // замените BZOComponent на ваш компонент
    7: { title: "МПО", component: "" }, // замените MPOComponent на ваш компонент
    8: { title: "Шнек", component: "" }, // замените ScrewComponent на ваш компонент
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Loader reqStatus={useReqStatus}>
        <Stack direction="column">
          <Stack direction="row">
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel variant="standard" htmlFor="department-select" sx={{ pl: 1 }}>
                Департамент:
              </InputLabel>
              <Select
                value={selectedDepartment?.name || ""}
                onChange={handleDepartmentChange}
                inputProps={{
                  name: "department",
                  id: "department-select",
                }}>
                <MenuItem value="" disabled>
                  Выберите департамент
                </MenuItem>
                {Object.keys(useGroupedWorkflowsByDep).map(department => (
                  <MenuItem key={department} value={department}>
                    {department}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedDepartment?.name && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel variant="standard" htmlFor="workshop-select" sx={{ pl: 1 }}>
                  Цех
                </InputLabel>
                <Select
                  value={selectedWorkshop}
                  onChange={e => setSelectedWorkshop(e.target.value)}
                  inputProps={{
                    name: "workshop",
                    id: "workshop-select",
                  }}>
                  <MenuItem value="" disabled>
                    Выберите цех
                  </MenuItem>
                  {useGroupedWorkflowsByDep[selectedDepartment.name]?.map(workshop => (
                    <MenuItem key={workshop.id} value={workshop.id}>
                      {workshop.workshop_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
          {selectedWorkshop && (
            <>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel variant="standard" htmlFor="workshop-select" sx={{ pl: 1 }}>
                  Тип
                </InputLabel>
                <Select
                  value={selectedDeviceType}
                  // onChange={e => setSelectedDeviceType(e.target.value)}
                  onChange={e => handleDeviceTypeChange(e.target.value)} // Обновите обработчик
                  inputProps={{
                    name: "type",
                    id: "type-select",
                  }}>
                  <MenuItem value="" disabled>
                    Выберите тип
                  </MenuItem>
                  {useAllDeviceTypes &&
                    useAllDeviceTypes.map(data => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </>
          )}
          <Box sx={{ p: 2 }}>
            {selectedDeviceType && (
              <Box sx={{ mt: 2 }} component="form">
                <Stack direction='column'>
                  <FormControl sx={{ mb: 2 }}>
                    <TextField
                      label="№ технологический"
                      variant="outlined"
                      value={technoNumber}
                      onChange={e => setTechnoNumber(e.target.value)}
                      required
                      type="number"
                    />
                  </FormControl>
                  {deviceTypeComponents[selectedDeviceType]?.component
                    ? deviceTypeComponents[selectedDeviceType].component
                    : deviceTypeComponents[selectedDeviceType]?.title || "Тип устройства не найден"}
                </Stack>
              </Box>
            )}
          </Box>
        </Stack>
      </Loader>
    </Box>
  )
}
