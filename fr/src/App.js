import { createTheme, ThemeProvider, CssBaseline, Container, Box } from "@mui/material"


const defaultTheme = createTheme()

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Container maxWidth={false}>
          <Box>
            It's work
          </Box>
        </Container>
    </ThemeProvider>
  )
}

export default App