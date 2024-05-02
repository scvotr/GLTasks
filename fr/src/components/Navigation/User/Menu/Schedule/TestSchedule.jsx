import { useState } from "react"
import { FormControl, InputLabel, MenuItem, Select, TextField, Button, Grid, Box } from "@mui/material"

import { AppBarForPage } from "../componenst/AppBarForPage/AppBarForPage"

// Тестовые данные
const testCompanies = ["ООО Каргилл", "ООО Масленица", "ООО Ясон Агро", "ООО Петрохлеб-Кубань"]
const testProducts = ["Подсолнечник", "Пшеница", "Кукуруза"]
const testQuality = {
  humidity: 7.46,
  impurities: 3.33,
  oil_content: 1.49,
}

export const TestSchedule = () => {
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quality, setQuality] = useState(testQuality)

  const handleCompanyChange = event => {
    setSelectedCompany(event.target.value)
  }

  const handleProductChange = event => {
    setSelectedProduct(event.target.value)
  }

  const handleQualityChange = event => {
    const { name, value } = event.target
    setQuality(prevQuality => ({
      ...prevQuality,
      [name]: value,
    }))
  }

  const handleSubmit = event => {
    event.preventDefault()
    // Здесь можно выполнить отправку данных на сервер или другую обработку
    console.log("Submitted:", selectedCompany, selectedProduct, quality)
  }
  return (
    <>
      <AppBarForPage title="Эксперимент: " />

      <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Выберите компанию</InputLabel>
            <Select value={selectedCompany} onChange={handleCompanyChange}>
              {testCompanies.map((company, index) => (
                <MenuItem key={index} value={company}>{company}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Выберите тип продукта</InputLabel>
            <Select value={selectedProduct} onChange={handleProductChange}>
              {testProducts.map((product, index) => (
                <MenuItem key={index} value={product}>{product}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Влажность"
            name="humidity"
            value={quality.humidity}
            onChange={handleQualityChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Примеси"
            name="impurities"
            value={quality.impurities}
            onChange={handleQualityChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Содержание масла"
            name="oil_content"
            value={quality.oil_content}
            onChange={handleQualityChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">Отправить</Button>
        </Grid>
      </Grid>
    </Box>
    </>
  )
}
