import { useAuthContext } from "../../../../context/AuthProvider"
import { FullTaskInfo } from "../../Tasks/FullTaskInfo/FullTaskInfo"
import { CloseTask } from "./CloseTask/CloseTask"
import { SendToReview } from "./SendToReview/SendToReview"
import { SetResponsibleUser } from "./SetResponsibleUser/SetResponsibleUser"
import { ToApprove } from "./ToApprove/ToApprove"

export const RenderByAction = ({ actionByStatus, task, onTaskSubmit }) => {
  const currentUser = useAuthContext()

  const taskToSubDep = currentUser.role === "chife" && currentUser.subDep.toString() === task.responsible_subdepartment_id.toString()

  const actionTypes = new Map([
    [
      "toApprove",
      () => {
        if(currentUser.role === "chife" && currentUser.subDep.toString() !== task.responsible_subdepartment_id.toString()) {
          return <ToApprove task={task} onTaskSubmit={onTaskSubmit} />
        } else if(currentUser.role === "chife" && currentUser.subDep.toString() === task.responsible_subdepartment_id.toString()){
          return <SetResponsibleUser task={task} onTaskSubmit={onTaskSubmit} />
        } else if(currentUser.role === "user") {
          return <FullTaskInfo task={task} onTaskSubmit={onTaskSubmit} />
        } 
      },
    ],
    [
      "approved",
      () => (taskToSubDep ? <SetResponsibleUser task={task} onTaskSubmit={onTaskSubmit} /> : <FullTaskInfo task={task} onTaskSubmit={onTaskSubmit} />),
    ],
    [
      "inWork",
      () => {
        if(!task.responsible_user_id && currentUser.role === "user") {
          return <FullTaskInfo task={task} onTaskSubmit={onTaskSubmit} />
        } else if(currentUser.role === "chife" && currentUser.subDep.toString() === task.responsible_subdepartment_id.toString()) {
          return <SendToReview task={task} onTaskSubmit={onTaskSubmit} />
        } else if(currentUser.role === "user" && currentUser.id.toString() === task.responsible_user_id.toString()) {
          return <SendToReview task={task} onTaskSubmit={onTaskSubmit} />
        } else {
          return <FullTaskInfo task={task} onTaskSubmit={onTaskSubmit} />
        }
      }
    ],
    [
      "needToConfirm",
      () => {
        if(currentUser.role === "user" && currentUser.id.toString() === task.appoint_user_id.toString()){
          return <CloseTask task={task} onTaskSubmit={onTaskSubmit} />
        } else if (currentUser.role === "chife" && currentUser.subDep.toString() === task.appoint_subdepartment_id.toString()) {
          return <CloseTask task={task} onTaskSubmit={onTaskSubmit} />
        } else {
          return <FullTaskInfo task={task} onTaskSubmit={onTaskSubmit} />
        }
      }
      // () => canClose ? <CloseTask task={task} onTaskSubmit={onTaskSubmit} /> : <FullTaskInfo task={task} onTaskSubmit={onTaskSubmit} />
    ],
    [
      "closed",
      () => <FullTaskInfo task={task} onTaskSubmit={onTaskSubmit} />
    ],
  ])

  const renderByActionType = () => {
    const render = actionTypes.get(actionByStatus)
    return render ? render() : <>Неизвестное событие</>
  }

  return <>{renderByActionType()}</>
}
