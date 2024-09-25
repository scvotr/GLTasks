import { v4 as uuidv4 } from "uuid"
import { Box, Button, FormControl, Stack, TextField } from "@mui/material"
import { useMotorsParams } from "./useMotorsParams"
import { useState } from "react"
import CustomSelect from "./Form/CustomSelect"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"

export const CreateMotorForm = ({ onClose, isEdit }) => {
  const { electricalParams, mechanicalParams, protectionParams, technicalParams, motorModel, motorBrand } = useMotorsParams()
  const currentUser = useAuthContext()
  const [response, setResponse] = useState()

  const [formValues, setFormValues] = useState({
    motor_config_id: uuidv4(),
    motor_tech_num: "",

    power: "",
    voltage: "",
    amperage: "",
    efficiency: "",
    cosF: "",

    rotationSpeed: "",
    torque: "",
    temperature: "",
    operationMode: "",

    protectionLevel: "",
    explosionProof: "",
    brake: "",

    bearingType: "",
    mounting: "",

    brand: "",

    model: "",
  })
  // console.log("formValues:", formValues)
  console.log("formValues:", formValues)

  // Проверка, является ли motorModel.model массивом
  const filteredModels = Array.isArray(motorModel.model) ? motorModel.model.filter(model => model.brand_id === formValues.brand) : []

  // console.log("filteredModels", filteredModels)

  // Если нужно отсортировать по имени модели
  const sortedModels = filteredModels.sort((a, b) => a.model_name.localeCompare(b.model_name))

  // console.log("Отфильтрованные и отсортированные модели:", sortedModels)

  const handleChange = field => event => {
    console.log(field, event.target.value)
    setFormValues({
      ...formValues,
      [field]: event.target.value,
    })
  }

  const handleSubmit = async e => {
    console.log("AAAAAAAA", (isEdit = false))
    e.preventDefault()
    const endpoint = isEdit ? `/admin/devices/motor/config/update` : `/admin/devices/motor/config/create`
    try {
      // response({ loading: true })
      console.log(endpoint)
      await getDataFromEndpoint(currentUser.token, endpoint, "POST", formValues, setResponse)
      // isEdit ? popupSnackbar("Успешное Обновлено!", "success") : popupSnackbar("Успешное создано!", "success")
      // response(prev => ({ ...prev, loading: false }))
      onClose()
    } catch (error) {
      // isEdit ? popupSnackbar("Ошибка при обновлении!", "error") : popupSnackbar("Ошибка при создании!", "error")
    }
  }

  return (
    <Box sx={{ width: "100%", m: 2 }}>
      <Box
        component="form"
        sx={{
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          border: "1px solid #e0e0e0",
          borderRadius: "5px",
          "& .MuiTextField-root": { m: 1, width: "100%" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "stretch",
          p: 2,
        }}
        onSubmit={handleSubmit} // Добавляем обработчик на форме
      >
        <Stack direction="column" spacing={2}>
          <Stack direction="row" spacing={1}>
            <FormControl>
              <TextField
                label="Технический номер мотора" // Add a label for clarity
                value={formValues.motor_tech_num} // Bind the value to the state
                onChange={handleChange("motor_tech_num")} // Update the state on change
                placeholder="Введите технический номер"
                fullWidth
              />
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={1}>
            <CustomSelect
              label="Мощность"
              value={formValues.power}
              onChange={handleChange("power")}
              options={electricalParams.powerRanges || []}
              placeholder="Выберите кВт"
              id="power-select"
              units="кВт"
            />
            <CustomSelect
              label="Напряжение"
              value={formValues.voltage}
              onChange={handleChange("voltage")}
              options={electricalParams.voltage || []}
              placeholder="Выберите В"
              id="voltage-select"
              units="V"
            />
            <CustomSelect
              label="Ток"
              value={formValues.amperage}
              onChange={handleChange("amperage")}
              options={electricalParams.amperage || []}
              placeholder="Выберите В"
              id="amperage-select"
              units="A"
            />
            <CustomSelect
              label="КПД"
              value={formValues.efficiency}
              onChange={handleChange("efficiency")}
              options={electricalParams.efficiency || []}
              placeholder="Выберите В"
              id="efficiency-select"
              units="%"
            />
            <CustomSelect
              label="cos φ"
              value={formValues.cosF}
              onChange={handleChange("cosF")}
              options={electricalParams.cosF || []}
              placeholder="Выберите В"
              id="cosF-select"
              units="cos φ"
            />
          </Stack>
          {/* --------------------mechanicalParams-------------------- */}
          <Stack direction="row" spacing={1}>
            <CustomSelect
              label="Частота вращения"
              value={formValues.rotationSpeed}
              onChange={handleChange("rotationSpeed")}
              options={mechanicalParams.rotationSpeed || []}
              placeholder="Выберите В"
              id="rotationSpeed-select"
              units="об/мин"
            />
            <CustomSelect
              label="Нм"
              value={formValues.torque}
              onChange={handleChange("torque")}
              options={mechanicalParams.torque || []}
              placeholder="Выберите В"
              id="torque-select"
              units="Нм"
            />
            <CustomSelect
              label="t"
              value={formValues.temperature}
              onChange={handleChange("temperature")}
              options={mechanicalParams.temperature || []}
              placeholder="Выберите В"
              id="temperature-select"
              units="C"
            />
            <CustomSelect
              label="Режим"
              value={formValues.operationMode}
              onChange={handleChange("operationMode")}
              options={mechanicalParams.operationMode || []}
              placeholder="Выберите В"
              id="operationMode-select"
              units="S"
            />
          </Stack>
          {/* --------------------protectionParams-------------------- */}
          <Stack direction="row" spacing={1}>
            <CustomSelect
              label="IP"
              value={formValues.protectionLevel}
              onChange={handleChange("protectionLevel")}
              options={protectionParams.protectionLevel || []}
              placeholder="Выберите В"
              id="protectionLevel-select"
              units="IP"
            />
            <CustomSelect
              label="Ex"
              value={formValues.explosionProof}
              onChange={handleChange("explosionProof")}
              options={protectionParams.explosionProof || []}
              placeholder="Выберите В"
              id="explosionProof-select"
              units="Ex"
            />
            <CustomSelect
              label="тормоз"
              value={formValues.brake}
              onChange={handleChange("brake")}
              options={protectionParams.brake || []}
              placeholder="Выберите В"
              id="brake-select"
              units="Ed"
            />
          </Stack>
          {/* --------------------technicalParams-------------------- */}
          <Stack direction="row" spacing={1}>
            <CustomSelect
              label="Тип подшипника"
              value={formValues.bearingType}
              onChange={handleChange("bearingType")}
              options={technicalParams.bearingType || []}
              placeholder="Выберите В"
              id="bearingType-select"
              units=""
            />
            <CustomSelect
              label="Монтажное испл."
              value={formValues.mounting}
              onChange={handleChange("mounting")}
              options={technicalParams.mounting || []}
              placeholder="Выберите В"
              id="mounting-select"
              units="IM"
            />
          </Stack>
          {/* --------------------ModelsBrandsParams-------------------- */}
          <Stack direction="row" spacing={1}>
            <CustomSelect
              label="Производитель"
              value={formValues.brand}
              onChange={handleChange("brand")}
              options={motorBrand.brand || []}
              placeholder="Выберите В"
              id="brand-select"
              units=""
            />
            <CustomSelect
              label="Модель"
              value={formValues.model}
              onChange={handleChange("model")}
              options={filteredModels || []}
              placeholder="Выберите В"
              id="brand-select"
              units=""
            />
          </Stack>
        </Stack>
        <Box sx={{ p: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            endIcon={<ThumbUpIcon />}
            // disabled={reqStatus.loading} // отключаем кнопку во время загрузки
          >
            {/* {reqStatus.loading ? (isEdit ? "Редактируем..." : "Добавляем...") : isEdit ? "Редактировать" : "Добавить"} */}
            {isEdit ? "Редактировать" : "Добавить"}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
