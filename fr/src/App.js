import { createTheme, ThemeProvider, CssBaseline, Container, Box } from '@mui/material'
import { GlobalWrapper } from './components/GlobalWrapper'

const defaultTheme = createTheme()

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Container maxWidth={false}>
          <Box>
            <GlobalWrapper />
          </Box>
        </Container>
    </ThemeProvider>
  )
}

export default App