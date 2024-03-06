import { styled } from "@mui/material/styles"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import { Modal } from "@mui/material"

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    width: "100%", // Устанавливаем ширину контента
    padding: theme.spacing(2),
    height: "100%", // Устанавливаем высоту на 100%
    display: "flex", // Используем flex для растяжения контента
    alignItems: "stretch", // Растягиваем контент по вертикали
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}))

export const ModalCustom = ({ isOpen, onClose, children, infoText }) => {
  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <BootstrapDialog onClose={onClose} aria-labelledby="customized-dialog-title" open={isOpen}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {infoText ? infoText : ''}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>

        <DialogContent dividers>{children}</DialogContent>
        <DialogActions>
          {/* <Button autoFocus onClick={onClose}>
            Save changes
          </Button> */}
        </DialogActions>
      </BootstrapDialog>
    </Modal>
  )
}

ModalCustom.defaultProps = {
  isOpen: false,
  onClose: () => {},
  children: null,
}
