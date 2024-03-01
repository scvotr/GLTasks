const { createContext, useContext } = require("react");

const AuthContext = createContext()

export const useAuthContext = () => {
  return useContext(AuthContext)
}