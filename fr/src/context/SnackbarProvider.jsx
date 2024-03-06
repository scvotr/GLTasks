import { createContext, useContext, useState } from "react"

const SnackbarContext = createContext()

export const useSnackbar = () => {
  return useContext(SnackbarContext)
}

export const SnackbarProvider = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  const openSnackbar = message => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }

  const closeSnackbar = () => {
    setSnackbarOpen(false)
  }

  return (
    <SnackbarContext.Provider value={{
        openSnackbar, snackbarOpen, snackbarMessage 
      }}>
    {children}
   </SnackbarContext.Provider>)
}