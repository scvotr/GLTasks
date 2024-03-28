import { useAuthContext } from "../context/AuthProvider"
import { SocketProvider } from "../context/SocketProvider"
import { TasksProvider } from "../context/Tasks/TasksProvider"
import { AdminLayout } from "./Layouts/AdminLayout/AdminLayout"
import { DefaultLayoutMain } from "./Layouts/DefaultLayoutMain/DefaultLayoutMain"
import { LeadLayout } from "./Layouts/LeadLayout/LeadLayout"
import { UserLayout } from "./Layouts/UserLayout/UserLayout"
import { LefSideAdmin } from "./Navigation/Admin/LefSideAdmin/LefSideAdmin"
import { LeftSideDrawer } from "./Navigation/User/LeftSideDrawer/LeftSideDrawer"
import { EditProfile } from "./Navigation/User/Menu/Tasks/UserSettings/EditProfile"
import { NotDistributed } from "./Navigation/User/Menu/Tasks/UserSettings/NotDistributed"

export const GlobalWrapper = () => {
  const currentUser = useAuthContext()
  console.log(currentUser)

  const comtentMap = new Map([
    ["admin", () => (<LefSideAdmin currentUser={currentUser}><SocketProvider><AdminLayout /></SocketProvider></LefSideAdmin>),],
    ["chife", () => (<LeftSideDrawer currentUser={currentUser}><SocketProvider><LeadLayout /></SocketProvider></LeftSideDrawer>),],
    ["user", () => (<LeftSideDrawer currentUser={currentUser}><SocketProvider><UserLayout /></SocketProvider></LeftSideDrawer>),],
  ])

  const renderContent = () => {
    if (currentUser && currentUser.login) {
      if(currentUser.emptyProfile) {
        console.log(currentUser.emptyProfile && currentUser.role !== 'admin')
        return  <LeftSideDrawer currentUser={currentUser}><SocketProvider><EditProfile text={'Для дальнейшей работы заполните профиль!'}/></SocketProvider></LeftSideDrawer>
      } else if(currentUser.notDistributed && currentUser.role !== 'admin') {
        return <LeftSideDrawer currentUser={currentUser}><SocketProvider><NotDistributed/></SocketProvider></LeftSideDrawer>
      }
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
