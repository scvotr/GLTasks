import React, { useEffect, useState } from "react"
import { DepartmentSelectOnce } from "../Select/DepartmentSelect/DepartmentSelectOnce"
import { useSnackbar } from "../../../context/SnackbarProvider"
import { getDataFromEndpoint } from "../../../utils/getDataFromEndpoint"
import { Loader } from "../Loader/Loader"

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material"

const data = {
  Масличные: {
    Подсолнечник: {
      gost: "ГОСТ 22391-2015",
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
      gost: "ГОСТ 10582-76",
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
      gost: "ГОСТ 17109-88",
      indicators: ["Влажность, %", "Сорная примесь, %", "Масличная примесь, %", "Поврежденные, %", "Проросшие, %", "Запах", "Цвет", "Зараженность"],
    },
    "Семена горчицы": {
      gost: "ГОСТ 9159-71",
      indicators: ["Влажность, %", "Сорная примесь, %", "Масличная примесь, %", "Поврежденные, %", "Проросшие, %", "Запах", "Цвет", "Зараженность"],
    },
  },
  Зернобобовые: {
    Нут: {
      gost: "ГОСТ 8758-76",
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
      gost: "ГОСТ 7066-2019",
      indicators: ["Влажность, %", "Сорная примесь, %", "Зерновая примесь, %", "Запах", "Цвет", "Зараженность"],
    },
  },
  Злаковые: {
    Кукуруза: {
      gost: "ГОСТ 13634-90",
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
      gost: "ГОСТ 9353-2016",
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
      gost: "ГОСТ 16990-2017",
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

export const AddReportLabReq = ({ onClose, currentUser, request }) => {
  const { popupSnackbar } = useSnackbar()
  // console.log("🚀 ~ AddReportLabReq ~ request:", request)

  // console.log((parseFloat(14).toFixed(2) - parseFloat(13.28).toFixed(2)).toFixed(2))
  // console.log((13.28 - 14).toFixed(2))

  const [indicators, setIndicators] = useState([])
  const [newValues, setNewValues] = useState({})
  const [comment, setComment] = useState("") // Для комментария
  const [subSorting, setSubSorting] = useState("") // Для подсортировки
  const [totalTonnage, setTotalTonnage] = useState("")
  const [aspirationDust, setAspirationDust] = useState("")
  const [naturalLoss, setNaturalLoss] = useState("")
  const [destinationPoint, setDestinationPoint] = useState("")
  const [transportType, setTransportType] = useState("auto") // По умолчанию выбран "Авто"
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  const handleChangeStatus = async status => {
    const endpoint = `/lab/updateReqStatus`
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(
        currentUser.token,
        endpoint,
        "POST",
        { reqForAvail_id: request.reqForAvail_id, user_id: currentUser.id, req_status: status, currentRequest: request },
        setReqStatus
      )
      setReqStatus({ loading: false, error: null })
      popupSnackbar("Отчет сформирован!", "success")
      onClose() // Закрывает все открытые окна. Переделать что бы возвращал на окно с запросом. Нужно обновлять родительский компонент
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Ошибка при создании запроса."
      popupSnackbar(errorMessage, "error")
      setReqStatus({ loading: false, error })
    } finally {
      setReqStatus({ loading: false, error: null })
    }
  }

  const handleCreateReport = async data => {
    const endpoint = `/lab/addReport`
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, endpoint, "POST", data, setReqStatus)
      setReqStatus({ loading: false, error: null })
      popupSnackbar("Отчет сформирован!", "success")
      onClose() // Закрывает все открытые окна. Переделать что бы возвращал на окно с запросом. Нужно обновлять родительский компонент
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Ошибка при создании отчета."
      popupSnackbar(errorMessage, "error")
      setReqStatus({ loading: false, error })
    } finally {
      setReqStatus({ loading: false, error: null })
    }
  }

  useEffect(() => {
    if (request.indicators) {
      try {
        const parsedIndicators = JSON.parse(request.indicators)
        // Исключаем элементы с именами "Запах", "Цвет", "Зараженность"
        const filteredData = parsedIndicators.filter(item => !["Запах", "Цвет", "Зараженность"].includes(item.name))
        // Устанавливаем индикаторы и инициализируем значения
        const initialIndicatorValues = filteredData.map(indicator => ({
          ...indicator,
          oldValue: indicator.value || "", // Переименовываем value в oldValue
          newValue: "", // Инициализируем новое значение
          deviation: 0, // Инициализируем отклонение
        }))
        setIndicators(initialIndicatorValues)
      } catch (error) {
        console.error("Ошибка при разборе индикаторов:", error)
      }
    }
  }, [request.indicators])

  // Обработчик изменения значения текстового поля
  const handleChange = (index, event) => {
    const { value } = event.target
    const newValue = parseFloat(value) || 0 // Преобразуем новое значение в число

    setNewValues(prevValues => ({
      ...prevValues,
      [index]: newValue, // Сохраняем новое значение по индексу
    }))

    // Обновляем отклонение для текущего индикатора
    setIndicators(prevIndicators => {
      const updatedIndicators = [...prevIndicators]
      const oldValue = prevIndicators[index].oldValue
      // Расчет отклонений
      const percentDeviation = oldValue === 0 ? 0 : ((newValue - oldValue) / oldValue) * 100
      const absoluteDeviation = oldValue === 0 ? 0 : newValue - oldValue
      updatedIndicators[index] = {
        ...updatedIndicators[index],
        newValue,
        percentDeviation: isNaN(percentDeviation) ? 0 : percentDeviation.toFixed(2), // Отклонение в процентах
        absoluteDeviation: isNaN(absoluteDeviation) ? 0 : absoluteDeviation.toFixed(2), // Абсолютное отклонение
      }
      return updatedIndicators
    })
  }

  const handleSubmit = async () => {
    const updatedIndicators = indicators.map((indicator, index) => {
      const newValue = newValues[index] !== undefined ? newValues[index] : indicator.oldValue
      const deviation = ((newValue - indicator.oldValue) / indicator.oldValue) * 100 // Расчет отклонения в процентах

      return {
        ...indicator,
        newValue,
        deviation: isNaN(deviation) ? 0 : deviation.toFixed(2), // Отклонение, округленное до двух знаков после запятой
      }
    })
    console.log("🚀 ~ updatedIndicators ~ updatedIndicators:", updatedIndicators)
    // Здесь вы можете отправить updatedIndicators на сервер или выполнить другие действия
    try {
      // handleChangeStatus("closed")
      await handleChangeStatus("closed")

      const formData = {
        reqForAvail_id: request.reqForAvail_id,
        user_id: currentUser.id, //Для уведомления через сокет
        // JSON.stringify(data.indicators), //! Сохраняем индикаторы как JSON на сервере
        indicators: updatedIndicators.map(indicator => ({
          name: indicator.name, // Используем имя индикатора
          oldValue: indicator.value || "", // Переименовываем value в oldValue
          newValue: indicator.newValue || "", // Используем новое значение
          absoluteDeviation: indicator.absoluteDeviation || "0.00", // Абсолютное отклонение
          percentDeviation: indicator.percentDeviation || "0.00", // Процентное отклонение
        })),
        comment, // Добавляем комментарий к formData
        subSorting, // Добавляем подсортировку к formData
        totalTonnage,
        aspirationDust,
        naturalLoss,
        destinationPoint,
        transportType,
      }
       await handleCreateReport(formData)
    } catch (error) {}
  }

  const handleCommentChange = event => {
    setComment(event.target.value)
  }
  const handleSubSortingChange = event => {
    setSubSorting(event.target.value)
  }
  const handleTotalTonnageChange = event => {
    setTotalTonnage(event.target.value)
  }
  const handleAspirationDustChange = event => {
    setAspirationDust(event.target.value)
  }
  const handlesNaturalLossChange = event => {
    setNaturalLoss(event.target.value)
  }
  const handlesDestinationPointChange = event => {
    setDestinationPoint(event.target.value)
  }
  // Обработчик изменения типа транспорта
  const handleTransportChange = event => {
    setTransportType(event.target.value) // Обновляем состояние при выборе
  }

  return (
    <Loader reqStatus={reqStatus}>
      <Box component="form">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Сформировать отчет
          </Button>
        </Box>
        {/* ------------------------------------- */}
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2, mt: 2 }}>
          <Typography variant="h6">Отчет о выполнении контракта:</Typography>
          <Typography variant="body2">{`От: ${request.department_name}`}</Typography>
          <Typography variant="body2">{`Культура: ${request.culture}`}</Typography>
          <Typography variant="body2">{`Потребитель: ${request.contractor}`}</Typography>
          <Typography variant="body2">{`Партия: ${request.tonnage} т.`}</Typography>
        </Stack>
        {/* ------------------------------------- */}
        <Box component="div" sx={{ width: "100%", maxWidth: "95%", mx: "auto" }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Grid container spacing={1} component={Paper}>
                <Grid item xs={12}>
                  <ActualLabReqValue indicators={indicators} newValues={newValues} handleChange={handleChange} />
                </Grid>
              </Grid>
            </Grid>
            {/* sx={{ border: "1px solid #ccc", borderRadius: "4px", padding: "5px" }} */}
            <Grid item xs={6}>
              <Grid container spacing={2} direction="column" component={Paper}>
                <Grid item xs={12}>
                  <OtherLabReqValue
                    totalTonnage={totalTonnage}
                    handleTotalTonnageChange={handleTotalTonnageChange}
                    aspirationDust={aspirationDust}
                    handleAspirationDustChange={handleAspirationDustChange}
                    naturalLoss={naturalLoss}
                    handlesNaturalLossChange={handlesNaturalLossChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextLabReqValue
                    destinationPoint={destinationPoint}
                    handlesDestinationPointChange={handlesDestinationPointChange}
                    comment={comment}
                    handleCommentChange={handleCommentChange}
                    subSorting={subSorting}
                    handleSubSortingChange={handleSubSortingChange}
                    transportType={transportType}
                    handleTransportChange={handleTransportChange}
                  />
                </Grid>
                <Grid item xs={12}></Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Loader>
  )
}
// ----------------------------------
export const ActualLabReqValue = ({ indicators, newValues, handleChange }) => {
  return (
    <>
      <TableContainer component={Paper} sx={{ width: "90%", m: 2 }}>
        <Table sx={{ borderCollapse: "collapse" }}>
          {/* Заголовок таблицы */}
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ border: "1px solid black", padding: "4px" }}>
                Качество по контракту
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black", padding: "4px" }}>
                знач.
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black", padding: "4px" }}>
                Фактическое <br></br>средневзвешенное
              </TableCell>
              <TableCell align="center" colSpan={2} sx={{ border: "1px solid black", padding: "4px" }}>
                Отклонение
              </TableCell>
            </TableRow>
          </TableHead>
          {/* Тело таблицы */}
          <TableBody>
            {indicators.map((indicator, index) => (
              <TableRow key={index}>
                {/* Название индикатора */}
                <TableCell component="th" scope="row" align="center" sx={{ border: "1px solid black", padding: "4px" }}>
                  <Typography variant="body2" sx={{ fontSize: "0.875rem", textAlign: "center" }}>
                    {indicator.name}
                  </Typography>
                </TableCell>
                {/* Текущее значение */}
                <TableCell
                  align="center"
                  sx={{
                    width: "50px",
                    border: "1px solid black",
                    padding: "4px",
                  }}>
                  <Typography variant="body1">{indicator.oldValue || "-"}</Typography>
                </TableCell>

                {/* Поле ввода нового значения */}
                <TableCell align="center" sx={{ border: "1px solid black", padding: "4px" }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    // type={["color", "smell", "contamination"].includes(indicator.type) ? "text" : "number"} // Устанавливаем тип поля
                    type={"number"} // Устанавливаем тип поля
                    value={newValues[index] || ""} // Используем новое значение, если оно есть
                    onChange={event => handleChange(index, event)}
                    placeholder="+"
                    sx={{
                      width: "100px",
                      "& .MuiInputBase-input": {
                        padding: "2px", // Уменьшение отступов внутри поля
                        textAlign: "center", // Выравнивание текста по центру
                      },
                    }}
                  />
                </TableCell>
                {/* Отклонение */}
                <TableCell align="center" sx={{ width: "60px", border: "1px solid black", padding: "4px" }}>
                  <Typography variant="body2" sx={{ fontSize: "0.875rem", textAlign: "center" }}>{`${indicator.absoluteDeviation || 0}`}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ width: "60px", border: "1px solid black", padding: "4px" }}>
                  <Typography variant="body2" sx={{ fontSize: "0.875rem", textAlign: "center" }}>{`${indicator.percentDeviation || 0}%`}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export const OtherLabReqValue = ({
  totalTonnage,
  handleTotalTonnageChange,
  aspirationDust,
  handleAspirationDustChange,
  naturalLoss,
  handlesNaturalLossChange,
}) => {
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ border: "1px solid black", padding: "4px" }}>
                Всего отгружено т. :
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black", padding: "4px" }}>
                АП т. :
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black", padding: "4px" }}>
                ЕУ т. :
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableCell align="center" sx={{ border: "1px solid black", padding: "4px" }}>
              <TextField
                variant="outlined"
                size="small"
                type={"number"} // Устанавливаем тип поля
                placeholder="+"
                value={totalTonnage}
                onChange={handleTotalTonnageChange}
                sx={{
                  width: "100px",
                  "& .MuiInputBase-input": {
                    padding: "2px", // Уменьшение отступов внутри поля
                    textAlign: "center", // Выравнивание текста по центру
                  },
                }}
              />
            </TableCell>
            <TableCell align="center" sx={{ border: "1px solid black", padding: "4px" }}>
              <TextField
                variant="outlined"
                size="small"
                type={"number"} // Устанавливаем тип поля
                placeholder="+"
                value={aspirationDust}
                onChange={handleAspirationDustChange}
                sx={{
                  width: "100px",
                  "& .MuiInputBase-input": {
                    padding: "2px", // Уменьшение отступов внутри поля
                    textAlign: "center", // Выравнивание текста по центру
                  },
                }}
              />
            </TableCell>
            <TableCell align="center" sx={{ border: "1px solid black", padding: "4px" }}>
              <TextField
                variant="outlined"
                size="small"
                type={"number"} // Устанавливаем тип поля
                placeholder="+"
                value={naturalLoss}
                onChange={handlesNaturalLossChange}
                sx={{
                  width: "100px",
                  "& .MuiInputBase-input": {
                    padding: "2px", // Уменьшение отступов внутри поля
                    textAlign: "center", // Выравнивание текста по центру
                  },
                }}
              />
            </TableCell>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export const TextLabReqValue = ({
  destinationPoint,
  handlesDestinationPointChange,
  comment,
  handleCommentChange,
  subSorting,
  handleSubSortingChange,
  transportType,
  handleTransportChange,
}) => {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", m: 2 }} component={Paper}>
        <Stack direction={"column"} spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2, mt: 2 }}>
          <Typography variant="body2" sx={{ fontSize: "0.875rem", textAlign: "center" }}>
            Отгружено:
          </Typography>
          <Box>
            {/* Группа радиокнопок для выбора типа транспорта */}
            <RadioGroup
              row // Размещаем кнопки в одну строку
              value={transportType} // Текущее значение
              onChange={handleTransportChange} // Обработчик изменения
              sx={{ justifyContent: "center" }}>
              <FormControlLabel value="auto" control={<Radio />} label="Авто" sx={{ fontSize: "0.875rem" }} />
              <FormControlLabel value="railway" control={<Radio />} label="Железная дорога" sx={{ fontSize: "0.875rem" }} />
            </RadioGroup>

            {/* Отображение текста "Пункт назначения:" */}
          </Box>
          <Typography variant="body2" sx={{ fontSize: "0.875rem", textAlign: "center" }}>
            Пункт назначения:
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            type="text" // Устанавливаем тип поля
            placeholder="Введите пункт назначения..."
            value={destinationPoint}
            onChange={handlesDestinationPointChange}
            sx={{
              width: "700px",
              "& .MuiInputBase-input": {
                padding: "2px", // Уменьшение отступов внутри поля
                textAlign: "left", // Выравнивание текста по центру
              },
            }}
          />
          <Typography variant="body2" sx={{ fontSize: "0.875rem", textAlign: "center" }}>
            Комментарий к отчету:
          </Typography>

          <TextField
            variant="outlined"
            size="small"
            type="text" // Устанавливаем тип поля
            placeholder="Введите комментарий..."
            multiline // Делаем поле многострочным
            rows={5} // Устанавливаем количество строк
            value={comment}
            onChange={handleCommentChange}
            sx={{
              width: "700px",
              "& .MuiInputBase-input": {
                padding: "2px", // Уменьшение отступов внутри поля
                textAlign: "left", // Выравнивание текста по центру
              },
            }}
          />
          <Typography variant="body2" sx={{ fontSize: "0.875rem", textAlign: "center" }}>
            Подсортировка:
          </Typography>

          <TextField
            variant="outlined"
            size="small"
            type="text" // Устанавливаем тип поля
            placeholder="Введите комментарий..."
            multiline // Делаем поле многострочным
            rows={2} // Устанавливаем количество строк
            value={subSorting}
            onChange={handleSubSortingChange}
            sx={{
              width: "700px",
              "& .MuiInputBase-input": {
                padding: "2px", // Уменьшение отступов внутри поля
                textAlign: "left", // Выравнивание текста по центру
              },
            }}
          />
        </Stack>
      </Box>
    </>
  )
}

// return (
//   <Box component="form" sx={{ m: 5 }}>
//     <Stack direction="column" spacing={3} justifyContent="center" alignItems="center" sx={{ mb: 2, mt: 2 }}>
//       <Typography variant="subtitle1">{`От: ${request.department_name}`}</Typography>
//       <Typography variant="subtitle1">{`ГОСТ: ${request.gost}`}</Typography>
//       <Typography variant="subtitle1">{`Культура: ${request.culture}`}</Typography>
//     </Stack>

//     {indicators.map((indicator, index) => (
//       <Stack key={index} direction="row" spacing={2} alignItems="center">
//         <Typography variant="body1">{`${indicator.name}: ${indicator.oldValue}`}</Typography>
//         <TextField
//           variant="outlined"
//           value={newValues[index] || ""} // Используем новое значение, если оно есть
//           onChange={event => handleChange(index, event)}
//           placeholder="Введите новое значение"
//         />
//       </Stack>
//     ))}

//     <Button variant="contained" color="primary" onClick={handleSubmit}>
//       Сохранить изменения
//     </Button>
//   </Box>
// )
