import { Box, Typography } from "@mui/material"

export const NotDistributed = () => {
  return (
    <>
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          Отдел пока не назначен. Сообщите о регистрации адсинистратору.
        </Typography>
      </Box>
    </>
  )
}
