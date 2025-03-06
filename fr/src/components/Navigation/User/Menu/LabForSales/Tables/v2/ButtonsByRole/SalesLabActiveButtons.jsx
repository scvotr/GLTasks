import { Button, IconButton, Paper, Stack } from "@mui/material"
import { useSnackbar } from "../../../../../../../../context/SnackbarProvider"
import { useState } from "react"
import { getDataFromEndpoint } from "../../../../../../../../utils/getDataFromEndpoint"
import { Loader } from "../../../../../../../FormComponents/Loader/Loader"
import { ReqInfoViewTest } from "../../../Menu/ReqInfoViewTest"
import { ConfirmationDialog } from "../../../../../../../FormComponents/ConfirmationDialog/ConfirmationDialog"
import CancelPresentationOutlinedIcon from "@mui/icons-material/CancelPresentationOutlined"

export const SalesLabActiveButtons = ({ currentRequest, closeModal, currentUser, reRender, checkFullScreenOpen }) => {
  const { popupSnackbar } = useSnackbar()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogText, setDialogText] = useState({ title: "", message: "" })
  const [toDelete, setToDelete] = useState(false)
  const [toNew, setToNew] = useState(false)
  const [toInWork, setToInWork] = useState(false)
  const [toCancel, setToCancel] = useState(false)
  const [toConfirm, setToConfirm] = useState(false)

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

  const handleDelete = async () => {
    const endpoint = `/lab/deleteReqForLab`
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(
        currentUser.token,
        endpoint,
        "POST",
        { reqForAvail_id: currentRequest.reqForAvail_id, user_id: currentUser.id, position_id: currentUser.position },
        setReqStatus
      )
      setToDelete(false)
      closeModal()
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  const handleApprove = async status => {
    const endpoint = `/lab/getUserConfirmation`
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(
        currentUser.token,
        endpoint,
        "POST",
        { reqForAvail_id: currentRequest.reqForAvail_id, user_id: currentUser.id, position_id: currentUser.position, status },
        setReqStatus
      )
      setToNew(false)
      closeModal()
      // reRender()
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  return (
    <>
      {currentRequest && (
        <>
          <Loader reqStatus={reqStatus}>
            <Paper sx={{ p: 2, maxWidth: "600px", margin: "0 auto", mt: 2 }}>
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 1 }}>
                {/* ЧЕРНОВИК */}
                {currentRequest.req_status === "on_confirm" && <>нужен отчет по контракту</>}
                {currentRequest.req_status === "draft" && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setToNew(true)
                        setDialogText({
                          title: "Подтверждение запроса",
                          message: "Вы уверены, что хотите создать этот запрос?",
                        })
                        setOpenDialog(true)
                      }}>
                      Запросить
                    </Button>
                    <Button variant="contained" color="secondary">
                      Изменить
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        setToDelete(true)
                        setDialogText({
                          title: "Подтверждение удаления запроса",
                          message: "Вы уверены, что хотите удалить этот запрос?",
                        })
                        setOpenDialog(true)
                      }}>
                      Удалить
                    </Button>
                    <IconButton onClick={() => closeModal()}>
                      <CancelPresentationOutlinedIcon />
                    </IconButton>
                  </>
                )}
                {/* НОВАЯ  */}
                {currentRequest.req_status === "new" && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setToInWork(true)
                        setDialogText({
                          title: "Подтверждение открытия контракта",
                          message: "Вы уверены, что хотите открыть контракт?",
                        })
                        setOpenDialog(true)
                      }}>
                      Открыть контракт
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setToCancel(true)
                        setDialogText({
                          title: "Подтверждение отклонить запроса",
                          message: "Вы уверены, что хотите анулировать этот контракт?",
                        })
                        setOpenDialog(true)
                      }}>
                      Аннулировать
                    </Button>
                    <IconButton onClick={() => closeModal()}>
                      <CancelPresentationOutlinedIcon />
                    </IconButton>
                  </>
                )}
                {/* ПОДВЕРЖЕННАЯ ЛАБОРАТОРИЕЙ */}
                {currentRequest.req_status === "approved" && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setToInWork(true)
                        setDialogText({
                          title: "Подтверждение открытия контракта",
                          message: "Вы уверены, что хотите открыть контракт?",
                        })
                        setOpenDialog(true)
                      }}>
                      Открыть контракт
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setToCancel(true)
                        setDialogText({
                          title: "Подтверждение отклонить запроса",
                          message: "Вы уверены, что хотите анулировать этот контракт?",
                        })
                        setOpenDialog(true)
                      }}>
                      Аннулировать
                    </Button>
                    <IconButton onClick={() => closeModal()}>
                      <CancelPresentationOutlinedIcon />
                    </IconButton>
                  </>
                )}
                {/* В РАБОТЕ */}
                {currentRequest.req_status === "in_progress" && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setToConfirm(true)
                        setDialogText({
                          title: "Подтверждение закрытия контракта",
                          message: "Вы уверены, что хотите закрыть контракт?",
                        })
                        setOpenDialog(true)
                      }}>
                      Закрыть контракт
                    </Button>
                    <IconButton onClick={() => closeModal()}>
                      <CancelPresentationOutlinedIcon />
                    </IconButton>
                  </>
                )}
                {/* АНУЛИРОВАННА */}
                {currentRequest.req_status === "canceled" && (
                  <>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        setToDelete(true)
                        setDialogText({
                          title: "Подтверждение удаления запроса",
                          message: "Вы уверены, что хотите удалить этот запрос?",
                        })
                        setOpenDialog(true)
                      }}>
                      Удалить
                    </Button>
                    <IconButton onClick={() => closeModal()}>
                      <CancelPresentationOutlinedIcon />
                    </IconButton>
                  </>
                )}
                {/* ОТКЛОНЕНА */}
                {currentRequest.req_status === "discard" && (
                  <>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        setToDelete(true)
                        setDialogText({
                          title: "Подтверждение удаления запроса",
                          message: "Вы уверены, что хотите удалить этот запрос?",
                        })
                        setOpenDialog(true)
                      }}>
                      Удалить
                    </Button>
                    <IconButton onClick={() => closeModal()}>
                      <CancelPresentationOutlinedIcon />
                    </IconButton>
                  </>
                )}
                {/* ЗАКРЫТА */}
                {currentRequest.req_status === "closed" && (
                  <>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        setToDelete(true)
                        setDialogText({
                          title: "Подтверждение удаления запроса",
                          message: "Вы уверены, что хотите удалить этот запрос?",
                        })
                        setOpenDialog(true)
                      }}>
                      Удалить
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
                if (toDelete) {
                  await handleDelete()
                } else if (toNew) {
                  // await handleApprove("new")
                  await handleChangeStatus("new")
                } else if (toInWork) {
                  await handleChangeStatus("in_progress")
                } else if (toCancel) {
                  await handleChangeStatus("canceled")
                } else if (toConfirm) {
                  await handleChangeStatus("on_confirm")
                }
              } catch (error) {
                console.error("Ошибка при удалении файла:", error.message)
              }
            }}
            title={dialogText.title}
            message={dialogText.message}
          />
          {/* ------------------------ */}
        </>
      )}
    </>
  )
}
