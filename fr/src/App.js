import { createTheme, ThemeProvider, CssBaseline, Container, Box } from '@mui/material'
import { GlobalWrapper } from './components/GlobalWrapper'
import { SocketProvider } from './context/SocketProvider'

const defaultTheme = createTheme()

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <SocketProvider>
          <Container maxWidth={false}>
            <Box>
              <GlobalWrapper />
            </Box>
          </Container>
        </SocketProvider>
    </ThemeProvider>
  )
}

export default App