import { useAuthContext } from "../../../../context/AuthProvider"
import { FullTaskInfo } from "../../Tasks/FullTaskInfo/FullTaskInfo"
import { ToApprove } from "./ToApprove/ToApprove"

export const RenderByAction = ({actionByStatus, task, onTaskSubmit}) => {
  const currentUser = useAuthContext()
  console.log(actionByStatus)

  const actionTypes = new Map([
    ["toApprove", () => currentUser.role === 'chife' ? <ToApprove task={task} onTaskSubmit={onTaskSubmit} /> : <FullTaskInfo task={task} onTaskSubmit={onTaskSubmit} />],
    ["approved", () => console.log('>>>>>', actionByStatus)],
    // ["underReview", () => <UnderReview task={task} onTaskSubmit={onTaskSubmit} />],
    // ["setClose", () => <SetClose task={task} onTaskSubmit={onTaskSubmit} />],
    ["viewOnly", () => <FullTaskInfo task={task} onTaskSubmit={onTaskSubmit} />],
  ])

  const renderByActionType = () => {
    const render = actionTypes.get(actionByStatus)
    // const render = actionTypes[actionType]
    return render ? render() :  <>!!!</>
  }

  return (
    <>
      {renderByActionType()}
    </>
  )
}