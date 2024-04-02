const { createContext, useContext, useState, useCallback, useEffect } = require("react");

const AuthContext = createContext()

export const useAuthContext = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({children}) => {
  const [id, setId] = useState('')
  const [role, setRole] = useState('')
  const [roleRef, setRoleRef] = useState('')
  const [loginName, setLoginName] = useState('')
  const [name, setName] = useState('')
  const [token, setToken] = useState('')
  const [dep, setDep] = useState('')
  const [subDep, setSubDep] = useState('')
  const [position, setPosition] = useState('')
  const [login, setLogin] = useState(false)
  const [notDistributed, setNotDistributed] = useState()
  const [profile ,setProfile] = useState()
  
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      setId(localStorage.getItem('userId'))
      setRole(localStorage.getItem('userRole'))
      setName(localStorage.getItem('userName'))
      setDep(localStorage.getItem('dep'))
      setSubDep(localStorage.getItem('subDep'))
      setPosition(localStorage.getItem('position'))
      setLogin(true);
   
      setProfile(localStorage.getItem("emptyProfile"))
      setNotDistributed(localStorage.getItem("notDistributed"))
    }
  }, []);

  const updateToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken)
  } 

  const handleServerResponse = useCallback((response) => {
    if (response) {
      const { id, role, name, loginName, dep, subDep, position, token, emptyProfile, notDistributed} = response
      setId(id)
      setRole(role)
      setLoginName(loginName)
      setName(name)
      setDep(dep)
      setSubDep(subDep)
      setPosition(position)
      setToken(token)
      setLogin(true)
      setProfile(emptyProfile)
      setNotDistributed(notDistributed)
      // Сохранение данных в localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("loginName", loginName)
      localStorage.setItem("userName", name)
      localStorage.setItem("userRole", role)
      localStorage.setItem("userId", id)
      localStorage.setItem("dep", dep)
      localStorage.setItem("subDep", subDep)
      localStorage.setItem("position", position)
      localStorage.setItem("emptyProfile", emptyProfile)
      localStorage.setItem("notDistributed", notDistributed)
    } else {
      setLogin(false);
    }
  }, []);

  const logout = () => {
    setLogin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('loginName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userRoleRef');
    localStorage.removeItem('userName');
    localStorage.removeItem('dep');
    localStorage.removeItem('subDep');
    localStorage.removeItem('position');
    localStorage.removeItem('emptyProfile');
    localStorage.removeItem('notDistributed');
  };

  return (
    <AuthContext.Provider
      value={{
        id,
        loginName,
        name,
        role,
        roleRef,
        token,
        login,
        dep,
        subDep,
        position,
        profile,
        notDistributed,
        handleServerResponse,
        updateToken,
        logout,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}