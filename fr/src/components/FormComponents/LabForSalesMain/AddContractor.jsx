import { Button, Paper, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { getDataFromEndpoint } from "../../../utils/getDataFromEndpoint"
import { Loader } from "../Loader/Loader"
import { useSnackbar } from "../../../context/SnackbarProvider"

export const AddContractor = ({ currentUser, onClose, popupSnackbar }) => {
  // const {popupSnackbar} = useSnackbar()
  const [contractor, setContractor] = useState()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  const addContractorHandler = async () => {
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, "/lab/addContractor", "POST", { name: contractor }, setReqStatus)
      setReqStatus({ loading: false, error: null })
      popupSnackbar("Контрагент создан!", "success")
      onClose()
    } catch (error) {
      const errorMessage = error.message || "Ошибка при создании запроса."
      console.log("🚀 ~ addContractorHandler ~ errorMessage:", errorMessage)
      popupSnackbar(errorMessage, "error")
      setContractor("")
      // setReqStatus({ loading: false, error })
    }
  }

  return (
    <>
      <Loader reqStatus={reqStatus}>
        <Stack direction="column" spacing={2} justifyContent="center">
          <Typography>Как будет отображаться в заявке</Typography>
          <Paper sx={{p:2}}>
            <Typography>{contractor}</Typography>
          </Paper>
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
          <Button onClick={addContractorHandler} variant="contained" color="primary" disabled={!contractor}>
            Создать
          </Button>
          <Button onClick={onClose} variant="outlined" color="error">
            Закрыть
          </Button>
        </Stack>
      </Loader>
    </>
  )
}
