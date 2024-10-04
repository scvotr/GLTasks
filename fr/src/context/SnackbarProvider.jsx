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

// export const CreateMotorV2 = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const { openSnackbar } = useSnackbar(); // Получаем функцию openSnackbar

//   const closeModal = () => {
//     setModalOpen(false);
//   };

//   const handleCreateMotor = () => {
//     // Логика создания двигателя
//     // После успешного создания двигателя
//     openSnackbar("Двигатель успешно добавлен!"); // Открываем Snackbar с сообщением
//     closeModal(); // Закрываем модальное окно
//   };

// import React, { createContext, useContext, useState } from "react";
// import { CustomSnackbar } from "./CustomSnackbar"; // Убедитесь, что путь правильный

// const SnackbarContext = createContext();

// export const useSnackbar = () => {
//   return useContext(SnackbarContext);
// };

// export const SnackbarProvider = ({ children }) => {
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Уровень серьезности по умолчанию

//   const openSnackbar = (message, severity = "success") => {
//     setSnackbarMessage(message);
//     setSnackbarSeverity(severity);
//     setSnackbarOpen(true);
//   };

//   const closeSnackbar = () => {
//     setSnackbarOpen(false);
//   };

//   return (
//     <SnackbarContext.Provider value={{ openSnackbar, snackbarOpen, snackbarMessage, snackbarSeverity }}>
//       {children}
//       <CustomSnackbar 
//         open={snackbarOpen} 
//         message={snackbarMessage} 
//         severity={snackbarSeverity} 
//         onClose={closeSnackbar} 
//       />
//     </SnackbarContext.Provider>
//   );
// };
