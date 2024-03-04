const { createContext, useContext, useState, useCallback, useEffect } = require("react");

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
  
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setId(localStorage.getItem('userId'));
      setRole(localStorage.getItem('userRole'));
      setName(localStorage.getItem('userName'));
      setDep(localStorage.getItem('dep'));
      setSubDep(localStorage.getItem('subDep'));
      setPosition(localStorage.getItem('position'));
      setLogin(true);
    }
  }, []);

  const handleServerResponse = useCallback((response) => {
    if (response) {
      const { id, role, name, dep, subDep, position, token } = response;
      setId(id);
      setRole(role);
      setName(name);
      setDep(dep);
      setSubDep(subDep);
      setPosition(position);
      setToken(token);
      setLogin(true);
      // Сохранение данных в localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userName", name);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userId", id);
      localStorage.setItem("dep", dep);
      localStorage.setItem("subDep", subDep);
      localStorage.setItem("position", position);
    } else {
      setLogin(false);
    }
  }, []);

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