import { useEffect, useState } from "react"
import { AppBarForPage } from "../components/AppBarForPage/AppBarForPage"
import { useAuthContext } from "../../../../../context/AuthProvider"
import { FullScreenDialog } from "../../../../FullScreenDialog/FullScreenDialog"
import { getDataFromEndpoint } from "../../../../../utils/getDataFromEndpoint"
import TestForm from "../../../../FormComponents/LabsRequestForAvailability/TestForm"
import { ReqForLabMain } from "./Main/ReqForLabMain"
import { useSocketContext } from "../../../../../context/SocketProvider"
import { Loader } from "../../../../FormComponents/Loader/Loader"

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

export const LabRequestForAvailability = () => {
  const currentUser = useAuthContext()
  const socket = useSocketContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [data, setData] = useState([])
  const [addNewRequest, setAddNewRequest] = useState(null)
  const [approvedRequest, setApprovedRequest] = useState(null)
  const [checkFullScreenOpen, setCheckFullScreenOpen] = useState(false)

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

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        await getAllRequest(currentUser, setReqStatus, setData)
      }
    }

    fetchData()
  }, [currentUser, formKey])

  useEffect(() => {
    const handleSocketEvent = async taskData => {
      // При получении события от сокета обновляем данные
      await getAllRequest(currentUser, setReqStatus, setData)
      // херата выпилить
      setApprovedRequest({
        newReq: "1",
        toApprove: "2",
        approved: "3",
        // inWork: "4",
      })
    }
    // Подписка на событие сокета
    socket.on("reqForLab", handleSocketEvent)

    return () => {
      // Отписка от события при размонтировании компонента
      socket.off("reqForLab", handleSocketEvent)
    }
  }, [socket])

  // !----------------------------------
  useEffect(() => {
    const handleNewComment = () => {
      console.log("checkFullScreenOpen:", checkFullScreenOpen)
      if (checkFullScreenOpen === false) {
        console.log("Updating formKey")
        setFormKey(prevKey => prevKey + 1)
      }
    }
    socket.on("reqForLabNewComment", handleNewComment)

    return () => {
      socket.off("reqForLabNewComment", handleNewComment)
    }
  }, [socket, checkFullScreenOpen])
  // !----------------------------------

  const resetApprovedRequest = () => {
    setApprovedRequest(null)
  }
  const resetAddNewRequest = () => {
    setAddNewRequest(null)
  }

  return (
    <>
      <FullScreenDialog isOpen={modalOpen} onClose={closeModal} infoText="Запрос на партию:">
        <TestForm onClose={closeModal} currentUser={currentUser} setAddNewRequest={setAddNewRequest} />
      </FullScreenDialog>
      <Loader reqStatus={reqStatus}>
        <AppBarForPage title="Запрос: " openModal={currentUser.subDep.toString() === SALES_SUBDEB_G ? openModal : null} />
        <ReqForLabMain
          requests={data}
          currentUser={currentUser}
          reRender={handleReRender}
          addNewRequest={addNewRequest}
          approvedRequest={approvedRequest}
          resetApprovedRequest={resetApprovedRequest}
          resetAddNewRequest={resetAddNewRequest}
          setCheckFullScreenOpen={setCheckFullScreenOpen} // Передаем функцию управления состоянием setCheckFullScreenOpen checkFullScreenOpen
          checkFullScreenOpen={checkFullScreenOpen} // Передаем текущее состояние
        />
      </Loader>
    </>
  )
}

{
  /* <LabsRequestForAvailability reRender={setFormKey} onClose={closeModal} currentUser={currentUser} /> */
}

{
  /* <ReqForLabTable requests={data} currentUser={currentUser} reRender={setFormKey}/> */
}
{
  /* <RequestDetails requests={data} currentUser={currentUser} reRender={setFormKey} /> */
}
