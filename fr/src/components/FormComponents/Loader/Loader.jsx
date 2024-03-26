import { CircularProgress } from "@mui/material";

export const Loader = ({ reqStatus, children }) => {
  return (
    reqStatus.loading ? (
      <CircularProgress />
    ) : (
      children
    )
  );
};
