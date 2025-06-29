import { v4 as uuidv4 } from "uuid"
import React, { useEffect, useState } from "react"
import { FormControl, InputLabel, Select, MenuItem, TextField, Grid, Typography, Box, Stack, Button, FormHelperText, Fab, Autocomplete } from "@mui/material"
import { DepartmentSelectOnce } from "../Select/DepartmentSelect/DepartmentSelectOnce"
import { useSnackbar } from "../../../context/SnackbarProvider"
import { getDataFromEndpoint } from "../../../utils/getDataFromEndpoint"
import { Loader } from "../Loader/Loader"
import AddIcon from "@mui/icons-material/Add"
import { ModalCustom } from "../../ModalCustom/ModalCustom"
import { AddContractor } from "./AddContractor"

const defaultOption = ["Запах", "Цвет", "Зараженность"]

const data = {
  Масличные: {
    Подсолнечник: {
      gost: "ГОСТ: 22391-2015",
      indicators: ["Влажность, %", "Сорная примесь, %", "Масличная примесь, %", "Масличность, %", "Кислотное число м/семян (кчм), мг КОН", "Испорченные, %"],
      defaultOptionIndicators: [...defaultOption],
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
      ],
      defaultOptionIndicators: [...defaultOption],
    },
    Соя: {
      gost: "ГОСТ: 17109-88",
      indicators: ["Влажность, %", "Сорная примесь, %", "Масличная примесь, %", "Поврежденные, %", "Проросшие, %"],
      defaultOptionIndicators: [...defaultOption],
    },
    "Семена горчицы": {
      gost: "ГОСТ: 9159-71",
      indicators: ["Влажность, %", "Сорная примесь, %", "Масличная примесь, %", "Поврежденные, %", "Проросшие, %"],
      defaultOptionIndicators: [...defaultOption],
    },
  },
  Зернобобовые: {
    Нут: {
      gost: "ГОСТ: 8758-76",
      indicators: ["Влажность, %", "Сорная примесь, %", "Зерновая примесь, %", "Маранные зерна, %", "Другие масличные культуры, %", "Крупность, %"],
      defaultOptionIndicators: [...defaultOption],
    },
    Чечевица: {
      gost: "ГОСТ: 7066-2019",
      indicators: ["Влажность, %", "Сорная примесь, %", "Зерновая примесь, %"],
      defaultOptionIndicators: [...defaultOption],
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
      ],
      defaultOptionIndicators: [...defaultOption],
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
          ],
          defaultOptionIndicators: [...defaultOption],
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
          ],
          defaultOptionIndicators: [...defaultOption],
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
      ],
      defaultOptionIndicators: [...defaultOption],
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

const basis_ETOS = {
  option1: "FCA",
  option2: "EXW",
  option3: "CPT",
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
  const [defaultOptionIndicators, setDefaultOptionIndicators] = useState([])
  const [gost, setGost] = useState("")
  const [tonnage, setTonnage] = useState("")
  const [tonnagePermissible, setTonnagePermissible] = useState("")
  const [reqNum, setReqNum] = useState("")
  const [contractor, setContractor] = useState("")
  const [contractorFK, setContractorFK] = useState("")
  const [currentContractorFK, setCurrentContractorFK] = useState("")
  const [comment, setComment] = useState("")
  const [yearOfHarvest, setYearOfHarvest] = useState("")
  const [indicatorValues, setIndicatorValues] = useState({})
  const [defaultIndicatorValues, setDefaultIndicatorValues] = useState({})
  const [salesPoint, setSalesPoint] = useState("")
  const [basis, setBasis] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const areFieldsSelected = Boolean(
    selectedDepartment &&
      classification &&
      culture &&
      yearOfHarvest &&
      tonnage &&
      // contractor &&
      tonnagePermissible &&
      reqNum &&
      salesPoint &&
      basis &&
      currentContractorFK
  )
  const openModal = () => {
    setModalOpen(true)
  }
  const handleClassificationChange = event => {
    const selectedClassification = event.target.value
    setClassification(selectedClassification)
    setCulture("")
    setType("")
    setClassType("")
    setIndicators([])
    setDefaultOptionIndicators([])
    setGost("")
    setIndicatorValues({})
  }
  const handleCultureChange = event => {
    const selectedCulture = event.target.value
    setCulture(selectedCulture)
    setType("")
    setClassType("")
    setIndicators(selectedCulture === "Пшеница" ? [] : data[classification][selectedCulture].indicators)
    setDefaultOptionIndicators(data[classification][selectedCulture].defaultOptionIndicators)
    setGost(data[classification][selectedCulture].gost)
    setIndicatorValues({})
  }
  const handleTypeChange = event => {
    const selectedType = event.target.value
    setType(selectedType)
    setIndicators(data[classification][culture].types[selectedType].indicators)
    setDefaultOptionIndicators(data[classification][culture].types[selectedType].defaultOptionIndicators)
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
  const handleDefaultOptionIndicatorsChange = (indicator, value) => {
    setDefaultIndicatorValues(prevValues => ({
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
        contractor: currentContractorFK.name,
        selectedDepartment: selectedDepartment?.id,
        selectedDepartment_name: selectedDepartment?.name, //Для уведомления через сокет
        creator: currentUser.id,
        user_id: currentUser.id, //Для уведомления через сокет
        creator_role: currentUser.role,
        creator_subDep: currentUser.subDep,
        position_id: currentUser.position,
        approved: false,
        req_status: status, // Устанавливаем статус на основе параметра
        comment,
        classification, //! ????
        culture,
        type,
        classType,
        gost,
        tonnagePermissible,
        reqNum,
        salesPoint,
        basis,
        contractor_id: currentContractorFK.id,
        indicators: [
          ...indicators.map(indicator => ({
            name: indicator,
            value: indicatorValues[indicator] || "",
          })),
          ...defaultOptionIndicators.map(indicator => ({
            name: indicator,
            value: defaultIndicatorValues[indicator] || "",
          })),
        ],
        // indicators: indicators.map(indicator => ({
        //   name: indicator,
        //   value: indicatorValues[indicator] || "",
        // })),
        // defaultOptionIndicators: defaultOptionIndicators.map(indicator => ({
        //   name: indicator,
        //   value: defaultIndicatorValues[indicator] || "",
        // })),
      }
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, "/lab/createReqForAvailability", "POST", formData, setReqStatus)
      setReqStatus({ loading: false, error: null })
      popupSnackbar("Создан запрос!", "success")
      onClose()
    } catch (error) {
      const errorMessage = error.message || "Ошибка при создании запроса."
      popupSnackbar(errorMessage, "error")
      setReqNum("")
      setReqStatus({ loading: false, error })
    } finally {
      setReqStatus({ loading: false, error: null })
    }
  }
  const handleCreateRequest = async () => {
    await createRequest("new")
  }
  const handleSaveDraft = async () => {
    await createRequest("draft")
  }
  const handleSalesPointChange = event => {
    setSalesPoint(event.target.value)
  }
  const handleBasisChange = event => {
    setBasis(event.target.value)
  }
  // ! ------------------------------------------------------
  const getAllContractors = async (currentUser, setReqStatus, setContractorFK) => {
    const endpoint = `/lab/getContractors`
    try {
      setReqStatus({ loading: true, error: null })
      const data = await getDataFromEndpoint(currentUser.token, endpoint, "POST", currentUser.id, setReqStatus)
      setContractorFK(data)
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        await getAllContractors(currentUser, setReqStatus, setContractorFK)
      }
    }
    fetchData()
  }, [currentUser, formKey])
  const closeModal = () => {
    setModalOpen(false)
    setFormKey(prevKey => prevKey + 1)
  }
  // ! ------------------------------------------------------
  return (
    <>
      <ModalCustom isOpen={modalOpen} onClose={closeModal}>
        <AddContractor currentUser={currentUser} onClose={closeModal} popupSnackbar={popupSnackbar} />
      </ModalCustom>
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
            {/* --------------- */}
            <FormControl fullWidth>
              <InputLabel id="select-label">Контракт</InputLabel>
              <Select
                label="select-label"
                value={basis}
                onChange={handleBasisChange}
                required // Обязательное поле
                error={!basis} // Показываем ошибку, если поле пустое
              >
                {Object.entries(basis_ETOS).map(([key, label]) => (
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
              <Typography variant="subtitle1">{`${gost}`}</Typography>
            </Stack>
          )}

          {indicators.length > 0 && (
            <Grid container spacing={1}>
              {indicators.map(indicator => (
                <Grid item xs={3} key={indicator}>
                  <TextField
                    label={indicator}
                    variant="outlined"
                    type={"number"}
                    fullWidth
                    value={indicatorValues[indicator] || ""} // Получаем значение из состояния
                    onChange={e => {
                      const newValue = e.target.value
                      // .replace(/,/g, ".") // Заменяем запятые на точки
                      // .replace(/[^0-9.]/g, "") // Удаляем все символы, кроме цифр и точки
                      // .replace(/(\..*?)\..*/g, "$1") // Удаляем лишние точки, если они есть
                      handleIndicatorChange(indicator, newValue) // Обновляем значение
                    }}
                  />
                </Grid>
              ))}
              {defaultOptionIndicators.map(indicator => (
                <Grid item xs={3} key={indicator}>
                  <TextField
                    label={indicator}
                    variant="outlined"
                    fullWidth
                    type="text"
                    value={defaultIndicatorValues[indicator] || ""} // Получаем значение из состояния
                    onChange={e => {
                      const newValue = e.target.value.replace(/[^а-яА-ЯёЁa-zA-Z]/g, "") // Оставляем только буквы
                      handleDefaultOptionIndicatorsChange(indicator, newValue) // Обновляем значение
                    }}
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
                      label="+\- %"
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
                    {/* <TextField
                      label="Контрагент"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={contractor}
                      onChange={e => setContractor(e.target.value)}
                      required // Обязательное поле
                      error={!contractor} // Показываем ошибку, если поле пустое
                      helperText={!contractor ? "Обязательное поле" : ""}
                    /> */}
                    {/*  */}
                    <Autocomplete
                      disablePortal
                      options={contractorFK}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        setCurrentContractorFK(value)
                      }}
                      sx={{ width: 300 }}
                      renderInput={params => (
                        <TextField {...params} label="Контрагент" error={!currentContractorFK} helperText={!currentContractorFK ? "Обязательное поле" : ""} />
                      )}
                    />

                    <Fab color="secondary" aria-label="add" onClick={openModal}>
                      <AddIcon />
                    </Fab>
                    {/*  */}
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
    </>
  )
}

export default AddNewLabReq
