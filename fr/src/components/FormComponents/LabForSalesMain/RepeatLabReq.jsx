import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { getDataFromEndpoint } from "../../../utils/getDataFromEndpoint"
import { useSnackbar } from "../../../context/SnackbarProvider"
import { TextField, Typography, Box, Stack, Button } from "@mui/material"
import { Loader } from "../Loader/Loader"

export const RepeatLabReq = ({ currentRequest_id, closeModal, currentUser }) => {
  const { popupSnackbar } = useSnackbar()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [request, setRequest] = useState([])
  const [reqNum, setReqNum] = useState("")
  const [tonnage, setTonnage] = useState("")
  const [comment, setComment] = useState("")
  const areFieldsSelected = Boolean(reqNum && tonnage)

  const getRequestForRepeat = async () => {
    const endpoint = `/lab/getRequestForRepeat`
    try {
      setReqStatus({ loading: true, error: null })
      const data = await getDataFromEndpoint(currentUser.token, endpoint, "POST", currentRequest_id, setReqStatus)
      setRequest(data)
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser.login) {
        await getRequestForRepeat()
      }
    }
    fetchData()
  }, [currentUser, currentRequest_id])

  const createRequest = async status => {
    try {
      const currentRequest = request[0] // Получаем первый элемент массива
      const formData = {
        reqForAvail_id: uuidv4(),
        culture: currentRequest.culture,
        tonnage,
        classType: currentRequest.classType,
        type: currentRequest.type,
        contractor: currentRequest.contractor,
        selectedDepartment: currentRequest.selectedDepartment,
        selectedDepartment_name: currentRequest.dep_name, //Для уведомления через сокет
        creator: currentUser.id,
        user_id: currentUser.id, //Для уведомления через сокет
        creator_subDep: currentUser.subDep,
        creator_role: currentUser.role,
        position_id: currentUser.position,
        approved: false,
        req_status: status,
        gost: currentRequest.gost,
        comment,
        yearOfHarvest: currentRequest.yearOfHarvest,
        tonnagePermissible: currentRequest.tonnagePermissible,
        reqNum,
        basis: currentRequest.basis,
        salesPoint: currentRequest.salesPoint,
        contractor_id: currentRequest.contractor_id,
        indicators: JSON.parse(currentRequest.indicators),
      }
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, "/lab/createReqForAvailability", "POST", formData, setReqStatus)
      setReqStatus({ loading: false, error: null })
      popupSnackbar("Создан запрос!", "success")
      closeModal()
    } catch (error) {
      const errorMessage = error.message || "Ошибка при создании запроса."
      popupSnackbar(errorMessage, "error")
      setReqNum("")
      setReqStatus({ loading: false, error })
    }
  }
  const handleCreateRequest = async () => {
    await createRequest("new")
  }
  const handleSaveDraft = async () => {
    await createRequest("draft")
  }
  const renderIndicators = indicatorsString => {
    if (!indicatorsString) {
      return <Typography>No indicators available</Typography>
    }
    try {
      const indicators = JSON.parse(indicatorsString) // Преобразуем строку в массив объектов
      return (
        <Stack direction="row" spacing={1}>
          {indicators
            .filter(indicator => indicator.value && indicator.name) // Фильтруем индикаторы
            .map((indicator, index) => (
              <div key={index}>
                {indicator.name.substring(0, 20)}: {indicator.value}
                {index < indicators.length - 1 ? ", " : ""}
              </div>
            ))}
        </Stack>
      )
    } catch (error) {
      console.error("Error parsing indicators:", error)
      return <Typography>Error parsing indicators</Typography>
    }
  }
  return (
    <>
      <Loader reqStatus={reqStatus}>
        <Box component="form" sx={{ m: 5 }}>
          <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
            {request.length > 0 && (
              <>
                <Typography>{request[0].dep_name}</Typography>
                <Typography>{request[0].contractor}</Typography>
                <Typography>{request[0].salesPoint}</Typography>
                <Typography>{request[0].culture}</Typography>
                <Typography>{request[0].basis}</Typography>
                <Typography>{request[0].yearOfHarvest}</Typography>
                <Typography>{request[0].tonnagePermissible}</Typography>
                <Typography>{request[0].gost}</Typography>
              </>
            )}
          </Stack>
          <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
            {request.length > 0 && <>{renderIndicators(request[0].indicators)}</>}
          </Stack>
          <Stack direction="column" spacing={3} justifyContent="center" alignItems="center">
            {request.length > 0 && (
              <>
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
                <TextField label="Примечание" variant="outlined" fullWidth type="text" value={comment} onChange={e => setComment(e.target.value)} />
              </>
            )}
          </Stack>

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
            <Button onClick={closeModal} variant="outlined" color="error">
              Закрыть
            </Button>
          </Stack>
        </Box>
      </Loader>
    </>
  )
}
