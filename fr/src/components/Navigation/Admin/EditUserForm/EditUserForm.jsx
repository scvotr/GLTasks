import { Box, Button, Divider, Stack, TextField } from "@mui/material"
import { useState } from "react"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import ThumbDownIcon from "@mui/icons-material/ThumbDown"
import { SelectDataField } from "./SelectDataField/SelectDataField"
import { getDataFromEndpoint } from "../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../context/AuthProvider"
import { ConfirmationDialog } from "../../../FormComponents/ConfirmationDialog/ConfirmationDialog"

export const EditUserForm = ({ user, onUserSubmit }) => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [openDialog, setOpenDialog] = useState(false)

  const [formData, setFormData] = useState({
    id: user.id,
    loginName: user.login,
    role: user.role,
    first_name: user.first_name,
    middle_name: user.middle_name,
    last_name: user.last_name,
    department_id: user.department_id,
    office_number: user.office_number,
    subdepartment_id: user.subdepartment_id,
    position_id: user.position_id,
  })

  const handleSubmit = (isApprove, event) => {
    event.preventDefault()
    if (isApprove) {
      setReqStatus({ loading: true, error: null })
      getDataFromEndpoint(currentUser.token, "/admin/updateUserData", "POST", formData, setReqStatus)
        .then(data => {
          onUserSubmit()
          setReqStatus({ loading: false, error: null })
        })
        .catch(error => {
          setReqStatus({ loading: false, error: error.message })
        })
    }
    onUserSubmit()
  }

  const handleResetPass = () => {
    setReqStatus({ loading: true, error: null })
    getDataFromEndpoint(currentUser.token, "/auth/resetPassword", "POST", formData, setReqStatus)
      .then(data => {
        onUserSubmit()
        setReqStatus({ loading: false, error: null })
      })
      .catch(error => {
        setReqStatus({ loading: false, error: error.message })
      })
    onUserSubmit()
  }

  const getInputData = event => {
    const { name, value, files, checked } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        autoComplete="off"
        sx={{
          p: 1,
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          border: "1px solid #e0e0e0",
          borderRadius: "5px",
          "& .MuiTextField-root": { m: 1, width: "55ch" },
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <TextField
          name="loginName"
          value={formData.loginName}
          onChange={e => {
            getInputData(e)
          }}
        />
        <TextField
          name="role"
          value={formData.role}
          onChange={e => {
            getInputData(e)
          }}
        />
        <SelectDataField getData={getInputData} value={formData} />

        <Divider />
        <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
          <Button variant="outlined" color="error" startIcon={<ThumbDownIcon />} onClick={e => handleSubmit(false, e)}>
            Отмена
          </Button>
          <Button variant="contained" color="success" endIcon={<ThumbUpIcon />} onClick={e => handleSubmit(true, e)}>
            Редактировать
          </Button>
          <Button variant="contained" color="success" endIcon={<ThumbUpIcon />} onClick={() => setOpenDialog(true)}>
            Сбросить пароль
          </Button>
        </Stack>
      </Box>
      <>
        <ConfirmationDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleResetPass}
          title="Подтвердите сброс пароля"
          message="Вы уверены, что хотите сбросить пароль?"
        />
      </>
    </>
  )
}
