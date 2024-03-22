import { useAuthContext } from "../context/AuthProvider"
import { TasksProvider } from "../context/Tasks/TasksProvider"
import { AdminLayout } from "./Layouts/AdminLayout/AdminLayout"
import { DefaultLayoutMain } from "./Layouts/DefaultLayoutMain/DefaultLayoutMain"
import { LeadLayout } from "./Layouts/LeadLayout/LeadLayout"
import { UserLayout } from "./Layouts/UserLayout/UserLayout"
import { LefSideAdmin } from "./Navigation/Admin/LefSideAdmin/LefSideAdmin"
import { LeftSideDrawer } from "./Navigation/User/LeftSideDrawer/LeftSideDrawer"

export const GlobalWrapper = () => {
  const currentUser = useAuthContext()

  const comtentMap = new Map([
    ["admin", () => (<LefSideAdmin currentUser={currentUser}><AdminLayout /></LefSideAdmin>),],
    ["chife", () => (<LeftSideDrawer currentUser={currentUser}><LeadLayout /></LeftSideDrawer>),],
    ["user", () => (<LeftSideDrawer currentUser={currentUser}><UserLayout /></LeftSideDrawer>),],
  ])

  const renderContent = () => {
    if (currentUser && currentUser.login) {
      const getContentByRole = comtentMap.get(currentUser.role)
      return getContentByRole ? getContentByRole() : <DefaultLayoutMain />
    } else {
      return <DefaultLayoutMain />
    }
  }

  return (
    <>
      <TasksProvider currentUser={currentUser}>
        {renderContent()}
      </TasksProvider>
    </>
  )
}
