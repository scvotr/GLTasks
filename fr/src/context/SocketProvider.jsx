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
  const leadSubDep = "leadSubDep_" + currentUser.subDep
  const userSocket = "user" + currentUser.id

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
    socket.on(leadSubDep, data => {
      console.log(`подключен к комнате leadSubDep: ${leadSubDep}`, data.taskData)
    })
    socket.on(userSocket, data => {
      console.log(`подключен к комнате userSocket: ${userSocket}`, data.taskData)
    })

    window.addEventListener("beforeunload", () => {
      socket.disconnect()
    })

    return () => {
      socket.off("connect")
      socket.off(leadSubDep)
      socket.off(userSocket)
      socket.disconnect()
      window.removeEventListener("beforeunload", () => socket.disconnect())
    }
  }, [currentUser])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export default function SocketConnectedApp() {
  return (
    <SocketProvider>
      <App />
    </SocketProvider>
  )
}