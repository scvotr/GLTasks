import { AppBarForPage } from "../componenst/AppBarForPage/AppBarForPage"

import { Container, Typography, TextField, Grid, Button } from "@mui/material"

export const DocsAtchive = () => {
  return (
    <>
      <AppBarForPage title="Архив документов:" />

      <Container>
        <Typography variant="h4" gutterBottom align="center">
          Отчет
        </Typography>
        <TextField id="companyName" label="Название компании" fullWidth margin="normal" variant="outlined" />
        <Typography variant="h6" gutterBottom>
          Планируемые задачи на период с 05.02.2024 по 11.02.2024
        </Typography>
        <TextField id="department" label="Отдел" fullWidth margin="normal" variant="outlined" />
        <TextField id="executor" label="Исполнитель" fullWidth margin="normal" variant="outlined" />
        {/* Add more TextFields for tasks here */}
        <Typography variant="h6" gutterBottom>
          Планируемые задачи на период с 12.02 по 18.02.2024г
        </Typography>
        <TextField id="tasks" label="Планируемые задачи" multiline rows={4} fullWidth margin="normal" variant="outlined" />
        <Grid container justifyContent="center" spacing={2}>
          <Grid item>
            <Button variant="contained" color="primary">
              Сохранить
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary">
              Отмена
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
