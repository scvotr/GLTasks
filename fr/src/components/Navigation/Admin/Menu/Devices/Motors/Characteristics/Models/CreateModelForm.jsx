import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "../../../../../../../../context/AuthProvider"
import { fetchData } from "../../../../../../../../utils/fetchData"
import { getDataFromEndpoint } from "../../../../../../../../utils/getDataFromEndpoint"
import { Loader } from "../../../../../../../FormComponents/Loader/Loader"
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"

export const CreateModelForm = ({ onClose }) => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [brands, setBrands] = useState([])
  console.log(brands)
  const [formData, setFormData] = useState({ name: "" })
  console.log(formData)

  const getDevicesTypes = useCallback(() => {
    fetchData(currentUser, "/admin/devices/motor/brands/read", setReqStatus, setBrands)
  }, [currentUser])

  useEffect(() => {
    getDevicesTypes()
  }, [currentUser, getDevicesTypes])

  const getFormData = e => {
    const { name, value } = e.target
    // Проверяем, если это поле name, и форматируем значение
    const formattedValue = name === "name" ? value.toLowerCase().trim() : value

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue,
    }))
  }

  const handleSubmit = async () => {
    if (formData.name.length === 0) {
      return
    } else {
      try {
        setReqStatus({ loading: true, error: null })
        await getDataFromEndpoint(currentUser.token, "/admin/devices/motor/models/create", "POST", formData, setReqStatus)
        onClose()
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error })
      }
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Loader reqStatus={reqStatus}>
        <Box
          component="form"
          sx={{
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            border: "1px solid #e0e0e0",
            borderRadius: "5px",
            "& .MuiTextField-root": { m: 1, width: "55ch" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mt: 2, p: 2 }}>
            <InputLabel variant="standard" htmlFor="brand-select" sx={{ pl: 3 }}>
              Департамент:
            </InputLabel>
            <Select
              onChange={e => getFormData(e)}
              required
              inputProps={{
                name: "brand_id",
                id: "brand-select",
              }}>
              <MenuItem value="" disabled>
                Выберите производителя
              </MenuItem>
              {brands.map(brand => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <TextField sx={{ p: 2 }} name="name" required value={formData.name} onChange={e => getFormData(e)} />
          </FormControl>
          <Box sx={{ p: 2 }}>
            <Button
              type="submit" // Указываем, что это кнопка отправки формы
              variant="contained"
              color="success"
              endIcon={<ThumbUpIcon />}
              disabled={reqStatus.loading} // Дизаблируем кнопку во время загрузки
            >
              {reqStatus.loading ? "Добавляем..." : "Добавить Цех"}
            </Button>
          </Box>
        </Box>
      </Loader>
    </Box>
  )
}
