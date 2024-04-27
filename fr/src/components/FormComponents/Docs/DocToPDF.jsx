import { useState } from "react"
import { useAuthContext } from "../../../context/AuthProvider"
import { formatDate } from "../../../utils/formatDate"
import { sendDataToEndpoint } from "../../../utils/sendDataToEndpoint"
import { Button, TextField, Grid } from "@mui/material"
import { Loader } from "../Loader/Loader"

export const DocToPDF = () => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [blobData, setBlobData] = useState(null)

  const initVal = {
    name: currentUser.name,
    currentData: formatDate(new Date()).split(".").reverse().join("-"),
    selectData: formatDate(new Date()).split(".").reverse().join("-"), // Приведение даты к ожидаемому формату "yyyy-MM-dd"
    timeStart: "08:00",
    timeEnd: "09:00",
  }
  const [formData, setFormData] = useState(initVal)

  const handleSubmit = async e => {
    e.preventDefault()
    if (currentUser.login) {
      const transferData = {
        ...formData,
        currentData: formatDate(formData.currentData),
        selectData: formatDate(formData.selectData),
      }
      console.log(transferData)
      try {
        // await getDataFromEndpoint(currentUser.token, "/docs/test", "POST", transferData, setReqStatus)
        setReqStatus({ loading: true, error: null })
        await sendDataToEndpoint(currentUser.token, transferData, "/docs/testToPDF", "POST", "blob", res => {
          console.log(res)
          setBlobData(res) // Сохранение объекта Blob в состоянии
          setReqStatus({ loading: false, error: null }) // Обновление статуса запроса
        })
      } catch (error) {}
    }
    setFormData(initVal)
  }
  const handleDownload = () => {
    // Очистка объекта Blob
    setBlobData(null)
    // Сброс статуса запроса
    // setReqStatus({ loading: false, error: null })
  }
  return (
    <Grid container spacing={2}>
      <Loader reqStatus={reqStatus}></Loader>
      <Grid item xs={12}>
        <form onSubmit={handleSubmit} className="form-send form-send--modifier">
          <TextField
            fullWidth
            type="text"
            name="test"
            value={formData.test}
            // onChange={handleGetFormData}
            label="Введите текст"
          />
          <Button type="submit" variant="contained" color="primary">
            Создать PDF + подпись
          </Button>
        </form>
      </Grid>
      <Grid item xs={12}>
        <div>
          {formData.name} <p>{formData.text}</p>
        </div>
      </Grid>
      <Grid item xs={12}>
        {blobData && (
          <div className="download-link download-link--modifier">
            <a href={blobData} download="output_with_watermark.pdf" className="download-link__link">
              Скачать
            </a>
            <Button onClick={handleDownload} variant="contained">
              Закрыть
            </Button>
          </div>
        )}
      </Grid>
    </Grid>
  )
}
