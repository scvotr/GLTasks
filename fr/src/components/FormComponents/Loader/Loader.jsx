// import { CircularProgress, Box } from "@mui/material";

// export const Loader = ({ reqStatus, children }) => {
//   return (
//     reqStatus.loading ? (
//       <Box
//         sx={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           zIndex: 9999 // чтобы лоадер был поверх других элементов
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     ) : (
//       children
//     )
//   );
// };

import { CircularProgress, Box, Typography } from "@mui/material"

export const Loader = ({ reqStatus, children }) => {
  return (
    // <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
    <>
      {reqStatus.loading ? (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999, // чтобы лоадер был поверх других элементов
          }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {reqStatus.error && (
            <Typography color="error" sx={{ textAlign: "center", marginTop: 2 }}>
              {reqStatus.error}
            </Typography>
          )}
          {children}
        </>
      )}
    </>
    // </Box>
  )
}
