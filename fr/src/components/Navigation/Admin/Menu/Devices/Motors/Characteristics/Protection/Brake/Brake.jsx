import { useCallback, useEffect, useState } from "react"
import { ModalCustom } from "../../../../../../../../ModalCustom/ModalCustom"
import { Box, Typography } from "@mui/material"
import { getDataFromEndpoint } from "../../../../../../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../../../../../../context/AuthProvider"
import { ConfirmationDialog } from "../../../../../../../../FormComponents/ConfirmationDialog/ConfirmationDialog"
import { HeaderWithNavigation } from "../../../../../../../../HeaderWithNavigation/HeaderWithNavigation"
import { CustomSnackbar } from "../../../../../../../../CustomSnackbar/CustomSnackbar"
import CustomTableView from "../../../../../../../../CustomTableView/CustomTableView"
import { fetchDataV2 } from "../../../../../../../../../utils/fetchDataV2"
import { Loader } from "../../../../../../../../FormComponents/Loader/Loader"
import { CrUpMotorChar } from "../../../Form/CrUpMotorChar"

export const Brake = () => {
  const endpointPath = "protection/brake"
  const backPath = "/admin/devices/motor/protection"
  const subjectName = "Наличие тормоза"
  //  const sections = [{ path: `/admin/devices/${endpointPath}/...`, label: "Мощность кВт" }]
  const texts = {
    title: "Ed - добавляется к названию двигателя",
    description:
      "Обычно тормоз можно добавить отдельно.",
    addModalText: "Добавить тормоз",
    confirmEditMessage: `Вы уверены, что хотите изменить ${subjectName}?`,
    confirmDeleteMessage: `Вы уверены, что хотите удалить ${subjectName}?`,
    units: `Ed`,
  }

  const currentUser = useAuthContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [response, setResponse] = useState("")
  const [data, setData] = useState("")
  const [dataToDelete, setDataToDelete] = useState("")
  const [dataToEdit, setDataToEdit] = useState("")
  const [isEdit, setIsEdit] = useState(false)
  // SnackBar
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  // Confirm dialog
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogText, setDialogText] = useState({ title: "", message: "" })

  const popupSnackbar = (text, severity) => {
    setSnackbarMessage(text)
    setSnackbarSeverity(severity)
    setOpenSnackbar(true)
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  const closeModal = () => {
    setModalOpen(false)
    setFormKey(prev => prev + 1)
  }

  const getData = useCallback(() => {
    const endpoint = `/admin/devices/motor/${endpointPath}/read`
    fetchDataV2(currentUser, endpoint, setResponse, setData)
  }, [currentUser])

  useEffect(() => {
    getData()
  }, [formKey, currentUser, getData])

  //  useEffect для сброса значений при закрытии модального окна
  useEffect(() => {
    if (!modalOpen) {
      setResponse("")
      setDataToEdit("")
      setDataToDelete("")
      setIsEdit(false)
    }
  }, [modalOpen])

  useEffect(() => {
    if (response.message) {
      popupSnackbar(`Ошибка: ${response.message} Код: ${response.code}`, "error")
    }
  }, [response])

  const handleClick = row => {
    console.log("row clicked", row)
  }

  const handleConfirmEdit = data => {
    setDataToEdit(data)
    setDialogText({
      title: "Подтверждение изменения",
      message: texts.confirmEditMessage,
    })
    setOpenDialog(true)
  }

  const handleEdit = async () => {
    setModalOpen(true)
    setIsEdit(true)
  }

  const handleConfirmDelete = id => {
    setDataToDelete(id)
    setDialogText({
      title: "Подтверждение удаления",
      message: texts.confirmDeleteMessage,
    })
    setOpenDialog(true)
  }

  const handleDelete = async () => {
    const endpoint = `/admin/devices/motor/${endpointPath}/delete`
    try {
      setResponse({ loading: true })
      await getDataFromEndpoint(currentUser.token, endpoint, "POST", dataToDelete, setResponse)
      popupSnackbar("Успешное удаленно!", "success")
      setResponse({ loading: false })
      setFormKey(prev => prev + 1)
    } catch (error) {
      popupSnackbar("Успешное удаленно!", "error")
    }
  }

  return (
    <>
      <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText={texts.addModalText}>
        <CrUpMotorChar
          onClose={closeModal}
          isEdit={isEdit}
          dataToEdit={dataToEdit}
          popupSnackbar={popupSnackbar}
          response={setResponse}
          endpointPath={endpointPath}
        />
      </ModalCustom>
      <HeaderWithNavigation
        title={texts.title}
        //? sections={sections}
        onAddClick={() => setModalOpen(true)}
        backPath={backPath}
      />
      <Box>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {texts.description}
        </Typography>
      </Box>
      <Loader reqStatus={response}>
        <Box>
          <CustomTableView
            items={data}
            units={texts.units}
            onEdit={handleConfirmEdit}
            onDelete={handleConfirmDelete}
            onRowClick={handleClick}
            headers={["ID", "Name", "Actions"]}
          />
          <CustomSnackbar
            open={openSnackbar}
            message={snackbarMessage}
            severity={snackbarSeverity}
            onClose={handleCloseSnackbar}
          />
        </Box>
      </Loader>
      <ConfirmationDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false)
        }}
        onConfirm={() => {
          if (dataToDelete) {
            handleDelete()
          } else if (dataToEdit) {
            handleEdit()
          }
          setOpenDialog(false)
        }}
        title={dialogText.title}
        message={dialogText.message}
      />
    </>
  )
}
