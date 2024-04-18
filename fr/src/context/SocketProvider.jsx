import io from "socket.io-client"
import { HOST_SOCKET } from "../utils/remoteHosts"
import { useEffect, createContext, useContext } from "react"
import App from "../App"
import { useAuthContext } from "./AuthProvider"

export const SocketContext = createContext()

export const useSocketContext = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }) => {
  const currentUser = useAuthContext()
  const generalDep = "generalDep_" + currentUser.dep
  const leadSubDep = "leadSubDep_" + currentUser.subDep
  const userSocket = "user" + currentUser.id
  const adminSocket = (currentUser.role === 'admin') ? "adm" + currentUser.id : null; 

  const socket = io(HOST_SOCKET, {
    extraHeaders: { Authorization: currentUser.token },
  })

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("getMyRooms")
    })
    socket.on("yourRooms", rooms => {
      // console.log("Я подключен к комнатам:", rooms)
    })
    socket.on(generalDep, data => {
      console.log(`подключен к комнате generalDep: ${generalDep}`, data.taskData)
    })
    socket.on(leadSubDep, data => {
      console.log(`подключен к комнате leadSubDep: ${leadSubDep}`, data.taskData)
    })
    socket.on(userSocket, data => {
      console.log(`подключен к комнате userSocket: ${userSocket}`, data.taskData)
    })
    socket.on(adminSocket, data => {
      console.log(`подключен к комнате admSocket: ${adminSocket}`, data.taskData)
    })

    window.addEventListener("beforeunload", () => {
      socket.disconnect()
    })

    return () => {
      socket.off("connect")
      socket.off(generalDep)
      socket.off(leadSubDep)
      socket.off(userSocket)
      socket.disconnect()
      window.removeEventListener("beforeunload", () => socket.disconnect())
    }
  }, [currentUser])

  return currentUser ? <SocketContext.Provider value={socket}>{children}</SocketContext.Provider> : <>d</>
}

export default function SocketConnectedApp() {
  return (
    <SocketProvider>
      <App />
    </SocketProvider>
  )
}