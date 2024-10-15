// BucketElevatorsAddForm.js
import React, { useCallback, useEffect, useState } from "react"
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"

export const BucketElevatorsAddForm = ({
  setHeight,
  setBeltSelected,
  setBeltLength,
  setBucketSelected,
  setBucketQuantity,
  setGearboxesSelected,
  setDriveBeltSelected,
  setDriveBeltsQuantity,
  setMotor,
  data,
}) => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  const [formData, setFormData] = useState({ belts: {}, buckets: {}, gearboxes: {}, driveBelts: {}, motors: {} })

  const fetchData = useCallback(async () => {
    if (currentUser.login) {
      try {
        setReqStatus({ loading: true, error: null })
        const belts = await getDataFromEndpoint(currentUser.token, "/admin/machines/bucketElevators/beltBrands/readAll", "POST", null, setReqStatus)
        const buckets = await getDataFromEndpoint(currentUser.token, "/admin/machines/bucketElevators/bucketBrands/readAll", "POST", null, setReqStatus)
        const gearboxes = await getDataFromEndpoint(currentUser.token, "/admin/machines/bucketElevators/gearboxBrands/readAll", "POST", null, setReqStatus)
        const driveBelts = await getDataFromEndpoint(currentUser.token, "/admin/machines/bucketElevators/driveBelts/readAll", "POST", null, setReqStatus)
        // ! Заменить на мотор, а не конфигурацию!!
        const motors = await getDataFromEndpoint(currentUser.token, "/admin/devices/motor/config/readAll", "POST", null, setReqStatus)
        // const motors = await getDataFromEndpoint(currentUser.token, "/admin/devices/motor/readAll", "POST", null, setReqStatus)

        // Обновление состояния с объединением данных
        setFormData({
          belts: belts || {},
          buckets: buckets || {},
          gearboxes: gearboxes || {},
          driveBelts: driveBelts || {},
          motors: motors || {},
        })

        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error.message })
      }
    }
  }, [currentUser])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Добавьте состояния для каждого поля формы
  const [height, setHeightState] = useState("")
  const [beltSelected, setBeltSelectedState] = useState("")
  const [beltLength, setBeltLengthState] = useState("")
  const [bucketBrand, setBucketBrandState] = useState("")
  const [bucketQuantity, setBucketQuantityState] = useState("")
  const [gearboxBrand, setGearboxBrandState] = useState("")
  const [driveBeltsBrand, setDriveBeltsBrandState] = useState("")
  const [driveBeltsQuantity, setDriveBeltsQuantityState] = useState("")
  // ! Заменить на номер мотора (dced61ee...)
  const [motorConfig, setMotorConfigState] = useState("")
  // ... остальные состояния для полей
  // Функция для обновления состояний на основе dataToEdit
  useEffect(() => {
    if (data) {
      setHeightState(data.height)
      setHeight(data.height)

      setBeltSelectedState(data.beltBrand_id)
      setBeltSelected(data.beltBrand_id)

      setBeltLengthState(data.belt_length)
      setBeltLength(data.belt_length)

      setBucketBrandState(data.bucketBrand_id)
      setBucketSelected(data.bucketBrand_id)

      setBucketQuantityState(data.bucket_quantity)
      setBucketQuantity(data.bucket_quantity)

      setGearboxBrandState(data.gearboxBrand_id)
      setGearboxesSelected(data.gearboxBrand_id)

      setDriveBeltsBrandState(data.driveBeltBrand_id)
      setDriveBeltSelected(data.driveBeltBrand_id)

      setDriveBeltsQuantityState(data.driveBelt_quantity)
      setDriveBeltsQuantity(data.driveBelt_quantity)

      setMotorConfigState(data.motor_config_id)
      setMotor(data.motor_config_id)
      // ... обновление остальных состояний на основе dataToEdit
    }
  }, [data])

  return (
    <Stack direction="column" spacing={2}>
      <FormControl>
        <InputLabel shrink variant="standard" htmlFor="height" sx={{ pl: 1 }}>
          Высота нории:
        </InputLabel>
        <TextField
          type="number"
          name="height"
          value={height} // используйте состояние для значения
          onChange={e => {
            setHeight(e.target.value) // обновление состояния родительского компонента, если нужно
            setHeightState(e.target.value) // обновление локального состояния
          }}
        />
      </FormControl>
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="belts-select" sx={{ pl: 1 }}>
            Лента:
          </InputLabel>
          <Select
            value={beltSelected}
            onChange={e => {
              setBeltSelected(e.target.value)
              setBeltSelectedState(e.target.value)
            }}
            inputProps={{
              name: "belts",
              id: "belts-select",
            }}>
            <MenuItem value="" disabled>
              Выберите марку ленты
            </MenuItem>
            {Object.values(formData.belts).map(belt => (
              <MenuItem key={belt.id} value={belt.id}>
                {belt.brand_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel shrink variant="standard" htmlFor="belt_length" sx={{ pl: 1 }}>
            Длина ленты:
          </InputLabel>
          <TextField
            type="number"
            name="belt_length"
            value={beltLength}
            onChange={e => {
              setBeltLength(e.target.value)
              setBeltLengthState(e.target.value)
            }}
          />
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="buckets-select" sx={{ pl: 1 }}>
            Ковши:
          </InputLabel>
          <Select
            value={bucketBrand}
            onChange={e => {
              setBucketSelected(e.target.value)
              setBucketBrandState(e.target.value)
            }}
            inputProps={{
              name: "buckets",
              id: "buckets-select",
            }}>
            <MenuItem value="" disabled>
              Выберите марку ковшей
            </MenuItem>
            {Object.values(formData.buckets).map(bucket => (
              <MenuItem key={bucket.id} value={bucket.id}>
                {bucket.brand_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel shrink variant="standard" htmlFor="bucket_quantity" sx={{ pl: 1 }}>
            Кол-во. ковшей:
          </InputLabel>
          <TextField
            type="number"
            name="bucket_quantity"
            value={bucketQuantity}
            onChange={e => {
              setBucketQuantity(e.target.value)
              setBucketQuantityState(e.target.value)
            }}
          />
        </FormControl>
      </Stack>
      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor="gearboxes-select" sx={{ pl: 1 }}>
          Редуктор:
        </InputLabel>
        <Select
          value={gearboxBrand}
          onChange={e => {
            setGearboxesSelected(e.target.value)
            setGearboxBrandState(e.target.value)
          }}
          inputProps={{
            name: "gearboxes",
            id: "gearboxes-select",
          }}>
          <MenuItem value="" disabled>
            Выберите марку редуктора
          </MenuItem>
          {Object.values(formData.gearboxes).map(gearbox => (
            <MenuItem key={gearbox.id} value={gearbox.id}>
              {gearbox.brand_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="driveBelts-select" sx={{ pl: 1 }}>
            Приводной ремень:
          </InputLabel>
          <Select
            value={driveBeltsBrand}
            onChange={e => {
              setDriveBeltSelected(e.target.value)
              setDriveBeltsBrandState(e.target.value)
            }}
            inputProps={{
              name: "driveBelts",
              id: "driveBelts-select",
            }}>
            <MenuItem value="" disabled>
              Выберите приводной ремень
            </MenuItem>
            {Object.values(formData.driveBelts).map(driveBelt => (
              <MenuItem key={driveBelt.id} value={driveBelt.id}>
                {driveBelt.brand_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel shrink variant="standard" htmlFor="driveBelts_quantity" sx={{ pl: 1 }}>
            Кол-во. ремней:
          </InputLabel>
          <TextField
            type="number"
            name="driveBelts_quantity"
            value={driveBeltsQuantity}
            onChange={e => {
              setDriveBeltsQuantity(e.target.value)
              setDriveBeltsQuantityState(e.target.value)
            }}
          />
        </FormControl>
      </Stack>
      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor="motors-select" sx={{ pl: 1 }}>
          Двигатель:
        </InputLabel>
        <Select
          value={motorConfig}
          onChange={e => {
            setMotor(e.target.value)
            setMotorConfigState(e.target.value)
          }}
          inputProps={{
            name: "motors",
            id: "motors-select",
          }}>
          <MenuItem value="" disabled>
            Выберите приводной ремень
          </MenuItem>
          {Object.values(formData.motors).map(data => (
            <MenuItem key={data.id} value={data.motor_config_id}>
              {data.motor_tech_num}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  )
}
