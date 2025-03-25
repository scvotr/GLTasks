import { v4 as uuidv4 } from "uuid"
import React, { useState } from "react"
import { FormControl, InputLabel, Select, MenuItem, TextField, Grid, Typography, Box, Stack, Button, FormHelperText } from "@mui/material"
import { DepartmentSelectOnce } from "../Select/DepartmentSelect/DepartmentSelectOnce"
import { useSnackbar } from "../../../context/SnackbarProvider"
import { getDataFromEndpoint } from "../../../utils/getDataFromEndpoint"
import { Loader } from "../Loader/Loader"

const data = {
  Масличные: {
    Подсолнечник: {
      gost: "ГОСТ: 22391-2015",
      indicators: [
        "Влажность, %",
        "Сорная примесь, %",
        "Масличная примесь, %",
        "Масличность, %",
        "Кислотное число м/семян (кчм), мг КОН",
        "Испорченные, %",
        "Запах",
        "Цвет",
        "Зараженность",
      ],
    },
    Лён: {
      gost: "ГОСТ: 10582-76",
      indicators: [
        "Влажность, %",
        "Сорная примесь, %",
        "Масличная примесь, %",
        "Масличность, %",
        "Кислотное число м/семян (кчм), мг КОН",
        "Потемневшие, %",
        "Другие масличные культуры, %",
        "Запах",
        "Цвет",
        "Зараженность",
      ],
    },
    Соя: {
      gost: "ГОСТ: 17109-88",
      indicators: ["Влажность, %", "Сорная примесь, %", "Масличная примесь, %", "Поврежденные, %", "Проросшие, %", "Запах", "Цвет", "Зараженность"],
    },
    "Семена горчицы": {
      gost: "ГОСТ: 9159-71",
      indicators: ["Влажность, %", "Сорная примесь, %", "Масличная примесь, %", "Поврежденные, %", "Проросшие, %", "Запах", "Цвет", "Зараженность"],
    },
  },
  Зернобобовые: {
    Нут: {
      gost: "ГОСТ: 8758-76",
      indicators: [
        "Влажность, %",
        "Сорная примесь, %",
        "Зерновая примесь, %",
        "Маранные зерна, %",
        "Другие масличные культуры, %",
        "Крупность, %",
        "Запах",
        "Цвет",
        "Зараженность",
      ],
    },
    Чечевица: {
      gost: "ГОСТ: 7066-2019",
      indicators: ["Влажность, %", "Сорная примесь, %", "Зерновая примесь, %", "Запах", "Цвет", "Зараженность"],
    },
  },
  Злаковые: {
    Кукуруза: {
      gost: "ГОСТ: 13634-90",
      indicators: [
        "Влажность не более %",
        "Сорная примесь, %",
        "Зерновая примесь, %",
        "Другие культуры, %",
        "Испорченные, %",
        "Поврежденные, %",
        "Проросшие, %",
        "Запах",
        "Цвет",
        "Зараженность",
      ],
    },
    Пшеница: {
      gost: "ГОСТ: 9353-2016",
      types: {
        Твердая: {
          classes: ["3", "4", "5", "Безенчукская"],
          indicators: [
            "Влажность, не более %",
            "Сорная примесь, %",
            "Зерновая примесь, %",
            "Протеин, %",
            "Клейковина, %",
            "Качество Клейковины,ед",
            "Натура, г/л",
            "Число падения,с",
            "Стекловидность, %",
            "Проросшие, не более %",
            "Черный зародыш, %",
            "Минеральная примесь, %",
            "Мелкое зерно, %",
            "Клоп-черепашка, %",
            "Мягкая пшеница, %",
            "Запах",
            "Цвет",
            "Зараженность",
          ],
        },
        Мягкая: {
          classes: ["3", "4", "5", "Безенчукская"],
          indicators: [
            "Влажность, %",
            "Сорная примесь, %",
            "Зерновая примесь, %",
            "Протеин, %",
            "Клейковина, %",
            "Качество Клейковины,ед",
            "Натура, г/л",
            "Число падения,с",
            "Стекловидность, %",
            "Проросшие, %",
            "Черный зародыш, %",
            "Минеральная примесь, %",
            "Мелкое зерно, %",
            "Клоп-черепашка, %",
            "Запах",
            "Цвет",
            "Зараженность",
          ],
        },
      },
    },
    Рожь: {
      gost: "ГОСТ: 16990-2017",
      indicators: [
        "Влажность, %",
        "Сорная примесь, %",
        "Зерновая примесь, %",
        "Натура, г/л",
        "Число падения,с",
        "Проросшие, %",
        "Мелкое зерно, %",
        "Мягкая пшеница, %",
        "Запах",
        "Цвет",
        "Зараженность",
      ],
    },
  },
}

const options = {
  option1: "Агро №1",
  option2: "Агро №3",
  option3: "Агро №4",
  option4: "Агро №5",
  option5: "Агро №6",
}

const AddNewLabReq = ({ onClose, currentUser }) => {
  const { popupSnackbar } = useSnackbar()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [classification, setClassification] = useState("")
  const [culture, setCulture] = useState("")
  const [type, setType] = useState("")
  const [classType, setClassType] = useState("")
  const [indicators, setIndicators] = useState([])
  const [gost, setGost] = useState("")
  const [tonnage, setTonnage] = useState("")
  const [tonnagePermissible, setTonnagePermissible] = useState("")
  const [reqNum, setReqNum] = useState("")
  const [contractor, setContractor] = useState("")
  const [comment, setComment] = useState("")
  const [yearOfHarvest, setYearOfHarvest] = useState("")
  const [indicatorValues, setIndicatorValues] = useState({})
  const [salesPoint, setSalesPoint] = useState("")
  console.log("🚀 ~ AddNewLabReq ~ salesPoint:", salesPoint)
  const areFieldsSelected = Boolean(
    selectedDepartment && classification && culture && yearOfHarvest && tonnage && contractor && tonnagePermissible && reqNum && salesPoint
  )

  const handleClassificationChange = event => {
    const selectedClassification = event.target.value
    setClassification(selectedClassification)
    setCulture("")
    setType("")
    setClassType("")
    setIndicators([])
    setGost("")
    setIndicatorValues({})
  }

  const handleCultureChange = event => {
    const selectedCulture = event.target.value
    setCulture(selectedCulture)
    setType("")
    setClassType("")
    setIndicators(selectedCulture === "Пшеница" ? [] : data[classification][selectedCulture].indicators)
    setGost(data[classification][selectedCulture].gost)
    setIndicatorValues({})
  }

  const handleTypeChange = event => {
    const selectedType = event.target.value
    setType(selectedType)
    setIndicators(data[classification][culture].types[selectedType].indicators)
    setIndicatorValues({})
  }

  const handleClassChange = event => {
    setClassType(event.target.value)
  }

  const handleIndicatorChange = (indicator, value) => {
    setIndicatorValues(prevValues => ({
      ...prevValues,
      [indicator]: value,
    }))
  }

  const createRequest = async status => {
    try {
      const formData = {
        reqForAvail_id: uuidv4(),
        yearOfHarvest,
        tonnage,
        contractor,
        selectedDepartment: selectedDepartment?.id,
        creator: currentUser.id,
        user_id: currentUser.id, //Для уведомления через сокет
        creator_role: currentUser.role,
        creator_subDep: currentUser.subDep,
        position_id: currentUser.position,
        approved: false,
        req_status: status, // Устанавливаем статус на основе параметра
        comment,
        classification,
        culture,
        type,
        classType,
        gost,
        tonnagePermissible,
        reqNum,
        salesPoint,
        indicators: indicators.map(indicator => ({
          name: indicator,
          value: indicatorValues[indicator] || "",
        })),
      }
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, "/lab/createReqForAvailability", "POST", formData, setReqStatus)
      setReqStatus({ loading: false, error: null })
      popupSnackbar("Создан запрос!", "success")
      onClose()
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Ошибка при создании запроса."
      popupSnackbar(errorMessage, "error")
      setReqStatus({ loading: false, error })
    } finally {
      setReqStatus({ loading: false, error: null })
    }
  }

  // Обработчик для кнопки "Создать запрос"
  const handleCreateRequest = () => {
    createRequest("new") // Устанавливаем статус "new"
  }

  // Обработчик для кнопки "Сохранить в черновик"
  const handleSaveDraft = () => {
    createRequest("draft") // Устанавливаем статус "draft"
  }

  const handleSalesPointChange = event => {
    setSalesPoint(event.target.value)
  }

  return (
    <Box component="form" sx={{ m: 5 }}>
      <Loader reqStatus={reqStatus}>
        <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
          <DepartmentSelectOnce selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment} />

          {/* ----------------------------- */}
          <FormControl fullWidth>
            <InputLabel id="select-label">Продавец</InputLabel>
            <Select
              label="select-label"
              value={salesPoint}
              onChange={handleSalesPointChange}
              required // Обязательное поле
              error={!salesPoint} // Показываем ошибку, если поле пустое
            >
              {Object.entries(options).map(([key, label]) => (
                <MenuItem key={key} value={label}>
                  {label}
                </MenuItem>
              ))}
            </Select>
            {!salesPoint && <FormHelperText style={{ position: "absolute", bottom: "-20px", left: "0" }}>Обязательное поле</FormHelperText>}
          </FormControl>
          {/* ----------------------------- */}

          <FormControl fullWidth>
            <InputLabel>Классификация</InputLabel>
            <Select label="Классификация" value={classification} onChange={handleClassificationChange} required>
              {Object.keys(data).map(key => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Культура</InputLabel>
            <Select label="Культура" value={culture} onChange={handleCultureChange} disabled={!classification} required>
              {classification &&
                Object.keys(data[classification]).map(key => (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {culture === "Пшеница" && (
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel>Тип пшеницы</InputLabel>
              <Select label="Тип пшеницы" value={type} onChange={handleTypeChange} disabled={!culture} required>
                {Object.keys(data[classification][culture].types).map(key => (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Stack>
        {type && (
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Класс</InputLabel>
            <Select label="Класс" value={classType} onChange={handleClassChange} disabled={!type} required>
              {data[classification][culture].types[type].classes.map(classOption => (
                <MenuItem key={classOption} value={classOption}>
                  {classOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {gost && (
          <Stack direction="row" spacing={3} justifyContent="center" alignItems="center" sx={{ mb: 2, mt: 2 }}>
            <Typography variant="subtitle1">{`ГОСТ: ${gost}`}</Typography>
          </Stack>
        )}

        {indicators.length > 0 && (
          <Grid container spacing={1}>
            {indicators.map(indicator => (
              <Grid item xs={3} key={indicator}>
                <TextField
                  label={indicator}
                  variant="outlined"
                  fullWidth
                  value={indicatorValues[indicator] || ""} // Получаем значение из состояния
                  onChange={e => handleIndicatorChange(indicator, e.target.value)} // Обновляем значение
                />
              </Grid>
            ))}
            <Grid container spacing={1} sx={{ m: 0 }}>
              <Grid item xs={4}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Номер запроса"
                    variant="outlined"
                    margin="normal"
                    type="text"
                    value={reqNum}
                    onChange={e => setReqNum(e.target.value)}
                    required // Обязательное поле
                    error={!reqNum} // Показываем ошибку, если поле пустое
                    helperText={!reqNum ? "Обязательное поле" : ""}
                  />
                  <TextField
                    label="Год урожая"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="number"
                    value={yearOfHarvest}
                    onChange={e => setYearOfHarvest(e.target.value)}
                    required // Обязательное поле
                    error={!yearOfHarvest} // Показываем ошибку, если поле пустое
                    helperText={!yearOfHarvest ? "Обязательное поле" : ""}
                  />
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Тоннаж"
                    variant="outlined"
                    // fullWidth
                    margin="normal"
                    type="number"
                    value={tonnage}
                    onChange={e => setTonnage(e.target.value)}
                    required // Обязательное поле
                    error={!tonnage} // Показываем ошибку, если поле пустое
                    helperText={!tonnage ? "Обязательное поле" : ""}
                  />
                  <TextField
                    label="+\-"
                    variant="outlined"
                    margin="normal"
                    type="number"
                    value={tonnagePermissible}
                    onChange={e => setTonnagePermissible(e.target.value)}
                    required // Обязательное поле
                    error={!tonnagePermissible} // Показываем ошибку, если поле пустое
                    helperText={!tonnagePermissible ? "Обязательное поле" : ""}
                  />
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Контрагент"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={contractor}
                    onChange={e => setContractor(e.target.value)}
                    required // Обязательное поле
                    error={!contractor} // Показываем ошибку, если поле пустое
                    helperText={!contractor ? "Обязательное поле" : ""}
                  />
                </Stack>
              </Grid>
            </Grid>
            <Grid container spacing={1} sx={{ justifyContent: "center", m: 0 }}>
              <Grid item xs={12}>
                <TextField label="Примечание" variant="outlined" fullWidth type="text" value={comment} onChange={e => setComment(e.target.value)} />
              </Grid>
            </Grid>
          </Grid>
        )}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          {/* Кнопка "Создать запрос" */}

          <Button onClick={handleCreateRequest} variant="contained" color="primary" disabled={!areFieldsSelected}>
            Создать запрос
          </Button>

          {/* Кнопка "Сохранить в черновик" */}
          <Button onClick={handleSaveDraft} variant="contained" color="secondary" disabled={!areFieldsSelected}>
            Сохранить в черновик
          </Button>

          {/* Кнопка "Закрыть" */}
          <Button onClick={onClose} variant="outlined" color="error">
            Закрыть
          </Button>
        </Stack>
      </Loader>
    </Box>
  )
}

export default AddNewLabReq
