import React, { createContext, useContext, useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const popupSnackbar = useCallback((text, severity) => {
    setSnackbarMessage(text);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setOpenSnackbar(false);
    setSnackbarMessage(""); // Сброс сообщения
    setSnackbarSeverity("success"); // Сброс уровня серьезности
  }, []);

  return (
    <SnackbarContext.Provider value={{ popupSnackbar }}>
      {children}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// usage

// popupSnackbar("Все ок!", "success")
// popupSnackbar("Не ок!", "error")