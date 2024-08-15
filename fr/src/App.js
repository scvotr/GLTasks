import { createTheme, responsiveFontSizes, ThemeProvider, CssBaseline, Container, Box } from '@mui/material'
import { GlobalWrapper } from './components/GlobalWrapper'
import { SocketProvider } from './context/SocketProvider'
import { SnackbarProvider } from './context/SnackbarProvider'

let defaultTheme = createTheme({
  // palette: {
  //   primary: {
  //     // main: '#4A894E', 
  //     // main: '#3f51b5', 
  //     // main: '#007bff',
  //   },
  //   secondary: {
  //     // main: '#DFC053',
  //     // main: '#f50057',
  //     // main: '#6c757d',
  //   },
  // },
  // typography: {
  //   fontFamily: 'Roboto, sans-serif',
  //   fontSize: 16,
  // },
})

defaultTheme = responsiveFontSizes(defaultTheme)

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
