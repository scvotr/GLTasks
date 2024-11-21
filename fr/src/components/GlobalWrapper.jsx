import { useAuthContext } from "../context/AuthProvider"
// import { SocketProvider } from "../context/SocketProvider"
import { TasksProvider } from "../context/Tasks/TasksProvider"
import { AdminLayout } from "./Layouts/AdminLayout/AdminLayout"
import { DefaultLayoutMain } from "./Layouts/DefaultLayoutMain/DefaultLayoutMain"
import { GeneralLayout } from "./Layouts/GeneralLayout/GeneralLayout"
import { LeadLayout } from "./Layouts/LeadLayout/LeadLayout"
import { NewUserLayout } from "./Layouts/NewUserLayout/NewUserLayout"
import { UserLayout } from "./Layouts/UserLayout/UserLayout"
import { LefSideAdmin } from "./Navigation/Admin/LefSideAdmin/LefSideAdmin"
import { LeftSideDrawer } from "./Navigation/User/LeftSideDrawer/LeftSideDrawer"
import { LeftSideDrawerGeneral } from "./Navigation/User/LeftSideDrawerGeneral/LeftSideDrawerGeneral"

export const GlobalWrapper = () => {
  const currentUser = useAuthContext()
  // ! need test wtf
  // const comtentMap = new Map([
  //   ["admin", () => (<LefSideAdmin currentUser={currentUser}><SocketProvider><AdminLayout /></SocketProvider></LefSideAdmin>),],
  //   ["general", () => (<LeftSideDrawerGeneral currentUser={currentUser}><SocketProvider><GeneralLayout /></SocketProvider></LeftSideDrawerGeneral>),],
  //   ["chife", () => (<LeftSideDrawer currentUser={currentUser}><SocketProvider><LeadLayout /></SocketProvider></LeftSideDrawer>),],
  //   ["user", () => (<LeftSideDrawer currentUser={currentUser}><SocketProvider><UserLayout /></SocketProvider></LeftSideDrawer>),],
  //   ["new", () => (<LeftSideDrawer currentUser={currentUser}><SocketProvider><NewUserLayout /></SocketProvider></LeftSideDrawer>),],
  // ])
  
  const contentMap = new Map([
    ["admin", () => (<LefSideAdmin currentUser={currentUser}><AdminLayout /></LefSideAdmin>),],
    ["general", () => (<LeftSideDrawerGeneral currentUser={currentUser}><GeneralLayout /></LeftSideDrawerGeneral>),],
    ["chife", () => (<LeftSideDrawer currentUser={currentUser}><LeadLayout /></LeftSideDrawer>),],
    ["user", () => (<LeftSideDrawer currentUser={currentUser}><UserLayout /></LeftSideDrawer>),],
    ["new", () => (<LeftSideDrawer currentUser={currentUser}><NewUserLayout /></LeftSideDrawer>),],
  ])

  const renderContent = () => {
    // need check token then render content!!!
    if (currentUser && currentUser.login) {
      const getContentByRole = contentMap.get(currentUser.role)
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
