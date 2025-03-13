import { Button, IconButton, Paper, Stack } from "@mui/material"
import { useSnackbar } from "../../../../../../../../context/SnackbarProvider"
import { useState } from "react"
import { getDataFromEndpoint } from "../../../../../../../../utils/getDataFromEndpoint"
import { Loader } from "../../../../../../../FormComponents/Loader/Loader"
import { ReqInfoViewTest } from "../../../Menu/ReqInfoViewTest"
import { AddReportLabReq } from "../../../../../../../FormComponents/LabForSalesMain/AddReportLabReq"
import { FullScreenDialog } from "../../../../../../../FullScreenDialog/FullScreenDialog"
import CancelPresentationOutlinedIcon from "@mui/icons-material/CancelPresentationOutlined"
import { ConfirmationDialog } from "../../../../../../../FormComponents/ConfirmationDialog/ConfirmationDialog"

export const ElevatorLabActiveButtons = ({ currentRequest, closeModal, currentUser, reRender, checkFullScreenOpen }) => {
  const { popupSnackbar } = useSnackbar()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [modalOpen, setModalOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogText, setDialogText] = useState({ title: "", message: "" })
  const [toApprove, setToApprove] = useState(false)
  const [toReject, setToReject] = useState(false)

  const handleChangeStatus = async status => {
    const endpoint = `/lab/updateReqStatus`
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(
        currentUser.token,
        endpoint,
        "POST",
        { reqForAvail_id: currentRequest.reqForAvail_id, user_id: currentUser.id, req_status: status, currentRequest },
        setReqStatus
      )
      setReqStatus({ loading: false, error: null })
      await handleApprove(status)
      popupSnackbar("Создан запрос!", "success")
      closeModal()
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Ошибка при создании запроса."
      popupSnackbar(errorMessage, "error")
      setReqStatus({ loading: false, error })
    } finally {
      setReqStatus({ loading: false, error: null })
    }
  }
  //! Запрос для обновления статуса конкретного пользователя в системе подписантов
  const handleApprove = async status => {
    const endpoint = `/lab/getUserConfirmation`
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(
        currentUser.token,
        endpoint,
        "POST",
        { reqForAvail_id: currentRequest.reqForAvail_id, user_id: currentUser.id, position_id: currentUser.position, status: status },
        setReqStatus
      )
      closeModal()
      reRender()
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  const createReport = async () => {
    // await handleChangeStatus("closed")
    setModalOpen(true)
  }

  const closeCurrentModal = () => {
    setModalOpen(false)
  }

  return (
    <>
      <FullScreenDialog isOpen={modalOpen} onClose={closeCurrentModal} infoText="Отчет по контракту">
        <AddReportLabReq onClose={closeModal} currentUser={currentUser} request={currentRequest} handleChangeStatus={handleChangeStatus} />
      </FullScreenDialog>
      {currentRequest && (
        <>
          <Loader reqStatus={reqStatus}>
            <Paper sx={{ p: 1, maxWidth: "600px", margin: "0 auto", mt: 2 }}>
              <Stack direction="row" spacing={2} justifyContent="center" >
                {currentRequest.req_status === "in_progress" && <>Контракт открыт</>}
                {currentRequest.req_status === "closed" && <>Контракт закрыт</>}
                {currentRequest.req_status === "new" && (
                  <>
                    {currentRequest.users.map(user => (
                      <>
                        {currentUser.position.toString() === user.position_id.toString() && user.approval_status === "pending" && (
                          <>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                setToApprove(true)
                                setDialogText({
                                  title: "Подтверждение запроса",
                                  message: "Вы уверены, что хотите подтвердить этот запрос?",
                                })
                                setOpenDialog(true)
                              }}>
                              Подтвердить
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => {
                                setToReject(true)
                                setDialogText({
                                  title: "Подтверждение отклонения запроса",
                                  message: "Вы уверены, что хотите отклонить этот запрос?",
                                })
                                setOpenDialog(true)
                              }}>
                              Отклонить
                            </Button>
                            <IconButton onClick={() => closeModal()}>
                              <CancelPresentationOutlinedIcon />
                            </IconButton>
                          </>
                        )}
                      </>
                    ))}
                  </>
                )}
                {currentRequest.req_status === "approved" && (
                  <>
                    {currentRequest.users.map(user => (
                      <>
                        {currentUser.position.toString() === user.position_id.toString() && user.approval_status === "pending" && (
                          <>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                setToApprove(true)
                                setDialogText({
                                  title: "Подтверждение запроса",
                                  message: "Вы уверены, что хотите подтвердить этот запрос?",
                                })
                                setOpenDialog(true)
                              }}>
                              Подтвердить
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => {
                                setToReject(true)
                                setDialogText({
                                  title: "Подтверждение отклонения запроса",
                                  message: "Вы уверены, что хотите отклонить этот запрос?",
                                })
                                setOpenDialog(true)
                              }}>
                              Отклонить
                            </Button>
                            <IconButton onClick={() => closeModal()}>
                              <CancelPresentationOutlinedIcon />
                            </IconButton>
                          </>
                        )}
                      </>
                    ))}
                  </>
                )}
                {currentRequest.req_status === "on_confirm" && (
                  <>
                    <Button variant="contained" color="primary" onClick={() => createReport()}>
                      Сформировать отчёт по контракту
                    </Button>
                    <IconButton onClick={() => closeModal()}>
                      <CancelPresentationOutlinedIcon />
                    </IconButton>
                  </>
                )}
              </Stack>
            </Paper>
          </Loader>
          {/*  */}
          <ReqInfoViewTest
            request={currentRequest}
            currentUser={currentUser}
            reRender={reRender}
            checkFullScreenOpen={checkFullScreenOpen}
            closeModal={closeModal}
          />
          <ConfirmationDialog
            open={openDialog}
            onClose={() => {
              setOpenDialog(false)
            }}
            onConfirm={async () => {
              try {
                setOpenDialog(false) // Закрываем диалог перед выполнением действия
                if (toApprove) {
                  await handleChangeStatus("approved")
                } else if (toReject) {
                  await handleChangeStatus("discard")
                }
              } catch (error) {
                console.error("Ошибка при удалении файла:", error.message)
              }
            }}
            title={dialogText.title}
            message={dialogText.message}
          />
        </>
      )}
    </>
  )
}
