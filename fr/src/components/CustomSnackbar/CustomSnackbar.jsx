import React from "react"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"

export const CustomSnackbar = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

// usage

// import React, { useState } from 'react';
// import CustomSnackbar from './CustomSnackbar'; // Импортируйте ваш новый компонент

// const YourComponent = () => {
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");

//   const popupSuccess = text => {
//     setSnackbarMessage(text);
//     setSnackbarSeverity("success");
//     setOpenSnackbar(true);
//   };

//   const popupError = text => {
//     setSnackbarMessage(text);
//     setSnackbarSeverity("error");
//     setOpenSnackbar(true);
//   };

//   const handleCloseSnackbar = () => {
//     setOpenSnackbar(false);
//   };

//   return (
//     <div>
//       {/* Ваш основной контент */}

//       <CustomSnackbar
//         open={openSnackbar}
//         message={snackbarMessage}
//         severity={snackbarSeverity}
//         onClose={handleCloseSnackbar}
//       />
//     </div>
//   );
// };

// export default YourComponent;
