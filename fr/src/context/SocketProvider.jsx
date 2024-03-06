import io from "socket.io-client"
import { HOST_SOCKET } from "../utils/remoteHosts"
import { useEffect, createContext, useContext } from "react"
import App from "../App"
import { useAuthContext } from "./AuthProvider"

export const SocketContext = createContext()

export const useSocketContext = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }) => {}
