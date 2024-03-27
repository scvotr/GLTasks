import { useEffect, useState } from "react"
import { TextField, Button, Grid, Box, CircularProgress } from "@mui/material"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../../../context/AuthProvider"

export const EditProfile = () => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [userData, setUserData] = useState()
  const [errorPin, setErrorPin] = useState("")

  useEffect(() => {
    setReqStatus({ loading: true, error: null })
    getDataFromEndpoint(currentUser.token, "/user/getUserById", "POST", null, setReqStatus)
      .then(data => {
        setUserData(data)
        setReqStatus({ loading: false, error: null })
      })
      .catch(error => console.log(error))
  }, [currentUser])

  const handleChange = e => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      console.log(userData)
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, "/user/editUserData", "POST", userData, setReqStatus)
      currentUser.setEmptyProfile(false)
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: null })
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, textAlign: 'center' }}>
      {reqStatus.loading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                disabled
                label="Login"
                name="name"
                value={userData.login || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                helperText={"Обязательно к заполнению"}
                inputProps={{
                  minLength: 4,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label="Имя"
                name="first_name"
                value={userData.first_name || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errorPin}
                helperText={errorPin || "Введите Ваше имя"}
                inputProps={{
                  minLength: 4,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label="Отчество"
                name="middle_name"
                value={userData.middle_name || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errorPin}
                helperText={errorPin || "Введите Ваше отчество"}
                inputProps={{
                  minLength: 4,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label="Фамилия"
                name="last_name"
                value={userData.last_name || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errorPin}
                helperText={errorPin || "Введите Вашу фамилию"}
                inputProps={{
                  minLength: 4,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label="№ внеш. тел."
                name="external_phone"
                value={userData.external_phone || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errorPin}
                helperText={errorPin || "введите цифры"}
                inputProps={{
                  minLength: 6,
                  maxLength: 8,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label="№ внутр. тел."
                name="internal_phone"
                value={userData.internal_phone || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errorPin}
                helperText={errorPin || "введите цифры"}
                inputProps={{
                  minLength: 4,
                  maxLength: 6,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label="№ каб."
                name="office_number"
                value={userData.office_number || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errorPin}
                helperText={errorPin || "введите цифры"}
                inputProps={{
                  pattern: "[0-9]*",
                  minLength: 3,
                  maxLength: 5,
                }}
              />
            </Grid>
          </Grid>

          <Button type="submit" variant="contained" color="primary">
            Сохранить
          </Button>
        </>
      )}
    </Box>
  )
}
