import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"

export const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => {
  const handleConfirmDelete = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ style: { minWidth: "300px" } }}
    >
      <Box style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" >Отмена</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Подтвердить
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

// usege

{/* <ConfirmationDialog
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  onConfirm={handleConfirmDelete}
  title="Подтвердите удаление задачи"
  message="Вы уверены, что хотите удалить эту задачу?"
/> */}