import { ReqForLabTable } from "./Tables/ReqForLabTable"

export const ReqForLabTableView = ({ requests, currentUser, reRender, checkFullScreenOpen, setCheckFullScreenOpen }) => {

  return (
    <>
      <ReqForLabTable
        requests={requests}
        currentUser={currentUser}
        reRender={reRender}
        setCheckFullScreenOpen={setCheckFullScreenOpen}
        checkFullScreenOpen={checkFullScreenOpen}
      />
    </>
  )
}
