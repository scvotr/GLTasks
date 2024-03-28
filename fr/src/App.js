import { createTheme, ThemeProvider, CssBaseline, Container, Box } from '@mui/material'
import { GlobalWrapper } from './components/GlobalWrapper'
import { SocketProvider } from './context/SocketProvider'
import { SnackbarProvider } from './context/SnackbarProvider'

const defaultTheme = createTheme()

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        {/* <SocketProvider> */}
          <Container maxWidth={false}>
            <Box>
              <SnackbarProvider>
                <GlobalWrapper />
              </SnackbarProvider>
            </Box>
          </Container>
        {/* </SocketProvider> */}
    </ThemeProvider>
  )
}

export default App