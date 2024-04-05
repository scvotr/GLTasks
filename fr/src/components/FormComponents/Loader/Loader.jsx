import { CircularProgress, Box } from "@mui/material";

export const Loader = ({ reqStatus, children }) => {
  return (
    reqStatus.loading ? (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999 // чтобы лоадер был поверх других элементов
        }}
      >
        <CircularProgress />
      </Box>
    ) : (
      children
    )
  );
};
