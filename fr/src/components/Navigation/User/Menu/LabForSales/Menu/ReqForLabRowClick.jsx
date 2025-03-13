import { useEffect, useState } from "react"
import { formatDateV2 } from "../../../../../../utils/formatDate"
import { FullScreenDialog } from "../../../../../FullScreenDialog/FullScreenDialog"
import { ReqInfoView } from "./ReqInfoView"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { Loader } from "../../../../../FormComponents/Loader/Loader"

/**
 * Component for handling the click event on a laboratory request row.
 * Displays detailed information about the request in a full-screen dialog.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Indicates whether the dialog is open.
 * @param {Function} props.onClose - Function to close the dialog.
 * @param {Object} props.currentRequest - The current laboratory request data.
 * @param {Object} props.currentUser - The current user data.
 * @param {Function} props.reRender - Function to re-render the parent component.
 * @param {boolean} props.checkFullScreenOpen - Indicates if the full-screen mode is active.
 * @param {Function} props.setCheckFullScreenOpen - Function to update the full-screen mode state.
 */

export const ReqForLabRowClick = ({ isOpen, onClose, currentRequest, currentUser, reRender, checkFullScreenOpen, setCheckFullScreenOpen }) => {
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })

  const handleInfoView = async () => {
    const data = {
      req_id: currentRequest.reqForAvail_id,
      user_id: currentUser.id,
      read_status: "readed",
    }
    try {
      setCheckFullScreenOpen(true)
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, `/lab/updateReadStatus`, "POST", data, setReqStatus)
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  useEffect(() => {
    if (isOpen) {
      handleInfoView()
    }
  }, [isOpen])

  const labReqTitle = `Запрос АО "${currentRequest.department_name}" от ${formatDateV2(currentRequest.created_at)} культура: ${
    currentRequest.culture
  }, масса: ${currentRequest.tonnage}`

  return (
    <FullScreenDialog isOpen={isOpen} onClose={onClose} infoText={labReqTitle}>
      <Loader reqStatus={reqStatus}>
        <ReqInfoView request={currentRequest} currentUser={currentUser} reRender={reRender} checkFullScreenOpen={checkFullScreenOpen} closeModal={onClose} />
      </Loader>
    </FullScreenDialog>
  )
}
