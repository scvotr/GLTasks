const { createContext, useContext, useState, useCallback } = require("react");

const AuthContext = createContext()

export const useAuthContext = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({children}) => {
  const [id, setId] = useState('')
  const [role, setRole] = useState('')
  const [roleRef, setRoleRef] = useState('')
  const [name, setName] = useState('')
  const [token, setToken] = useState('')
  const [dep, setDep] = useState('')
  const [subDep, setSubDep] = useState('')
  const [position, setPosition] = useState('')
  const [login, setLogin] = useState(false)
  

  const handleServerResponse = useCallback((response) => {
    console.log(response)
    if(response) {
      setId(response.id)
      setRole(response.role)
      setRoleRef(response.role_ref)
      setName(response.name)
      setDep(response.dep)
      setSubDep(response.subDep)
      setPosition(response.position)
      setToken(response.token)
      setLogin(true)
    } else {
      setLogin(false)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        handleServerResponse
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}