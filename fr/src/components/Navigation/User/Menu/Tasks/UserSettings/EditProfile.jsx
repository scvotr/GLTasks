import { useEffect, useState } from "react"
import { TextField, Button, Grid, Box, CircularProgress, Stack, Typography } from "@mui/material"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../../../context/AuthProvider"

export const EditProfile = () => {
  const currentUser = useAuthContext()

  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [userData, setUserData] = useState()
  const [errorPin, setErrorPin] = useState()

  useEffect(() => {
    setReqStatus({ loading: true, error: null })
    getDataFromEndpoint(currentUser.token, "/user/getUserById", "POST", null, setReqStatus)
      .then(data => {
        setUserData(data)
        setReqStatus({ loading: false, error: null })
      })
      .catch(error => {
        setReqStatus({ loading: false, error: error })
      })
  }, [currentUser])

  const handleChange = e => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, "/user/editUserData", "POST", userData, setReqStatus)
      currentUser.setProfile(false)
        setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: null })
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, textAlign: "center" }}>
      {reqStatus.loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            {currentUser.profile.toString() === 'true' ? "Для дальнейшей работы заполните данне профиль!" : ""}
          </Typography>{" "}
          <Typography variant="h5" gutterBottom>
            {currentUser.notDistributed.toString() === 'true' ? "Отдел не назначен. Обратитесь к администратору для назначения отдела" : "отдел назначен"}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Логин: {(userData && userData.login) || ""}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              sx={{ mr: 2 }}
              required
              label="Имя"
              name="given-name"
              value={(userData && userData.first_name) || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errorPin}
              helperText={errorPin || "Введите Ваше имя"}
              inputProps={{
                minLength: 4,
                autoComplete: "additional-name"
              }}
            />
            <TextField
              sx={{ mr: 2 }}
              required
              label="Отчество"
              name="middle_name"
              value={(userData && userData.middle_name) || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errorPin}
              helperText={errorPin || "Введите Ваше отчество"}
              inputProps={{
                minLength: 4,
                autoComplete: "family-name"
              }}
            />
            <TextField
              required
              label="Фамилия"
              name="last_name"
              value={(userData && userData.last_name) || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errorPin}
              helperText={errorPin || "Введите Вашу фамилию"}
              inputProps={{
                minLength: 4,
                autoComplete: "tel"
              }}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              required
              sx={{ mr: 2 }}
              label="№ внеш. тел."
              name="external_phone"
              value={(userData && userData.external_phone) || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errorPin}
              helperText={errorPin || "введите цифры"}
              inputProps={{
                minLength: 11,
                maxLength: 11,
                autoComplete: "tel"
              }}
            />
            <TextField
              required
              label="№ внутр. тел."
              name="internal_phone"
              value={(userData && userData.internal_phone) || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errorPin}
              helperText={errorPin || "введите цифры"}
              inputProps={{
                minLength: 4,
                maxLength: 6,
                autoComplete: "tel"
              }}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              required
              label="№ каб."
              name="office_number"
              value={(userData && userData.office_number) || ""}
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
          </Box>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Сохранить
          </Button>
        </>
      )}
    </Box>
  )
}
