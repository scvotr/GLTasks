import { useCallback, useEffect, useState } from "react"
import { ModalCustom } from "../../../../../../../../ModalCustom/ModalCustom"
import { Box, Typography } from "@mui/material"
import { fetchData } from "../../../../../../../../../utils/fetchData"
import { getDataFromEndpoint } from "../../../../../../../../../utils/getDataFromEndpoint"
import { useAuthContext } from "../../../../../../../../../context/AuthProvider"
import { ConfirmationDialog } from "../../../../../../../../FormComponents/ConfirmationDialog/ConfirmationDialog"
import { HeaderWithNavigation } from "../../../../../../../../HeaderWithNavigation/HeaderWithNavigation"
import { CustomSnackbar } from "../../../../../../../../../components/CustomSnackbar/CustomSnackbar"
import CustomTableView from "../../../../../../../../CustomTableView/CustomTableView"
import { fetchDataV2 } from "../../../../../../../../../utils/fetchDataV2"
import { Loader } from "../../../../../../../../FormComponents/Loader/Loader"
import { CrUpCosFForm } from "./CrUpCosFForm"

export const CosF = () => {
  //? const sections = [{ path: "/admin/devices/motor/cosF/...", label: "Мощность кВт" }]
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
    const endpoint = "/admin/devices/motor/electrical/cosF/read"
    // fetchData(currentUser, endpoint, setResponse, setData)
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
      message: "Вы уверены, что хотите изменить этот номинальный ток?",
    })
    setOpenDialog(true)
  }

  const handleEdit = async () => {
    // data in dataToEdit
    setModalOpen(true)
    setIsEdit(true)
  }

  const handleConfirmDelete = id => {
    setDataToDelete(id)
    setDialogText({
      title: "Подтверждение удаления",
      message: "Вы уверены, что хотите удалить этот номинальный ток?",
    })
    setOpenDialog(true)
  }

  const handleDelete = async () => {
    const endpoint = `/admin/devices/motor/electrical/cosF/delete`
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
      <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText="Добавить Коэффициент мощности">
        <CrUpCosFForm
          onClose={closeModal}
          isEdit={isEdit}
          dataToEdit={dataToEdit}
          popupSnackbar={popupSnackbar}
          response={setResponse}
        />
      </ModalCustom>
      <HeaderWithNavigation
        title="Коэффициент мощности, обозначается cos φ"
        //? sections={sections}
        onAddClick={() => setModalOpen(true)}
        backPath="/admin/devices/motor/electrical" // Передаем путь для кнопки "назад"
      />
      <Box>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Коэффициент мощности равен отношению потребляемой электроприёмником активной мощности к полной мощности.
        </Typography>
      </Box>
      <Loader reqStatus={response}>
        <Box>
          <CustomTableView
            items={data}
            units=""
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
