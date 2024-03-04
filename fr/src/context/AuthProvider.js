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
    if(response) {
      console.log(response)
      setId(response.id)
      setRole(response.role)
      setRoleRef(response.role_ref)
      setName(response.name)
      setDep(response.dep)
      setSubDep(response.subDep)
      setPosition(response.position)
      setToken(response.token)
      setLogin(true)
      localStorage.setItem("token", response.token);
      localStorage.setItem("userName", response.name);
      localStorage.setItem("userRole", response.role);
      localStorage.setItem("userRoleRef", response.roleRef);
      localStorage.setItem("userId", response.id);
      localStorage.setItem("dep", response.dep);
      localStorage.setItem("subDep", response.subDep);
      localStorage.setItem("position", response.position);
    } else {
      setLogin(false)
    }
  }, [])

  const logout = () => {
    setLogin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userRoleRef');
    localStorage.removeItem('userName');
    localStorage.removeItem('dep');
    localStorage.removeItem('subDep');
    localStorage.removeItem('position');
  };

  return (
    <AuthContext.Provider
      value={{
        id,
        name,
        role,
        roleRef,
        token,
        login,
        dep,
        subDep,
        position,
        handleServerResponse,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}