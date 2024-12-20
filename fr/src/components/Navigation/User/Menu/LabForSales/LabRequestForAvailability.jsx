import { useEffect, useState } from "react"
import { AppBarForPage } from "../components/AppBarForPage/AppBarForPage"
import { useAuthContext } from "../../../../../context/AuthProvider"
import { FullScreenDialog } from "../../../../FullScreenDialog/FullScreenDialog"
import { LabsRequestForAvailability } from "../../../../FormComponents/LabsRequestForAvailability/LabsRequestForAvailability"
import { getDataFromEndpoint } from "../../../../../utils/getDataFromEndpoint"
import RequestDetails from "./Tables/RequestDetails"
import TestForm from "../../../../FormComponents/LabsRequestForAvailability/TestForm"
import { ReqForLabTable } from "./Tables/ReqForLabTable"
import { ReqForLabMain } from "./Main/ReqForLabMain"
import { useSocketContext } from "../../../../../context/SocketProvider"
import { Loader } from "../../../../FormComponents/Loader/Loader"

const SALES_SUBDEB_G = "14"

export const LabRequestForAvailability = () => {
  const currentUser = useAuthContext()
  const socket = useSocketContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [data, setData] = useState(null) // Инициализация состояния
  const [addNewRequest, setAddNewRequest] = useState(null)
  console.log('addNewRequest', addNewRequest)
  const [approvedRequest, setApprovedRequest] = useState(null)
  console.log('LabRequestForAvailability', data)

  const filterRequests = async requests => {
    return requests.filter(data => {
      const isSubDepMatch = currentUser.subDep.toString() === data.creator_subDep.toString() && data.approved === 0
      const isApproved = data.approved === 1
      const isUserApproved = data.users.some(user => user.user_id.toString() === currentUser.id.toString() && user.approval_status === "approve")
      return isSubDepMatch || isApproved || isUserApproved
    })
  }

  const openModal = () => {
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setFormKey(prevKey => prevKey + 1)
  }

  const handleReRender = () => {
    setFormKey(prevKey => prevKey + 1);
  };

  const fetchData = async () => {
    const endpoint = `/lab/getAllRequestsWithApprovals`
    setReqStatus({ loading: true, error: null })

    getDataFromEndpoint(currentUser.token, endpoint, "POST", currentUser.id, setReqStatus)
      .then(fetchedData => {
        return filterRequests(fetchedData)
      })
      .then(filteredData => {
        setData(filteredData)
        setReqStatus({ loading: false, error: null })
      })
      .catch(error => {
        setReqStatus({ loading: false, error: error.message })
      })
  }

  useEffect(() => {
    if (currentUser) {
      fetchData()
    }
  }, [currentUser, formKey])

  useEffect(() => {
    const handleSocketEvent = taskData => {
      // При получении события от сокета обновляем данные
      fetchData()
      setApprovedRequest({
        m1: '4',
        m2: "1"
      })
    }
    // Подписка на событие сокета
    socket.on("reqForLab", handleSocketEvent)

    return () => {
      // Отписка от события при размонтировании компонента
      socket.off("reqForLab", handleSocketEvent)
    }
  }, [socket])

  return (
    <>
      <FullScreenDialog isOpen={modalOpen} onClose={closeModal} infoText="Запрос на партию:">
        <TestForm onClose={closeModal} currentUser={currentUser} setAddNewRequest={setAddNewRequest}/>
      </FullScreenDialog>
      <Loader reqStatus={reqStatus}>
        <AppBarForPage title="Запрос в лабораторию: " openModal={currentUser.subDep.toString() === SALES_SUBDEB_G ? openModal : null} />
        <ReqForLabMain requests={data} currentUser={currentUser} reRender={handleReRender} addNewRequest={addNewRequest} approvedRequest={approvedRequest}/>
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
