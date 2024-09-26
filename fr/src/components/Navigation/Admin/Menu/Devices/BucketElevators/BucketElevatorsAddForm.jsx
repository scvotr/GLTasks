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

  return (
    <Stack direction="column" spacing={2}>
      <FormControl>
        <InputLabel shrink variant="standard" htmlFor="height" sx={{ pl: 1 }}>
          Высота нории:
        </InputLabel>
        <TextField type="number" name="height" onChange={e => setHeight(e.target.value)} />
      </FormControl>
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="belts-select" sx={{ pl: 1 }}>
            Лента:
          </InputLabel>
          <Select
            onChange={e => setBeltSelected(e.target.value)}
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
          <TextField type="number" name="belt_length" onChange={e => setBeltLength(e.target.value)} />
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="buckets-select" sx={{ pl: 1 }}>
            Ковши:
          </InputLabel>
          <Select
            onChange={e => setBucketSelected(e.target.value)}
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
          <TextField type="number" name="bucket_quantity" onChange={e => setBucketQuantity(e.target.value)} />
        </FormControl>
      </Stack>
      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor="gearboxes-select" sx={{ pl: 1 }}>
          Редуктор:
        </InputLabel>
        <Select
          onChange={e => setGearboxesSelected(e.target.value)}
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
            onChange={e => setDriveBeltSelected(e.target.value)}
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
          <TextField type="number" name="driveBelts_quantity" onChange={e => setDriveBeltsQuantity(e.target.value)} />
        </FormControl>
      </Stack>
      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor="motors-select" sx={{ pl: 1 }}>
          Двигатель:
        </InputLabel>
        <Select
          onChange={e => setMotor(e.target.value)}
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
