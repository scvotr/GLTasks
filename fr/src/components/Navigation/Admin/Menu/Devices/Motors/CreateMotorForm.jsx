import { v4 as uuidv4 } from "uuid"
import { Box, Stack } from "@mui/material"
import { useMotorsParams } from "./useMotorsParams"
import { useState } from "react"
import CustomSelect from "./Form/CustomSelect"

export const CreateMotorForm = ({ onClose }) => {
  const { electricalParams, mechanicalParams, protectionParams, technicalParams, motorModel, motorBrand } = useMotorsParams()

  console.log("model", motorModel.model)
  console.log("brand", motorBrand.brand)

  const [formValues, setFormValues] = useState({
    id: uuidv4(),

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

  console.log('filteredModels', filteredModels)

  // Если нужно отсортировать по имени модели
  const sortedModels = filteredModels.sort((a, b) => a.model_name.localeCompare(b.model_name))

  console.log("Отфильтрованные и отсортированные модели:", sortedModels)


  const handleChange = field => event => {
    console.log(field, event.target.value)
    setFormValues({
      ...formValues,
      [field]: event.target.value,
    })
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="column" spacing={2}>
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
    </Box>
  )
}
