import { useEffect, useState } from "react"
import { useAuthContext } from "../../../../../context/AuthProvider"
import { useSocketContext } from "../../../../../context/SocketProvider"
import { AppBarForPage } from "../components/AppBarForPage/AppBarForPage"
import { getDataFromEndpoint } from "../../../../../utils/getDataFromEndpoint"
import { Loader } from "../../../../FormComponents/Loader/Loader"
import { FullScreenDialog } from "../../../../FullScreenDialog/FullScreenDialog"
import AddNewLabReq from "../../../../FormComponents/LabForSalesMain/AddNewLabReq"
import { LabForSalesView } from "./Main/LabForSalesView"

const SALES_SUBDEB_G = "13"

const getAllRequest = async (currentUser, setReqStatus, setRequests) => {
  const endpoint = `/lab/getAllRequestsWithApprovals`
  setReqStatus({ loading: true, error: null })

  try {
    const data = await getDataFromEndpoint(currentUser.token, endpoint, "POST", currentUser.id, setReqStatus)
    setRequests(data)
    setReqStatus({ loading: false, error: null })
  } catch (error) {
    setReqStatus({ loading: false, error: error.message })
  }
}

export const LabForSalesMain = () => {
  const currentUser = useAuthContext()
  const socket = useSocketContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [requests, setRequests] = useState([])
  const [checkFullScreenOpen, setCheckFullScreenOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        await getAllRequest(currentUser, setReqStatus, setRequests)
      }
    }
    fetchData()
  }, [currentUser, formKey])

  const handleSocketEvent = async () => {
    await getAllRequest(currentUser, setReqStatus, setRequests)
  }
  const handleNewComment = async () => {
    if (checkFullScreenOpen === false) {
      setFormKey(prevKey => prevKey + 1)
    }
  }

  useEffect(() => {
    socket.on("reqForLab", handleSocketEvent)
    socket.on("reqForLabNewComment", handleNewComment)

    return () => {
      socket.off("reqForLab", handleSocketEvent)
      socket.off("reqForLabNewComment", handleNewComment)
    }
  }, [socket, checkFullScreenOpen])

  const openModal = () => {
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setFormKey(prevKey => prevKey + 1)
  }
  const handleReRender = () => {
    setFormKey(prevKey => prevKey + 1)
  }

  return (
    <>
      <FullScreenDialog isOpen={modalOpen} onClose={closeModal} infoText="Запрос на партию:">
        <AddNewLabReq onClose={closeModal} currentUser={currentUser} />
      </FullScreenDialog>
      <AppBarForPage title="Лаборатория: " openModal={currentUser.subDep.toString() === SALES_SUBDEB_G ? openModal : null} />
      <Loader reqStatus={reqStatus}>
        <LabForSalesView
          requests={requests}
          currentUser={currentUser}
          // - Re render main cmp
          reRender={handleReRender}
          checkFullScreenOpen={checkFullScreenOpen}
          setCheckFullScreenOpen={setCheckFullScreenOpen}
          isClosedView={false}
        />
      </Loader>
    </>
  )
}
