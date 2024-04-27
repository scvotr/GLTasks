import React, { useState, useEffect } from "react"
import { Grid } from "@mui/material"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Link from "@mui/material/Link"
import { useAuthContext } from "../../../context/AuthProvider"
import { formatDate } from "../../../utils/formatDate"
import { getDataFromEndpoint } from "../../../utils/getDataFromEndpoint"
import { sendDataToEndpoint } from "../../../utils/sendDataToEndpoint"
import { Loader } from "../Loader/Loader"

export const AddNewDocForm = () => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  const initVal = {
    name: currentUser.name,
    currentData: formatDate(new Date()).split(".").reverse().join("-"),
    selectData: formatDate(new Date()).split(".").reverse().join("-"),
    timeStart: "08:00",
    timeEnd: "09:00",
  }

  const [formData, setFormData] = useState(initVal)
  const [blobData, setBlobData] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    if (currentUser.login) {
      const transferData = {
        ...formData,
        currentData: formatDate(formData.currentData),
        selectData: formatDate(formData.selectData),
      }
      console.log(transferData)
      // await getDataFromEndpoint(currentUser.token, "/docs/test", "POST", transferData, setReqStatus)
      setReqStatus({ loading: true, error: null })
      await sendDataToEndpoint(currentUser.token, transferData, "/docs/test", "POST", "blob", res => {
        console.log(res)
        setBlobData(res) // Сохранение объекта Blob в состоянии
        setReqStatus({ loading: false, error: null }) // Обновление статуса запроса
      })
    }
    setFormData(initVal)
  }

  const handleGetData = e => {
    const { name, value } = e.target
    if (name === "selectData" || name === "currentData") {
      setFormData(prev => ({
        ...prev,
        [name]: formatDate(value).split(".").reverse().join("-"),
      }))
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }))
    }
  }

  useEffect(() => {
    if (currentUser.login) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name,
        currentData: formatDate(new Date()).split(".").reverse().join("-"),
        selectData: formatDate(new Date()).split(".").reverse().join("-"),
      }))
    }
  }, [currentUser])

  const handleDownload = () => {
    setBlobData(null)
    // setReqStatus(null)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} className="form-send form-send--modifier">
      <Typography>Заявление в счет отпуска</Typography>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item>
          <TextField type="date" name="selectData" value={formData.selectData} onChange={handleGetData} />
        </Grid>
        <Grid item>
          <Typography>c</Typography>
        </Grid>
        <Grid item>
          <TextField
            type="time"
            inputProps={{ min: "08:00", max: "18:00", step: "1800" }}
            name="timeStart"
            value={formData.timeStart}
            onChange={handleGetData}
            required
          />
        </Grid>
        <Grid item>
          <Typography>до</Typography>
        </Grid>
        <Grid item>
          <TextField
            type="time"
            inputProps={{ min: "08:00", max: "18:00", step: "1800" }}
            name="timeEnd"
            value={formData.timeEnd}
            onChange={handleGetData}
            required
          />
        </Grid>
      </Grid>
      <br />
      <br />
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item>
          <Typography>Дата составления:</Typography>
        </Grid>
        <Grid item>
          <TextField type="date" name="currentData" value={formData.currentData} onChange={handleGetData} />
        </Grid>
      </Grid>
      <br />
      <br />
      {blobData ? (
        <Loader reqStatus={reqStatus}>
          {blobData && (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Link href={blobData} download="document.docx" underline="none" onClick={handleDownload}>
                <Typography variant="body1" mr={2}>
                  Скачать заявление
                </Typography>
              </Link>
            </Box>
          )}
        </Loader>
      ) : (
        <Button type="submit" sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
          Создать
        </Button>
      )}
    </Box>
  )
}